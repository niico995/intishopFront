// src/components/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart_v1";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.items)) return parsed;
  } catch {}
  return { items: [] };
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, qty } = action.payload;
      const id = product.id ?? product.producto_id ?? product.slug;
      if (!id) return state;

      const next = structuredClone(state);
      const idx = next.items.findIndex((it) => it.id === id);

      if (idx >= 0) {
        next.items[idx].qty = Math.min(999, (next.items[idx].qty || 0) + qty);
        // actualizamos info por si cambió el precio o la imagen
        next.items[idx].nombre = product.nombre ?? next.items[idx].nombre;
        next.items[idx].precio = product.precio ?? next.items[idx].precio ?? 0;
        next.items[idx].imagen_principal = product.imagen_principal ?? next.items[idx].imagen_principal ?? null;
        next.items[idx].seller_id = product.seller_id ?? next.items[idx].seller_id ?? null;
      } else {
        next.items.push({
          id,
          nombre: product.nombre ?? "Producto",
          precio: product.precio ?? 0,
          imagen_principal: product.imagen_principal ?? null,
          seller_id: product.seller_id ?? null,
          qty: Math.max(1, qty),
        });
      }
      save(next);
      return next;
    }
    case "SET_QTY": {
      const { id, qty } = action.payload;
      const next = structuredClone(state);
      const it = next.items.find((x) => x.id === id);
      if (!it) return state;
      it.qty = Math.max(1, Math.min(999, qty));
      save(next);
      return next;
    }
    case "REMOVE": {
      const { id } = action.payload;
      const next = { items: state.items.filter((x) => x.id !== id) };
      save(next);
      return next;
    }
    case "CLEAR": {
      const next = { items: [] };
      save(next);
      return next;
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  // API pública del carrito
  const api = useMemo(() => {
    const addItem = (product, qty = 1) => {
      const q = Number.isFinite(qty) ? qty : 1;
      dispatch({ type: "ADD", payload: { product, qty: Math.max(1, q) } });
    };
    const setQty = (id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty } });
    const removeItem = (id) => dispatch({ type: "REMOVE", payload: { id } });
    const clear = () => dispatch({ type: "CLEAR" });

    const count = state.items.reduce((acc, it) => acc + (it.qty || 0), 0);
    const total = state.items.reduce((acc, it) => acc + (it.qty || 0) * (it.precio || 0), 0);

    return { items: state.items, addItem, setQty, removeItem, clear, count, total };
  }, [state]);

  // sincroniza si se borró el storage desde otra pestaña
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : { items: [] };
          dispatch({ type: "_REPLACE", payload: parsed }); // trigger suave
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart() debe usarse dentro de <CartProvider>");
  return ctx;
}
