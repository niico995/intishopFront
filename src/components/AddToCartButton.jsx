import { useState } from "react";

export default function AddToCartButton({ onClick, disabled, className = "", children = "Agregar al carrito" }) {
  const [added, setAdded] = useState(false);

  const handle = async (e) => {
    if (disabled) return;
    try {
      const maybePromise = onClick && onClick(e);
      // Soporta onClick async
      if (maybePromise && typeof maybePromise.then === "function") {
        await maybePromise;
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 700);
    } catch (_) {
      // no cambies a verde si falla, igual reseteamos
      setAdded(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-700 ${added ? "bg-green-600" : "bg-black"} ${className}`}
    >
      {children}
    </button>
  );
}
