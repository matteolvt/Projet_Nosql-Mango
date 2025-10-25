import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === product.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [...prev, { ...product, qty }];
    });
  };

  const setQty = (id, qty) =>
    setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, Number(qty)||1) } : p));

  const removeItem = (id) => setItems(prev => prev.filter(p => p.id !== id));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, p) => s + p.qty, 0), [items]);
  const total = useMemo(() => items.reduce((s, p) => s + p.qty * Number(p.price), 0), [items]);

  const value = { items, addItem, setQty, removeItem, clear, count, total };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
