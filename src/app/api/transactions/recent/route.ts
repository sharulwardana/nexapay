import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { digitalProducts } from '@/data/products';

// Recent Transactions API Endpoint - Live Database Query

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      take: 10,
      where: {
        status: { in: ['COMPLETED', 'PAID', 'SUCCESS'] }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true, slug: true, image: true } },
        denomination: { select: { label: true } },
      },
    });

    if (!transactions.length) {
      // Return empty array if database has no transactions yet
      return NextResponse.json({ transactions: [] });
    }

    const formatted = transactions.map((tx) => {
      // Find fallback product name if product relation wasn't loaded from DB
      const fallbackProd = digitalProducts.find((p) => p.id === tx.productId || p.slug === tx.productId);
      const name = tx.product?.name || fallbackProd?.name || 'Produk Game';
      const label = tx.denomination?.label || 'Item Top Up';

      // Format time ago
      const diffMs = Date.now() - new Date(tx.createdAt).getTime();
      const mins = Math.floor(diffMs / 60000);
      const secs = Math.floor((diffMs % 60000) / 1000);
      const timeAgo = mins > 0 ? `${mins} menit lalu` : secs > 5 ? `${secs} detik lalu` : 'Baru saja';

      return {
        id: tx.id,
        invoiceId: tx.invoiceId || tx.id,
        productName: name,
        itemLabel: label,
        price: tx.totalAmount || tx.amount,
        paymentMethod: tx.paymentMethod,
        status: tx.status,
        createdAt: tx.createdAt,
        timeAgo,
      };
    });

    return NextResponse.json({ transactions: formatted });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return NextResponse.json({ transactions: [] }, { status: 500 });
  }
}
