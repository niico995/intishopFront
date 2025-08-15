import React, { useState } from 'react';
import ListadoProductosVenta from './ListadoProductosVenta';// Asegurate de que esta ruta esté bien
import MiniCarrito from './MiniCarrito'; // Asegurate de que esta ruta esté bien también

const Tienda = () => {
  const [carrito, setCarrito] = useState([]);

  const agregarProducto = (producto) => {
    const index = carrito.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      const nuevo = [...carrito];
      nuevo[index].cantidad += 1;
      setCarrito(nuevo);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarProducto = (id) => {
    setCarrito(carrito.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">🛍️ Tienda</h1>

      {/* ✅ Acá se pasa correctamente onAgregar */}
      <ListadoProductosVenta onAgregar={agregarProducto} />

      <MiniCarrito
        carrito={carrito}
        setCarrito={setCarrito}
        quitarProducto={quitarProducto}
      />
    </div>
  );
};

export default Tienda;
