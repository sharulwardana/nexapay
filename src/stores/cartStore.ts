import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
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
  removeItem: (denominationId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.denominationId === item.denominationId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.denominationId === item.denominationId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (denominationId) =>
        set((state) => ({
          items: state.items.filter((i) => i.denominationId !== denominationId),
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
