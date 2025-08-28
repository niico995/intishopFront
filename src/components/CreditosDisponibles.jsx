import React, { useEffect, useState } from 'react';
import { obtenerCreditos } from '../api/verCreditos';

const CreditosDisponibles = () => {
  const [creditos, setCreditos] = useState(null);

  useEffect(() => {
    (async () => {
      try { setCreditos(await obtenerCreditos()); }
      catch { setCreditos('Error al cargar'); }
    })();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow mb-4 text-center">
      <h2 className="text-lg font-bold">Créditos disponibles</h2>
      <p className="text-2xl mt-2">{creditos !== null ? `$${creditos}` : 'Cargando...'}</p>
    </div>
  );
};

export default CreditosDisponibles;
