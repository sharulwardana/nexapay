import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import rateLimit from '@/lib/rateLimit';
import { z } from 'zod';

const limiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
});

const topupSchema = z.object({
  amount: z.number().positive('Jumlah harus positif').max(10000000, 'Maksimal Rp 10.000.000'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Silakan login terlebih dahulu.' }, { status: 401 });
    }

    // Rate limit: 5 topup attempts per minute
    try {
      await limiter.check(5, `wallet_${session.user.id}`);
    } catch {
      return NextResponse.json({ error: 'Terlalu banyak permintaan' }, { status: 429 });
    }

    // SECURITY: Block wallet top-up in production until real payment gateway is integrated.
    // In production, wallet balance should ONLY be updated via payment gateway webhook
    // callback (e.g., Midtrans/Xendit) AFTER successful payment verification.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        error: 'Fitur top up wallet belum tersedia. Gunakan metode pembayaran langsung saat checkout.'
      }, { status: 403 });
    }

    const body = await req.json();

    // Validate input
    const parsed = topupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { amount } = parsed.data;

    // NOTE: This is a DEVELOPMENT-ONLY endpoint for testing.
    // In production, this should be replaced with a payment gateway webhook handler:
    //
    // 1. User initiates top-up → frontend calls payment gateway SDK
    // 2. Payment gateway processes payment
    // 3. Payment gateway sends webhook to /api/webhook/midtrans (or /xendit)
    // 4. Webhook handler verifies signature + payment status
    // 5. ONLY THEN update wallet balance
    //
    // See: https://docs.midtrans.com/docs/https-notification-webhooks

    // Update user wallet balance (DEV ONLY — simulates instant top up)
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        walletBalance: {
          increment: amount
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Top up berhasil (mode development)',
      newBalance: updatedUser.walletBalance 
    });

  } catch (error: any) {
    console.error('Wallet topup error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
