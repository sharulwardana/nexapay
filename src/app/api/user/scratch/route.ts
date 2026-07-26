import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // FIXED: Use session.user.id instead of session.user.email for consistency
    // with all other API endpoints. email can be null for some OAuth providers.
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 5 scratch attempts per minute
    try {
      await limiter.check(5, `scratch_${session.user.id}`);
    } catch {
      return NextResponse.json({ message: 'Terlalu banyak permintaan' }, { status: 429 });
    }

    // Use $transaction for atomic check-and-update to prevent race conditions.
    // Without this, two concurrent requests could both pass the "already scratched"
    // check and award double points.
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // Check if already scratched today
      if (user.lastScratch) {
        const today = new Date();
        const lastScratchDate = new Date(user.lastScratch);
        
        if (
          today.getDate() === lastScratchDate.getDate() &&
          today.getMonth() === lastScratchDate.getMonth() &&
          today.getFullYear() === lastScratchDate.getFullYear()
        ) {
          throw new Error('ALREADY_SCRATCHED');
        }
      }

      // Generate random points between 50 and 500
      const pointsWon = Math.floor(Math.random() * (500 - 50 + 1)) + 50;

      // Update user atomically
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          loyaltyPoints: { increment: pointsWon },
          lastScratch: new Date(),
        },
        select: {
          loyaltyPoints: true,
        }
      });

      return { pointsWon, totalPoints: updatedUser.loyaltyPoints };
    });

    return NextResponse.json({
      message: 'Berhasil menggosok kartu',
      pointsWon: result.pointsWon,
      totalPoints: result.totalPoints,
    });
  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (error.message === 'ALREADY_SCRATCHED') {
      return NextResponse.json({ message: 'Sudah gosok kartu hari ini' }, { status: 400 });
    }
    console.error('Scratch error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
