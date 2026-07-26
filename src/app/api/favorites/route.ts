import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import rateLimit from '@/lib/rateLimit';
import { z } from 'zod';

const limiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
});

// Zod schema for favorites input validation
const favoriteSchema = z.object({
  productId: z.string().min(1, 'Product ID required').max(100),
});

async function checkRateLimit(userId: string) {
  try {
    await limiter.check(20, `fav_${userId}`);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await checkRateLimit(session.user.id))) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan' }, { status: 429 });
    }

    const body = await req.json();

    // Validate input with Zod
    const parsed = favoriteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { productId } = parsed.data;

    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true },
    });

    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId,
      }
    });

    return NextResponse.json({ success: true, favorite });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Sudah ada di favorit' }, { status: 400 });
    }
    console.error('Favorite POST error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await checkRateLimit(session.user.id))) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan' }, { status: 429 });
    }

    const body = await req.json();

    // Validate input with Zod
    const parsed = favoriteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { productId } = parsed.data;

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Favorite DELETE error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
