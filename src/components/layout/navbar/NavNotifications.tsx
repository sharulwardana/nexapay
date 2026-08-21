'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X } from 'lucide-react';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { useNotificationStore } from '@/store/globalStore';

interface NavNotificationsProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function NavNotifications({ isOpen, onToggle }: NavNotificationsProps) {
  const { playHover, playClick } = useSoundEffect();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  return (
    <div className="relative">
      <button
        onClick={() => {
          playClick();
          onToggle();
        }}
        onMouseEnter={playHover}
        className="relative flex items-center px-2 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] pointer-events-auto cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 right-3 w-[calc(100vw-24px)] max-w-sm tablet:absolute tablet:top-full tablet:right-0 tablet:left-auto tablet:w-80 tablet:mt-2 glass-card border border-white/15 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[100] max-h-[70vh] flex flex-col"
            >
              {/* Mobile Visual Drag Handle */}
              <div className="tablet:hidden w-10 h-1 bg-white/25 rounded-full mx-auto mt-2.5 flex-shrink-0" />

              <div className="p-3.5 border-b border-border/60 flex justify-between items-center bg-muted/40 flex-shrink-0">
                <div>
                  <h3 className="font-bold text-sm">Notifikasi</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => { playClick(); markAllAsRead(); }}
                      className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-xl transition-colors"
                    >
                      <Check className="w-3 h-3" /> Dibaca
                    </button>
                  )}
                  {/* Explicit Close X Button */}
                  <button
                    onClick={() => { playClick(); onToggle(); }}
                    className="p-1 rounded-lg bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Tutup Notifikasi"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto no-scrollbar p-3 space-y-2 flex-1 min-h-0">
                {notifications.length > 0 ? (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (!notif.isRead) {
                          playClick();
                          markAsRead(notif.id);
                        }
                      }}
                      className={`p-3 rounded-xl border border-border/40 transition-all cursor-pointer flex gap-2.5 items-start ${
                        !notif.isRead ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        notif.type === 'warning' ? 'bg-yellow-500/15 text-yellow-500' :
                        notif.type === 'success' ? 'bg-green-500/15 text-green-500' :
                        notif.type === 'error' ? 'bg-red-500/15 text-red-500' :
                        'bg-blue-500/15 text-blue-500'
                      }`}>
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-xs font-bold ${!notif.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notif.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mb-2">
                      <Bell className="w-5 h-5 opacity-40" />
                    </div>
                    <p className="text-xs font-semibold">Belum ada notifikasi</p>
                  </div>
                )}
              </div>

              {/* Mobile Explicit Bottom Dismiss Bar */}
              <div className="tablet:hidden p-2.5 border-t border-border/40 bg-background/95 backdrop-blur-md flex-shrink-0">
                <button
                  onClick={() => { playClick(); onToggle(); }}
                  className="w-full py-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold flex items-center justify-center gap-1.5 border border-border/50 transition-all active:scale-[0.98]"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" /> Tutup Notifikasi
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
