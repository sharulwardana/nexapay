import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
});

export async function GET(req: NextRequest) {
  try {
    // Rate limit by IP (no auth required for search, but limit abuse)
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

    // Limit query length to prevent abuse
    const sanitizedQuery = query.slice(0, 100);

    const results = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: sanitizedQuery } },
          { publisher: { contains: sanitizedQuery } },
        ],
      },
      take: 10,
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
