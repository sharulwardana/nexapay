import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id?: string;
  productId: string;
  productName: string;
  productImage: string;
  denominationId: string;
  denominationLabel: string;
  price: number;
  quantity: number;
  gameUserId?: string;
  gameServerId?: string;
  phoneNumber?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemKey: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const getItemKey = (item: { denominationId: string; gameUserId?: string; gameServerId?: string; id?: string }) => {
  if (item.id) return item.id;
  return `${item.denominationId}-${item.gameUserId || ''}-${item.gameServerId || ''}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const itemKey = getItemKey(item);
          const existing = state.items.find((i) => getItemKey(i) === itemKey);

          if (existing) {
            return {
              items: state.items.map((i) =>
                getItemKey(i) === itemKey
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            };
          }

          const newItem: CartItem = {
            ...item,
            id: item.id || `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            quantity: item.quantity || 1,
          };

          return { items: [...state.items, newItem] };
        }),
      removeItem: (itemKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemKey && getItemKey(i) !== itemKey && i.denominationId !== itemKey),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'nexapay-cart' }
  )
);
