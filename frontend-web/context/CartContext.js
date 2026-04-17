import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'toolrent_cart';

const toCartItem = (tool) => ({
  id: tool.id,
  title: tool.title,
  price_per_day: tool.price_per_day,
  image_url: tool.image_url,
  owner_email: tool.owner_email,
});

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (tool) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === tool.id);
      if (existing) {
        return prev.map((i) => (i.id === tool.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...toCartItem(tool), qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id, qty) => {
    const safeQty = Math.max(1, Number(qty) || 1);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: safeQty } : i)));
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price_per_day * item.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
