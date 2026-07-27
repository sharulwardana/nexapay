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

    const invoiceId = `NEXA-TOPUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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

    // Check sender balance
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, walletBalance: true, name: true, email: true },
    });

    if (!sender || sender.walletBalance < amount) {
      return { success: false, error: 'Saldo NexaPay Anda tidak mencukupi untuk melakukan transfer.' };
    }

    const invoiceIdSender = `NEXA-TRF-OUT-${Date.now()}`;
    const invoiceIdRecipient = `NEXA-TRF-IN-${Date.now()}`;

    await prisma.$transaction([
      // Decrement sender balance
      prisma.user.update({
        where: { id: session.user.id },
        data: { walletBalance: { decrement: amount } },
      }),
      // Increment recipient balance
      prisma.user.update({
        where: { id: recipient.id },
        data: { walletBalance: { increment: amount } },
      }),
      // Log for sender
      prisma.transaction.create({
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
      }),
      // Log for recipient
      prisma.transaction.create({
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
      }),
    ]);

    revalidatePath('/dashboard/wallet');
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return {
      success: true,
      recipientName: recipient.name || recipient.email,
    };
  } catch (error: any) {
    console.error('Failed to transfer wallet:', error);
    return { success: false, error: error?.message || 'Gagal mengirim saldo' };
  }
}
