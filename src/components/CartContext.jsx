// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // También reaccionar a cambios en otras pestañas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "cart") {
        try { setItems(JSON.parse(e.newValue || "[]")); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = (item, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(x => x.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { ...item, qty }];
    });
  };
  const remove = (id) => setItems(prev => prev.filter(x => x.id !== id));
  const updateQty = (id, qty) =>
    setItems(prev => prev.map(x => x.id === id ? { ...x, qty: Math.max(1, qty) } : x));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, it) => acc + it.qty, 0), [items]);
  const total = useMemo(() => items.reduce((acc, it) => acc + (Number(it.precio) * it.qty), 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
