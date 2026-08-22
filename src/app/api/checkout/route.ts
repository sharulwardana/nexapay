import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import { PAYMENT_METHODS, getLoyaltyDiscount } from '@/lib/constants';
import { sendPushToUser } from '@/lib/push';
import { generateInvoiceId } from '@/lib/utils';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/sanitize';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit({
  interval: 60000, // 1 minute
  uniqueTokenPerInterval: 500, // max 500 users per minute
});

const checkoutSchema = z.object({
  productId: z.string().min(1, 'Product ID required').max(100),
  denominationId: z.string().min(1, 'Denomination ID required').max(100),
  gameUserId: z.string().min(1, 'Game User ID required').max(50).transform(sanitizeInput),
  gameServerId: z.string().max(20).transform(sanitizeInput).optional(),
  paymentMethod: z.string().min(1, 'Payment method required').max(30),
});


export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    const isGuest = !userId;

    try {
      // Limit to 3 checkout requests per minute per IP / User
      const clientIp = req.headers.get('x-forwarded-for') || 'anon';
      await limiter.check(5, userId || clientIp);
    } catch {
      return NextResponse.json({ error: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.' }, { status: 429 });
    }

    const body = await req.json();

    // Validate input with Zod
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { productId, denominationId, gameUserId, gameServerId, paymentMethod } = parsed.data;

    // 1. Fetch Denomination and validate
    const denomination = await prisma.denomination.findUnique({
      where: { id: denominationId },
      include: { product: true }
    });

    if (!denomination || denomination.productId !== productId) {
      return NextResponse.json({ error: 'Invalid denomination or product' }, { status: 400 });
    }

    if (!denomination.isActive) {
      return NextResponse.json({ error: 'Denomination ini tidak tersedia' }, { status: 400 });
    }

    // Check stock
    if (denomination.stock !== -1 && denomination.stock <= 0) {
      return NextResponse.json({ error: 'Stok habis' }, { status: 400 });
    }

    const paymentInfo = PAYMENT_METHODS.find(p => p.id === paymentMethod);
    if (!paymentInfo) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    // Check flash sale expiration
    const isFlashSaleValid = denomination.isFlashSale
      && denomination.flashSalePrice
      && denomination.flashSaleEnd
      && new Date(denomination.flashSaleEnd) > new Date();

    const basePrice = isFlashSaleValid
      ? denomination.flashSalePrice!
      : denomination.price;

    // 2. Use $transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      let targetUserId = userId;

      if (!targetUserId) {
        if (paymentMethod === 'NEXA_WALLET') {
          throw new Error('Untuk membayar menggunakan Saldo Wallet, silakan login terlebih dahulu.');
        }
        // Get or create guest user account
        const guestUser = await tx.user.upsert({
          where: { email: 'guest@nexapay.id' },
          update: {},
          create: {
            id: 'guest-user',
            name: 'Pembeli Tamu (Guest)',
            email: 'guest@nexapay.id',
            role: 'USER',
            walletBalance: 0,
            loyaltyLevel: 'BRONZE',
            loyaltyPoints: 0,
          }
        });
        targetUserId = guestUser.id;
      }

      // Fetch user inside transaction for consistency
      const user = await tx.user.findUnique({ where: { id: targetUserId } });
      if (!user) throw new Error('User not found');

      // Calculate discount using unified LOYALTY_LEVELS (matches frontend)
      const discount = isGuest ? 0 : getLoyaltyDiscount(user.loyaltyPoints);
      const discountAmount = Math.floor(basePrice * (discount / 100));
      const subtotal = basePrice - discountAmount;
      const fee = paymentInfo.fee;
      const totalAmount = subtotal + fee;

      // Handle NexaPay Wallet payment
      if (paymentMethod === 'NEXA_WALLET') {
        if (user.walletBalance < totalAmount) {
          throw new Error('Saldo NexaPay Wallet tidak mencukupi.');
        }

        // Deduct balance atomically within transaction
        await tx.user.update({
          where: { id: targetUserId },
          data: {
            walletBalance: { decrement: totalAmount }
          }
        });
      }

      // Decrement stock if applicable
      if (denomination.stock !== -1) {
        await tx.denomination.update({
          where: { id: denominationId },
          data: { stock: { decrement: 1 } }
        });
      }

      // Calculate loyalty points earned (1 point per Rp 1.000)
      const pointsEarned = Math.floor(totalAmount / 1000);

      // Wallet payments are completed immediately (balance already deducted above).
      // All other methods (QRIS, bank transfer, etc.) start as PENDING
      // and should be confirmed via payment gateway webhook.
      const isWalletPayment = paymentMethod === 'NEXA_WALLET';
      const transactionStatus = isWalletPayment ? 'COMPLETED' : 'PENDING';

      // Set expiration for pending transactions (24 hours)
      const expiresAt = isWalletPayment
        ? null
        : new Date(Date.now() + 24 * 60 * 60 * 1000);

      const transaction = await tx.transaction.create({
        data: {
          userId: targetUserId,
          productId,
          productName: denomination.product.name,
          category: denomination.product.category,
          denominationId,
          paymentMethod,
          gameUserId,
          gameServerId: gameServerId || null,
          amount: subtotal,
          discount: discountAmount,
          totalAmount,
          status: transactionStatus,
          expiresAt,
          invoiceId: generateInvoiceId('INV'),
        }
      });

      // Award loyalty points to registered users upon completed transaction
      if (transactionStatus === 'COMPLETED' && !isGuest) {
        await tx.user.update({
          where: { id: targetUserId },
          data: {
            loyaltyPoints: { increment: pointsEarned }
          }
        });
      }

      return { transaction, pointsEarned: isWalletPayment ? pointsEarned : 0, isWalletPayment };
    });

    // Send push notification if completed via wallet
    if (result.isWalletPayment && !isGuest && result.transaction.userId) {
      sendPushToUser(result.transaction.userId, {
        title: 'Top Up Berhasil! 💎',
        body: `Pembayaran ${result.transaction.productName} berhasil via NexaPay Wallet!`,
        icon: '/favicon.ico',
        url: `/payment-status/${result.transaction.invoiceId}`,
      }).catch((err) => console.error('Failed to send push on wallet checkout:', err));
    }

    return NextResponse.json({
      success: true,
      transactionId: result.transaction.invoiceId,
      pointsEarned: result.pointsEarned,
      status: result.transaction.status,
      isWalletPayment: result.isWalletPayment,
    });

  } catch (error: unknown) {
    console.error('Checkout error:', error);

    // Return user-friendly error messages for known errors
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Saldo NexaPay Wallet tidak mencukupi.') {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.includes('Untuk membayar menggunakan Saldo Wallet')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
