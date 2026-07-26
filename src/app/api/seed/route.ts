import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { digitalProducts as products } from '@/data/products';
import { auth } from '@/../auth';

export async function GET() {
  try {
    // SECURITY: Only allow seeding in development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Seed is disabled in production' }, { status: 403 });
    }

    // SECURITY: Require admin authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Login required.' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    for (const prod of products) {
      const product = await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          image: prod.image || '',
          category: prod.category,
        },
        create: {
          name: prod.name,
          slug: prod.slug,
          category: prod.category,
          subcategory: prod.subcategory,
          description: prod.description,
          image: prod.image || '',
          bannerImage: prod.bannerImage,
          publisher: prod.publisher,
          isActive: prod.isActive,
          isFeatured: prod.isFeatured,
          isPopular: prod.isPopular,
        }
      });

      for (const denom of prod.denominations) {
        await prisma.denomination.upsert({
          where: { id: denom.id },
          update: {},
          create: {
            id: denom.id,
            productId: product.id,
            label: denom.label,
            value: denom.value,
            price: denom.price,
            originalPrice: denom.originalPrice,
            discount: denom.discount,
            stock: denom.stock,
            isActive: denom.isActive,
            isPopular: denom.isPopular,
            isFlashSale: denom.isFlashSale,
            flashSalePrice: denom.flashSalePrice,
          }
        });
      }
    }
    return NextResponse.json({ success: true, message: 'Seeded products' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat seeding database.' }, { status: 500 });
  }
}
