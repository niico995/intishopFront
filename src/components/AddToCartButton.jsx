import React, { useState } from "react";

export default function AddToCartButton({ onAdd, disabled, className = "", children = "Agregar al carrito" }) {
  const [ok, setOk] = useState(false);
  const click = async () => {
    if (disabled) return;
    await (onAdd?.());
    setOk(true);
    setTimeout(() => setOk(false), 700);
  };
  return (
    <button
      onClick={click}
      disabled={disabled}
      className={`px-4 py-3 rounded-md border transition-colors ${ok ? "bg-green-600 text-white border-green-600" : "border-gray-200 hover:bg-gray-50"} ${className}`}
    >
      {children}
    </button>
  );
}
