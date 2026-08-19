import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { digitalProducts } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';
import Navbar from '@/components/layout/Navbar';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const staticProduct = digitalProducts.find(p => p.slug === resolvedParams.slug);
  try {
    const product = await prisma.product.findUnique({
      where: { slug: resolvedParams.slug },
    });
    if (product) {
      return {
        title: `${product.name} | NexaPay`,
        description: product.description || `Beli ${product.name} dengan mudah dan cepat di NexaPay.`,
      };
    }
  } catch {
    // fallback to static
  }

  if (staticProduct) {
    return {
      title: `${staticProduct.name} | NexaPay`,
      description: staticProduct.description || `Beli ${staticProduct.name} dengan mudah dan cepat di NexaPay.`,
    };
  }

  return { title: 'Not Found' };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let product: any = null;

  try {
    product = await prisma.product.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        denominations: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
      },
    });
  } catch (e) {
    console.warn('Prisma fetch failed on product detail, using static fallback:', e);
  }

  // Fallback to static product
  const staticProduct = digitalProducts.find(p => p.slug === resolvedParams.slug);
  if (staticProduct) {
    product = {
      ...product,
      ...staticProduct,
      denominations: staticProduct.denominations,
    };
  }

  if (!product || (product.isActive === false)) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailClient product={product} />
    </>
  );
}
