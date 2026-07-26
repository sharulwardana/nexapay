import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import Navbar from '@/components/layout/Navbar';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
  });
  if (!product) return { title: 'Not Found' };
  return {
    title: `${product.name} | NexaPay`,
    description: product.description || `Beli ${product.name} dengan mudah dan cepat di NexaPay.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      denominations: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailClient product={product} />
    </>
  );
}
