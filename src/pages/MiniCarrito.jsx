import React, { useState } from 'react';
import axios from 'axios';

const MiniCarrito = ({ carrito, setCarrito, quitarProducto }) => {
  const [mensaje, setMensaje] = useState('');

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const confirmarCompra = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
  'http://localhost:8000/api/gocuotas/compras/confirmar/', // AJUSTADO
  {
    items: carrito.map(item => ({
      producto_id: item.id,
      cantidad: item.cantidad
    }))
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
      setMensaje(response.data.message);
      setCarrito([]); // vaciamos el carrito
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al procesar la compra');
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">🛒 Carrito de compras</h2>
      {carrito.length === 0 ? (
        <p className="text-gray-600">No hay productos en el carrito.</p>
      ) : (
        <ul className="mb-4">
          {carrito.map((item) => (
            <li key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.nombre} x {item.cantidad}</span>
              <button onClick={() => quitarProducto(item.id)} className="text-red-500">Quitar</button>
            </li>
          ))}
        </ul>
      )}

      <p className="font-bold mb-2">Total: ${total.toFixed(2)}</p>

      <button
        onClick={confirmarCompra}
        disabled={carrito.length === 0}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Confirmar compra
      </button>

      {mensaje && <p className="mt-4 text-center text-blue-700">{mensaje}</p>}
    </div>
  );
};

export default MiniCarrito;
