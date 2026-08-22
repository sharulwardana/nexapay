import prisma from '@/lib/prisma';
import NewsClient from './NewsClient';

export const metadata = {
  title: 'News & Patch Notes — NexaPay',
  description: 'Update resmi sistem NexaPay, rilis integrasi Direct API publisher game, event promo, dan tips strategi gaming.',
};

export const revalidate = 60;

export default async function NewsPage() {
  let dbArticles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    image: string | null;
    author: string;
    category: string;
    createdAt: Date;
  }> = [];

  try {
    dbArticles = await prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.warn('Failed to fetch news articles from DB:', error);
  }

  const initialArticles = dbArticles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    category: a.category.toUpperCase(),
    badge: 'Official Update',
    excerpt: a.excerpt || a.title,
    author: a.author,
    date: a.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    readTime: '3 min read',
    color: 'from-orange-500/20 via-amber-500/10 to-transparent',
    iconColor: 'text-orange-400',
    tags: [a.category],
    content: a.content ? a.content.split('\n\n') : [],
  }));

  return <NewsClient dbArticles={initialArticles} />;
}
