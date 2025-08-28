// // src/components/RecargaCredito.jsx
// import React, { useState } from 'react';
// import { crearRecarga } from '../api/recargarCredito';

// const RecargaCredito = () => {
//   const [monto, setMonto] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRecarga = async () => {
//     if (!monto || isNaN(monto)) {
//       alert('Ingresá un monto válido');
//       return;
//     }

//     setLoading(true);
//     try {
//       const data = await crearRecarga(monto);
//       window.location.href = data.checkout_url; // redirige al link de GoCuotas
//     } catch (err) {
//       alert('Error al generar la recarga');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-sm mx-auto bg-white shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Recargar créditos</h2>
//       <input
//         type="number"
//         value={monto}
//         onChange={(e) => setMonto(e.target.value)}
//         placeholder="Monto en pesos"
//         className="border p-2 w-full rounded mb-4"
//       />
//       <button
//         onClick={handleRecarga}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//       >
//         {loading ? 'Procesando...' : 'Recargar con GoCuotas'}
//       </button>
//     </div>
//   );
// };

// export default RecargaCredito;
// src/pages/RecargarCredito.jsx
// src/pages/RecargarCredito.jsx
import { useState } from 'react';
import { crearRecarga } from '../api/recargarCredito';

export default function RecargarCredito() {
  const [form, setForm] = useState({ monto: '', payer_email: '', payer_phone: '' });
  const [err, setErr] = useState('');

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const crearCheckout = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const data = await crearRecarga(form.monto, {
        ...(form.payer_email ? { payer_email: form.payer_email } : {}),
        ...(form.payer_phone ? { payer_phone: form.payer_phone } : {}),
      });
      try { localStorage.setItem('last_recarga_monto', String(form.monto || '')); } catch {}
      if (!data?.checkout_url) throw new Error('Checkout URL vacío');
      window.location.href = data.checkout_url; // ← ACÁ se inicia el checkout (redirige a GoCuotas)
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || 'No se pudo iniciar la recarga');
    }
  };

  return (
    <form onSubmit={crearCheckout} className="max-w-md mx-auto p-4 space-y-3">
      <h1 className="text-xl font-bold">Cargar crédito</h1>
      {err && <div className="text-red-700">{err}</div>}

      <input
        name="monto"
        type="number"
        step="0.01"
        min="1"
        placeholder="Monto (ARS)"
        className="w-full border rounded px-3 py-2"
        value={form.monto}
        onChange={onChange}
        required
      />

      <div className="text-sm text-gray-600">Si otra persona va a pagar, completá sus datos:</div>
      <input
        name="payer_email"
        type="email"
        placeholder="Email del pagador (opcional)"
        className="w-full border rounded px-3 py-2"
        value={form.payer_email}
        onChange={onChange}
      />
      <input
        name="payer_phone"
        type="text"
        placeholder="Teléfono del pagador (opcional)"
        className="w-full border rounded px-3 py-2"
        value={form.payer_phone}
        onChange={onChange}
      />

      <button className="w-full bg-black text-white rounded px-4 py-2">Ir a pagar</button>

      <p className="text-xs text-gray-500">
        El saldo se acredita cuando GoCuotas confirma el pago (webhook).
      </p>
    </form>
  );
}
