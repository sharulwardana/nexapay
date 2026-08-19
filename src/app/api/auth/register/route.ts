import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/sanitize';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit({
  interval: 3600000, // 1 hour
  uniqueTokenPerInterval: 500,
});

const registerSchema = z.object({
  name: z.string().min(2).max(50).transform(sanitizeInput).optional(),
  email: z.string().email('Email tidak valid').max(255),
  password: z.string().min(8, 'Password minimal 8 karakter').max(100),
  referralCode: z.string().max(20).optional(),
});

// Maximum referral bonuses a single referrer can receive
const MAX_REFERRAL_BONUSES_PER_USER = 50;
const REFERRAL_BONUS_AMOUNT = 10000; // Rp 10.000

export async function POST(req: NextRequest) {
  try {
    // Rate limit: max 5 registrations per IP per hour
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    try {
      await limiter.check(5, `register_${clientIp}`);
    } catch {
      return NextResponse.json(
        { message: 'Terlalu banyak percobaan registrasi. Silakan coba lagi nanti.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password, referralCode } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password with bcrypt (cost factor 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a unique referral code (e.g. NAME1234)
    const baseName = (name || email.split('@')[0]).replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedReferralCode = `${baseName}${randomNum}`;

    let referrerId: string | null = null;

    // Check referredBy if provided
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
        select: { id: true },
      });
      if (referrer) {
        // Anti-abuse: check how many referral bonuses this referrer has already received
        const existingBonusCount = await prisma.referral.count({
          where: { referrerId: referrer.id, status: 'completed' },
        });
        if (existingBonusCount < MAX_REFERRAL_BONUSES_PER_USER) {
          referrerId = referrer.id;
        }
        // If cap exceeded, silently skip bonus (user still gets created)
      }
    }

    // Use transaction to ensure atomicity for user creation + referral bonus
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: name || email.split('@')[0],
          email,
          password: hashedPassword,
          referralCode: generatedReferralCode,
          referredBy: referrerId,
        },
      });

      // If referred, create a referral record and give bonus atomically
      if (referrerId) {
        await tx.referral.create({
          data: {
            referrerId,
            refereeId: newUser.id,
            bonus: REFERRAL_BONUS_AMOUNT,
            status: 'completed',
          }
        });

        await tx.user.update({
          where: { id: referrerId },
          data: { walletBalance: { increment: REFERRAL_BONUS_AMOUNT } }
        });
      }

      return newUser;
    });

    return NextResponse.json(
      { message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
