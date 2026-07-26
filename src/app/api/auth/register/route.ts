import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').max(100),
  referralCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
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
        where: { referralCode }
      });
      if (referrer) {
        referrerId = referrer.id;
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
            bonus: 10000,
            status: 'completed',
          }
        });

        await tx.user.update({
          where: { id: referrerId },
          data: { walletBalance: { increment: 10000 } }
        });
      }

      return newUser;
    });

    return NextResponse.json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
