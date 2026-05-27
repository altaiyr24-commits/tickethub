import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],       // { seat, event }
      eventId: null,
      expiresAt: null,

      addSeat: (seat, event) => {
        const { items } = get();
        if (items.find(i => i.seat.id === seat.id)) return;
        set({
          items: [...items, { seat, event }],
          eventId: event.id,
        });
      },

      removeSeat: (seatId) => {
        const items = get().items.filter(i => i.seat.id !== seatId);
        set({ items, eventId: items.length ? get().eventId : null });
      },

      clearCart: () => set({ items: [], eventId: null, expiresAt: null }),

      setExpiry: (expiresAt) => set({ expiresAt }),

      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.seat.price, 0),

      getSeatIds: () => get().items.map(i => i.seat.id),
    }),
    {
      name: 'tickethub-cart',
    }
  )
);
