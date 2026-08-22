import { notFound } from 'next/navigation';
import { articles } from '@/data/news';
import NewsDetailClient from './NewsDetailClient';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return articles.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan — NexaPay',
    };
  }

  return {
    title: `${article.title} — NexaPay Newsroom`,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const related = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return <NewsDetailClient article={article} relatedArticles={related} />;
}
