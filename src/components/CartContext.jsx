import React, { createContext, useContext, useState } from "react";

const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const id = product.id ?? product.producto_id;
      const found = prev.find((p) => (p.id ?? p.producto_id) === id);
      if (found) {
        return prev.map((p) =>
          (p.id ?? p.producto_id) === id ? { ...p, qty: (p.qty ?? 1) + qty } : p
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const updateQty = (id, qty) => {
    setItems((prev) =>
      prev.map((p) => ((p.id ?? p.producto_id) === id ? { ...p, qty } : p))
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => (p.id ?? p.producto_id) !== id));
  const clearCart = () => setItems([]);

  return (
    <CartCtx.Provider value={{ items, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartCtx.Provider>
  );
}
