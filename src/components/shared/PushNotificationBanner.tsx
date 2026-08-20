'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Sparkles, Loader2 } from 'lucide-react';
import { usePushNotification } from '@/hooks/usePushNotification';

export default function PushNotificationBanner() {
  const { isSupported, permission, isSubscribed, isLoading, subscribe } = usePushNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only show if supported, not subscribed, and permission is default
    if (typeof window === 'undefined') return;

    const dismissedUntil = localStorage.getItem('nexapay_push_dismissed');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      setIsDismissed(true);
      return;
    }

    if (isSupported && !isSubscribed && permission === 'default' && !isLoading) {
      // Delay showing banner by 3 seconds for better UX
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isSupported, isSubscribed, permission, isLoading]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Dismiss for 7 days
    localStorage.setItem('nexapay_push_dismissed', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
  };

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setIsVisible(false);
    }
  };

  if (!isSupported || isSubscribed || isDismissed || permission === 'denied') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="fixed bottom-[88px] tablet:bottom-6 left-4 right-4 tablet:left-auto tablet:right-6 z-50 max-w-md w-auto"
        >
          <div className="p-4 rounded-2xl bg-card/95 backdrop-blur-2xl border border-primary/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-start gap-3 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

            {/* Icon */}
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-primary/25 mt-0.5">
              <Bell className="w-5 h-5 animate-bounce-subtle" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className="text-xs tablet:text-sm font-bold font-heading text-foreground">
                  Aktifkan Notifikasi Real-Time
                </h4>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[11px] tablet:text-xs text-muted-foreground leading-relaxed mb-3">
                Dapatkan notifikasi pop-up instan di HP/Laptop saat top up game berhasil dikirim!
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-xl gradient-primary text-white text-xs font-bold shadow-sm shadow-primary/30 hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>Izinkan Sekarang</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                >
                  Nanti
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Tutup Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
