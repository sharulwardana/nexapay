'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const SearchOverlay = dynamic(() => import('@/components/shared/SearchOverlay'), { ssr: false });
const ScratchAndWin = dynamic(() => import('@/components/shared/ScratchAndWin'), { ssr: false });
const LiveChat = dynamic(() => import('@/components/shared/LiveChat'), { ssr: false });
const PushNotificationBanner = dynamic(() => import('@/components/shared/PushNotificationBanner'), { ssr: false });

export default function ClientOverlays() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isDashboard = pathname.startsWith('/dashboard');
  const isTopUpDetailPage = pathname.startsWith('/topup/') && pathname.split('/').length > 2;
  const isProductDetailPage = pathname.startsWith('/products/') && pathname.split('/').length > 2;
  const isDetailPage = isTopUpDetailPage || isProductDetailPage;

  return (
    <>
      <SearchOverlay />
      {!isDashboard && !isDetailPage && <ScratchAndWin />}
      {!isDetailPage && <LiveChat />}
      <PushNotificationBanner />
    </>
  );
}
