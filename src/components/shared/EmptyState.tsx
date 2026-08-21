'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  glowColor?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
  className,
  glowColor = 'from-primary/20 to-accent/20',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden p-8 sm:p-12 text-center rounded-3xl glass-card border border-border/50',
        className
      )}
    >
      {/* Ambient Glow */}
      <div className={cn('absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-30 bg-gradient-to-br', glowColor)} />

      <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary shadow-lg shadow-primary/10">
          <Icon className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold font-heading text-foreground mb-1.5">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:shadow-neon-violet hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
