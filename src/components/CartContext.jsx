import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "../utils/notify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });

  // Persist
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Add item (cap by stock if provided)
  const add = (p, qty = 1) => {
    const q = Math.max(1, Number(qty || 1));
    setItems(prev => {
      const i = prev.findIndex(x => x.id === p.id);
      const stock = Number(p.stock ?? Infinity);
      if (i >= 0) {
        const current = prev[i].qty;
        const nextQty = Math.min(stock, current + q);
        const added = Math.max(0, nextQty - current);
        const next = [...prev];
        next[i] = { ...next[i], qty: nextQty };
        if (added > 0) toast(`+${added} ${p.nombre} al carrito`, "success");
        else toast(`No hay más stock de ${p.nombre}`, "warning");
        return next;
      } else {
        const nextQty = Math.min(stock, q);
        const next = [
          ...prev,
          {
            id: p.id,
            nombre: p.nombre,
            precio: Number(p.precio || 0),
            qty: nextQty,
            imagen: p.imagen || p.imagenes?.[0]?.url || null,
          },
        ];
        if (nextQty > 0) toast(`+${nextQty} ${p.nombre} al carrito`, "success");
        else toast(`Sin stock de ${p.nombre}`, "warning");
        return next;
      }
    });
  };

  // Remove quantity (or all if all=true)
  const remove = (id, qty = 1, all = false) => {
    setItems(prev => {
      const i = prev.findIndex(x => x.id === id);
      if (i < 0) return prev;
      const it = prev[i];
      const toRemove = all ? it.qty : Math.max(1, Number(qty || 1));
      const newQty = it.qty - toRemove;
      const next = [...prev];
      if (newQty <= 0) {
        next.splice(i, 1);
        toast(`Quitado todo: ${it.nombre}`, "info");
      } else {
        next[i] = { ...it, qty: newQty };
        toast(`-${toRemove} ${it.nombre}`, "info");
      }
      return next;
    });
  };

  // Update quantity directly
  const updateQty = (id, qty) => {
    const q = Math.max(1, Number(qty || 1));
    setItems(prev => {
      const i = prev.findIndex(x => x.id === id);
      if (i < 0) return prev;
      const next = [...prev];
      next[i] = { ...prev[i], qty: q };
      return next;
    });
  };

  const clear = () => setItems([]);

  const value = { items, add, remove, updateQty, clear };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
