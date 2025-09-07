// src/components/AddToCartButton.jsx
import React from "react";
import { useCart } from "./CartContext";

/**
 * Botón genérico.
 * - Si le pasás onClick => lo ejecuta.
 * - Si NO le pasás onClick, pero sí { product, qty }, agrega al carrito por su cuenta.
 */
export default function AddToCartButton({ onClick, product, qty = 1, disabled = false, className = "" }) {
  const { addItem } = useCart();

  const handle = () => {
    if (disabled) return;
    if (typeof onClick === "function") return onClick();
    if (product) return addItem(product, qty);
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled}
      className={
        "px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50 hover:opacity-90 transition " +
        className
      }
      aria-label="Agregar al carrito"
    >
      Agregar al carrito
    </button>
  );
}
