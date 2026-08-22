import prisma from '@/lib/prisma';
import PromoClient from './PromoClient';

export const metadata = {
  title: 'Promo & Diskon Top-Up — NexaPay',
  description: 'Dapatkan kode promo diskon hingga 50%, voucher cashback, dan flash sale game top up di NexaPay.',
};

export const revalidate = 60;

export default async function PromoPage() {
  let dbPromos: Array<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    endDate: Date;
  }> = [];

  try {
    dbPromos = await prisma.promo.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        type: true,
        value: true,
        endDate: true,
      },
    });
  } catch (error) {
    console.warn('Failed to fetch promos from database:', error);
  }

  const initialPromos = dbPromos.map((p) => ({
    id: p.id,
    code: p.code,
    title: p.name,
    subtitle: p.description || 'Gunakan kode promo ini saat checkout untuk mendapatkan potongan harga spesial.',
    discount: `${p.value}`,
    type: p.type,
    endDate: p.endDate.toISOString(),
  }));

  return <PromoClient dbPromos={initialPromos} />;
}
