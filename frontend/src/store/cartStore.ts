import { create } from 'zustand';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id);
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      };
    }
    return { items: [...state.items, item] };
  }),
  increment: (id) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ),
  })),
  decrement: (id) => set((state) => ({
    items: state.items
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0),
  })),
  remove: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  clear: () => set({ items: [] }),
}));
