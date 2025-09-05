// // // src/context/CartContext.jsx
// // import { createContext, useContext, useEffect, useMemo, useState } from "react";

// // const CartContext = createContext();

// // export function CartProvider({ children }) {
// //   const [items, setItems] = useState(() => {
// //     try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
// //   });

// //   useEffect(() => {
// //     localStorage.setItem("cart", JSON.stringify(items));
// //   }, [items]);

// //   // También reaccionar a cambios en otras pestañas
// //   useEffect(() => {
// //     const onStorage = (e) => {
// //       if (e.key === "cart") {
// //         try { setItems(JSON.parse(e.newValue || "[]")); } catch {}
// //       }
// //     };
// //     window.addEventListener("storage", onStorage);
// //     return () => window.removeEventListener("storage", onStorage);
// //   }, []);

// //   const add = (item, qty = 1) => {
// //     setItems(prev => {
// //       const idx = prev.findIndex(x => x.id === item.id);
// //       if (idx >= 0) {
// //         const copy = [...prev];
// //         copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
// //         return copy;
// //       }
// //       return [...prev, { ...item, qty }];
// //     });
// //   };
// //   const remove = (id) => setItems(prev => prev.filter(x => x.id !== id));
// //   const updateQty = (id, qty) =>
// //     setItems(prev => prev.map(x => x.id === id ? { ...x, qty: Math.max(1, qty) } : x));
// //   const clear = () => setItems([]);

// //   const count = useMemo(() => items.reduce((acc, it) => acc + it.qty, 0), [items]);
// //   const total = useMemo(() => items.reduce((acc, it) => acc + (Number(it.precio) * it.qty), 0), [items]);

// //   return (
// //     <CartContext.Provider value={{ items, add, remove, updateQty, clear, count, total }}>
// //       {children}
// //     </CartContext.Provider>
// //   );
// // }

// // export const useCart = () => useContext(CartContext);
// // src/components/CartContext.jsx
// import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { toast } from "../utils/notify";

// const CartContext = createContext();

// export function CartProvider({ children }) {
//   const [items, setItems] = useState(() => {
//     try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
//   });

//   // Persistir
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(items));
//   }, [items]);

//   // Sincronizar entre pestañas
//   useEffect(() => {
//     const onStorage = (e) => {
//       if (e.key === "cart") {
//         try { setItems(JSON.parse(e.newValue || "[]")); } catch {}
//       }
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

//   // Agregar
//   const add = (p, qty = 1) => {
    const q = Math.max(1, Number(qty || 1));
    setItems(prev => {
      const i = prev.findIndex(x => x.id === p.id);
      // stock cap
      const stock = Number(p.stock ?? Infinity);
      let nextQty;
      if (i >= 0) {
        const current = prev[i].qty;
        nextQty = Math.min(stock, current + q);
        const added = Math.max(0, nextQty - current);
        const next = [...prev];
        next[i] = { ...next[i], qty: nextQty };
        if (added > 0) toast(`+${added} ${p.nombre} al carrito`, 'success');
        else toast(`No hay más stock de ${p.nombre}`, 'warning');
        return next;
      } else {
        nextQty = Math.min(stock, q);
        const next = [...prev, { id: p.id, nombre: p.nombre, precio: Number(p.precio || 0), qty: nextQty, imagen: p.imagen || p.imagenes?.[0]?.url || null }];
        if (nextQty > 0) toast(`+${nextQty} ${p.nombre} al carrito`, 'success');
        else toast(`Sin stock de ${p.nombre}`, 'warning');
        return next;
      }
    });
  };

  // Quitar cantidad (o todo si all=true)
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
        toast(`Quitado todo: ${it.nombre}`, 'info');
      } else {
        next[i] = { ...it, qty: newQty };
        toast(`-${toRemove} ${it.nombre}`, 'info');
      }
      return next;
    });
  };

  const updateQty = (id, qty) =>
    setItems(prev => prev.map(x => x.id === id ? { ...x, qty: Math.max(1, Number(qty || 1)) } : x));

  const clear = () => { setItems([]); toast('Carrito vaciado'); };

  const count = useMemo(() => items.reduce((acc, it) => acc + it.qty, 0), [items]);
  const total = useMemo(() => items.reduce((acc, it) => acc + (Number(it.precio) * it.qty), 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
