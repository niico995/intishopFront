// src/components/RecargaCredito.jsx
import React, { useState } from 'react';
import { crearRecarga } from '../api/recargarCredito';

const RecargaCredito = () => {
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecarga = async () => {
    if (!monto || isNaN(monto)) {
      alert('Ingresá un monto válido');
      return;
    }

    setLoading(true);
    try {
      const data = await crearRecarga(monto);
      window.location.href = data.checkout_url; // redirige al link de GoCuotas
    } catch (err) {
      alert('Error al generar la recarga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Recargar créditos</h2>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        placeholder="Monto en pesos"
        className="border p-2 w-full rounded mb-4"
      />
      <button
        onClick={handleRecarga}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Procesando...' : 'Recargar con GoCuotas'}
      </button>
    </div>
  );
};

export default RecargaCredito;
