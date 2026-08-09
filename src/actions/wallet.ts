'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/../auth';

export async function getLiveWalletBalance() {
  try {
    const session = await auth();
    if (!session?.user?.id) return 0;
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { walletBalance: true },
    });
    return user?.walletBalance || 0;
  } catch (error) {
    return 0;
  }
}

export async function topUpWallet(amount: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Silakan login terlebih dahulu' };
    }

    if (!amount || amount < 10000) {
      return { success: false, error: 'Minimal top up adalah Rp 10.000' };
    }

    if (amount > 10000000) {
      return { success: false, error: 'Maksimal top up adalah Rp 10.000.000' };
    }

    // Use crypto-safe invoice ID
    const invoiceId = `NEXA-TOPUP-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { walletBalance: { increment: amount } },
      }),
      prisma.transaction.create({
        data: {
          invoiceId,
          userId: session.user.id,
          productName: 'Top Up Saldo Wallet NexaPay',
          category: 'E-Wallet',
          targetAccount: session.user.email || session.user.id,
          amount: amount,
          totalAmount: amount,
          paymentMethod: 'TRANSFER_MANUAL',
          status: 'COMPLETED',
          notes: 'Top Up Saldo Instant',
        },
      }),
    ]);

    revalidatePath('/dashboard/wallet');
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return { 
      success: true, 
      balance: updatedUser.walletBalance,
      invoiceId 
    };
  } catch (error: any) {
    console.error('Failed to topup wallet:', error);
    return { success: false, error: error?.message || 'Gagal melakukan top up saldo' };
  }
}

export async function transferWallet(recipientEmailOrPhone: string, amount: number, notes?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Silakan login terlebih dahulu' };
    }

    if (!amount || amount < 5000) {
      return { success: false, error: 'Minimal transfer adalah Rp 5.000' };
    }

    const cleanInput = recipientEmailOrPhone.trim().toLowerCase();

    // Find recipient by email or phone
    const recipient = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          { phone: cleanInput },
        ],
      },
      select: { id: true, name: true, email: true },
    });

    if (!recipient) {
      return { success: false, error: 'Penerima tidak ditemukan. Periksa kembali email atau nomor HP.' };
    }

    if (recipient.id === session.user.id) {
      return { success: false, error: 'Tidak dapat mentransfer saldo ke akun Anda sendiri.' };
    }

    // Use crypto-safe invoice IDs
    const invoiceIdSender = `NEXA-TRF-OUT-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const invoiceIdRecipient = `NEXA-TRF-IN-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    // FIXED: All balance checks and mutations are inside one atomic $transaction
    // to prevent race conditions and double-spend attacks.
    const result = await prisma.$transaction(async (tx) => {
      // Fetch sender balance INSIDE the transaction for consistency
      const sender = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, walletBalance: true, name: true, email: true },
      });

      if (!sender || sender.walletBalance < amount) {
        throw new Error('Saldo NexaPay Anda tidak mencukupi untuk melakukan transfer.');
      }

      // Decrement sender balance
      await tx.user.update({
        where: { id: session.user.id },
        data: { walletBalance: { decrement: amount } },
      });

      // Increment recipient balance
      await tx.user.update({
        where: { id: recipient.id },
        data: { walletBalance: { increment: amount } },
      });

      // Log for sender
      await tx.transaction.create({
        data: {
          invoiceId: invoiceIdSender,
          userId: session.user.id,
          productName: `Transfer ke ${recipient.name || recipient.email}`,
          category: 'Transfer',
          targetAccount: recipient.email || recipient.id,
          amount: amount,
          totalAmount: amount,
          paymentMethod: 'NEXAPAY_WALLET',
          status: 'COMPLETED',
          notes: notes || `Transfer saldo ke ${recipient.name || recipient.email}`,
        },
      });

      // Log for recipient
      await tx.transaction.create({
        data: {
          invoiceId: invoiceIdRecipient,
          userId: recipient.id,
          productName: `Terima Transfer dari ${sender.name || sender.email}`,
          category: 'Transfer',
          targetAccount: sender.email || sender.id,
          amount: amount,
          totalAmount: amount,
          paymentMethod: 'NEXAPAY_WALLET',
          status: 'COMPLETED',
          notes: notes || `Terima transfer saldo dari ${sender.name || sender.email}`,
        },
      });

      return { senderName: sender.name, recipientName: recipient.name || recipient.email };
    });

    revalidatePath('/dashboard/wallet');
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return {
      success: true,
      recipientName: result.recipientName,
    };
  } catch (error: any) {
    console.error('Failed to transfer wallet:', error);
    return { success: false, error: error?.message || 'Gagal mengirim saldo' };
  }
}
