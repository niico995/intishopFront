import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import "./lib/compatApi";
import App from "./App.jsx";

// 👇 importar el provider del carrito
import { CartProvider } from "./components/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      {/* 👇 envolver toda la app */}
      <CartProvider>
        <App />
      </CartProvider>
    </HelmetProvider>
  </StrictMode>
);
