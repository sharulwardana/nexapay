import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 5 checkin attempts per minute
    try {
      await limiter.check(5, `checkin_${session.user.id}`);
    } catch {
      return NextResponse.json({ error: 'Terlalu banyak permintaan' }, { status: 429 });
    }

    // Use $transaction for atomic check-and-update to prevent race conditions.
    // Without this, two concurrent requests could both pass the "already checked in"
    // check and award double points.
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.user.id }
      });

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // Check if user has already checked in today
      if (user.lastCheckIn) {
        const lastCheckInDate = new Date(user.lastCheckIn);
        const today = new Date();
        
        if (
          lastCheckInDate.getDate() === today.getDate() &&
          lastCheckInDate.getMonth() === today.getMonth() &&
          lastCheckInDate.getFullYear() === today.getFullYear()
        ) {
          throw new Error('ALREADY_CHECKED_IN');
        }
      }

      // Process check-in (give 10 loyalty points)
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          lastCheckIn: new Date(),
          loyaltyPoints: { increment: 10 }
        }
      });

      return { success: true };
    });

    return NextResponse.json({ success: true, message: 'Check-in berhasil, dapat 10 Points!' });
  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (error.message === 'ALREADY_CHECKED_IN') {
      return NextResponse.json({ error: 'Sudah check-in hari ini' }, { status: 400 });
    }
    console.error('Checkin error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
