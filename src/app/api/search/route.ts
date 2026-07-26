import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
});

import { digitalProducts } from '@/data/products';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    try {
      await limiter.check(30, `search_${ip}`);
    } catch {
      return NextResponse.json({ error: 'Terlalu banyak permintaan pencarian' }, { status: 429 });
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const sanitizedQuery = query.slice(0, 100).trim();
    if (!sanitizedQuery) {
      return NextResponse.json({ results: [] });
    }

    let results: any[] = [];
    try {
      results = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: sanitizedQuery, mode: 'insensitive' } },
            { publisher: { contains: sanitizedQuery, mode: 'insensitive' } },
            { slug: { contains: sanitizedQuery, mode: 'insensitive' } },
            { category: { contains: sanitizedQuery, mode: 'insensitive' } },
            { subcategory: { contains: sanitizedQuery, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });
    } catch (dbErr) {
      console.warn('Prisma search fallback to local products:', dbErr);
    }

    // Fallback or complement with local products if DB results empty
    if (results.length === 0) {
      const qLower = sanitizedQuery.toLowerCase();
      results = digitalProducts.filter(
        (p) =>
          p.isActive &&
          (p.name.toLowerCase().includes(qLower) ||
            p.slug.toLowerCase().includes(qLower) ||
            (p.publisher && p.publisher.toLowerCase().includes(qLower)) ||
            p.category.toLowerCase().includes(qLower) ||
            (p.subcategory && p.subcategory.toLowerCase().includes(qLower)))
      ).slice(0, 10);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
