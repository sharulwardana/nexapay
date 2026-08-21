import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { digitalProducts } from '@/data/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexapay.id';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/topup`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/promo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/track`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/partner`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic Product routes from DB or static fallback
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, category: true, updatedAt: true },
    });

    productRoutes = products.map((p) => ({
      url: p.category === 'GAME_TOPUP' ? `${baseUrl}/topup/${p.slug}` : `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));
  } catch {
    // Fallback to static list if DB is unreachable
    productRoutes = digitalProducts.map((p) => ({
      url: p.category === 'GAME_TOPUP' ? `${baseUrl}/topup/${p.slug}` : `${baseUrl}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));
  }

  return [...staticRoutes, ...productRoutes];
}
