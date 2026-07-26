import { create } from 'zustand';

interface SearchStore {
  query: string;
  isOpen: boolean;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  addRecentSearch: (search: string) => void;
  clearRecent: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  isOpen: false,
  recentSearches: [],
  setQuery: (query) => set({ query }),
  setIsOpen: (isOpen) => set({ isOpen }),
  addRecentSearch: (search) =>
    set((state) => ({
      recentSearches: [
        search,
        ...state.recentSearches.filter((s) => s !== search),
      ].slice(0, 10),
    })),
  clearRecent: () => set({ recentSearches: [] }),
}));

interface NotificationStore {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
  }>;
  unreadCount: number;
  addNotification: (n: Omit<NotificationStore['notifications'][0], 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [
    {
      id: '1',
      title: 'Selamat Datang di NexaPay!',
      message: 'Nikmati bonus Rp 15.000 untuk transaksi pertamamu. Gunakan kode NEWUSER15K.',
      type: 'info',
      isRead: false,
    },
    {
      id: '2',
      title: 'Flash Sale Dimulai!',
      message: 'Diskon 25% untuk top up Mobile Legends berlaku hingga akhir bulan.',
      type: 'success',
      isRead: false,
    },
  ],
  unreadCount: 2,
  addNotification: (n) =>
    set((state) => ({
      notifications: [{ ...n, isRead: false }, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));
