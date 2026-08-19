import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ hasScratched: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lastScratch: true }
    });

    if (!user || !user.lastScratch) {
      return NextResponse.json({ hasScratched: false });
    }

    const today = new Date();
    const lastDate = new Date(user.lastScratch);

    const hasScratched = 
      today.getDate() === lastDate.getDate() &&
      today.getMonth() === lastDate.getMonth() &&
      today.getFullYear() === lastDate.getFullYear();

    return NextResponse.json({ hasScratched });
  } catch (error) {
    return NextResponse.json({ hasScratched: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 5 scratch attempts per minute
    try {
      await limiter.check(5, `scratch_${session.user.id}`);
    } catch {
      return NextResponse.json({ message: 'Terlalu banyak permintaan' }, { status: 429 });
    }

    // Use $transaction for atomic check-and-update
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

      // Tiered Weighted Random Probability Algorithm (Fair Economy)
      // 70% Common (5 - 25 points)
      // 25% Rare (30 - 75 points)
      // 5% Jackpot (100 - 250 points)
      const roll = Math.random() * 100;
      let pointsWon = 10;

      if (roll < 5) {
        // 5% Jackpot
        pointsWon = Math.floor(Math.random() * (250 - 100 + 1)) + 100;
      } else if (roll < 30) {
        // 25% Rare
        pointsWon = Math.floor(Math.random() * (75 - 30 + 1)) + 30;
      } else {
        // 70% Common
        pointsWon = Math.floor(Math.random() * (25 - 5 + 1)) + 5;
      }

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'USER_NOT_FOUND') {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      if (error.message === 'ALREADY_SCRATCHED') {
        return NextResponse.json({ message: 'Sudah gosok kartu hari ini' }, { status: 400 });
      }
    }
    console.error('Scratch error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
