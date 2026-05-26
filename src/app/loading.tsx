import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner inspired by Vercel/Linear */}
        <div className="relative flex w-12 h-12">
          <i className="absolute inset-0 rounded-full border-[3px] border-border" />
          <i className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Memuat halaman...
        </p>
      </div>
    </div>
  );
}
