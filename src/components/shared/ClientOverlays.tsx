'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const SearchOverlay = dynamic(() => import('@/components/shared/SearchOverlay'), { ssr: false });
const ScratchAndWin = dynamic(() => import('@/components/shared/ScratchAndWin'), { ssr: false });
const LiveChat = dynamic(() => import('@/components/shared/LiveChat'), { ssr: false });

export default function ClientOverlays() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      <SearchOverlay />
      {!isDashboard && <ScratchAndWin />}
      <LiveChat />
    </>
  );
}
