// // src/pages/CargarPerfilCliente.jsx
// import { useEffect, useState } from 'react';
// import api from '../api/axiosConfig';
// import { useNavigate } from 'react-router-dom';

// const CargarPerfilCliente = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     dni: '',
//     name: '',
//     lastName: '',
//     phone: '',
//     addressStreet: '',
//     addressHouseNumber: '',
//     addressCity: '',
//     addressNeighborhood: '',
//   });

//   const [mensaje, setMensaje] = useState('');
//   const [error, setError] = useState('');
//   const [enviando, setEnviando] = useState(false);
//   const [cargando, setCargando] = useState(true);
//   const [existePerfil, setExistePerfil] = useState(false);

//   // Precarga desde el backend
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const { data } = await api.get('gocuotas/perfil/');
//         if (!alive) return;
//         setExistePerfil(Boolean(data?.dni || data?.name || data?.lastName || data?.phone));
//         setFormData({
//           dni: data?.dni ? String(data.dni) : '',
//           name: data?.name || '',
//           lastName: data?.lastName || '',
//           phone: data?.phone || '',
//           addressStreet: data?.addressStreet || '',
//           addressHouseNumber: data?.addressHouseNumber !== undefined && data?.addressHouseNumber !== null
//             ? String(data.addressHouseNumber)
//             : '',
//           addressCity: data?.addressCity || '',
//           addressNeighborhood: data?.addressNeighborhood || '',
//         });
//       } catch (err) {
//         // Si el back devolviera 404, lo ignoramos. Con el ajuste ya devuelve 200 con skeleton.
//         console.warn('No se pudo precargar perfil (se mostrará vacío).', err?.response?.status);
//       } finally {
//         if (alive) setCargando(false);
//       }
//     })();
//     return () => { alive = false; };
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // Solo dígitos para DNI y número de casa
//     if (name === 'dni' || name === 'addressHouseNumber') {
//       const soloDigitos = value.replace(/[^\d]/g, '');
//       setFormData((prev) => ({ ...prev, [name]: soloDigitos }));
//       return;
//     }
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const buildPayload = () => {
//     const dniNum = formData.dni ? Number(formData.dni) : undefined;
//     const houseNum = formData.addressHouseNumber ? Number(formData.addressHouseNumber) : undefined;
//     return {
//       dni: dniNum,
//       name: formData.name.trim(),
//       lastName: formData.lastName.trim(),
//       phone: formData.phone.trim(),
//       addressStreet: formData.addressStreet.trim(),
//       addressHouseNumber: houseNum ?? 0,
//       addressCity: formData.addressCity.trim(),
//       addressNeighborhood: formData.addressNeighborhood.trim(),
//     };
//   };

//   const parseError = (err) => {
//     const d = err?.response?.data;
//     if (typeof d === 'string') return d;
//     if (d?.error) return d.error;
//     if (d && typeof d === 'object') {
//       try {
//         return Object.entries(d)
//           .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
//           .join(' | ');
//       } catch {
//         return 'Error al crear el perfil';
//       }
//     }
//     return 'Error al crear el perfil';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMensaje('');
//     setError('');
//     setEnviando(true);

//     try {
//       // Si ya existía perfil, no volvemos a crearlo; mandamos al dashboard.
//       if (existePerfil) {
//         return navigate('/dashboard-cliente', { replace: true });
//       }
//       const payload = buildPayload();
//       await api.post('gocuotas/crear-perfil/', payload);
//       setMensaje('Perfil creado correctamente');
//       setTimeout(() => navigate('/dashboard-cliente', { replace: true }), 800);
//     } catch (err) {
//       const msg = parseError(err);
//       if (msg.toLowerCase().includes('ya fue creado')) {
//         return navigate('/dashboard-cliente', { replace: true });
//       }
//       setError(msg);
//       console.error('Crear perfil cliente:', err);
//     } finally {
//       setEnviando(false);
//     }
//   };

//   if (cargando) {
//     return <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>Cargando…</div>;
//   }

//   return (
//     <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
//       <h2 style={{ textAlign: 'center' }}>
//         {existePerfil ? 'Tu Perfil de Cliente' : 'Cargar Perfil de Cliente'}
//       </h2>
//       <p style={{ fontSize: 12, color: '#555', textAlign: 'center', marginTop: 4 }}>
//         El email se toma del usuario con el que iniciaste sesión.
//       </p>

//       {mensaje && <p style={{ color: 'green', textAlign: 'center' }}>{mensaje}</p>}
//       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//         <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleChange} required />
//         <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
//         <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} required />
//         <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required />
//         <input type="text" name="addressStreet" placeholder="Calle" value={formData.addressStreet} onChange={handleChange} required />
//         <input type="text" name="addressHouseNumber" placeholder="Número" value={formData.addressHouseNumber} onChange={handleChange} required />
//         <input type="text" name="addressCity" placeholder="Ciudad" value={formData.addressCity} onChange={handleChange} required />
//         <input type="text" name="addressNeighborhood" placeholder="Barrio" value={formData.addressNeighborhood} onChange={handleChange} required />

//         <button
//           type="submit"
//           disabled={enviando}
//           style={{
//             padding: 10,
//             backgroundColor: enviando ? '#6b7280' : '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: 5,
//             cursor: enviando ? 'not-allowed' : 'pointer',
//           }}
//         >
//           {existePerfil ? 'Ir al dashboard' : (enviando ? 'Guardando…' : 'Guardar Perfil')}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CargarPerfilCliente;
// src/pages/CargarPerfilCliente.jsx
import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const CargarPerfilCliente = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dni: '',
    name: '',
    lastName: '',
    phone: '',
    addressStreet: '',
    addressHouseNumber: '',
    addressCity: '',
    addressNeighborhood: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [existePerfil, setExistePerfil] = useState(false);

  // Precarga desde el backend
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get('gocuotas/perfil/');
        if (!alive) return;
        setExistePerfil(Boolean(data?.dni || data?.name || data?.lastName || data?.phone));
        setFormData({
          dni: data?.dni ? String(data.dni) : '',
          name: data?.name || '',
          lastName: data?.lastName || '',
          phone: data?.phone || '',
          addressStreet: data?.addressStreet || '',
          addressHouseNumber: data?.addressHouseNumber !== undefined && data?.addressHouseNumber !== null
            ? String(data.addressHouseNumber)
            : '',
          addressCity: data?.addressCity || '',
          addressNeighborhood: data?.addressNeighborhood || '',
        });
      } catch (err) {
        // Si el back devolviera 404, lo ignoramos. Con el ajuste ya devuelve 200 con skeleton.
        console.warn('No se pudo precargar perfil (se mostrará vacío).', err?.response?.status);
      } finally {
        if (alive) setCargando(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Solo dígitos para DNI y número de casa
    if (name === 'dni' || name === 'addressHouseNumber') {
      const soloDigitos = value.replace(/[^\d]/g, '');
      setFormData((prev) => ({ ...prev, [name]: soloDigitos }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const dniNum = formData.dni ? Number(formData.dni) : undefined;
    const houseNum = formData.addressHouseNumber ? Number(formData.addressHouseNumber) : undefined;
    return {
      dni: dniNum,
      name: formData.name.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      addressStreet: formData.addressStreet.trim(),
      addressHouseNumber: houseNum ?? 0,
      addressCity: formData.addressCity.trim(),
      addressNeighborhood: formData.addressNeighborhood.trim(),
    };
  };

  const parseError = (err) => {
    const d = err?.response?.data;
    if (typeof d === 'string') return d;
    if (d?.error) return d.error;
    if (d && typeof d === 'object') {
      try {
        return Object.entries(d)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
          .join(' | ');
      } catch {
        return 'Error al crear el perfil';
      }
    }
    return 'Error al crear el perfil';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setEnviando(true);

    try {
      // Si ya existía perfil, no volvemos a crearlo; mandamos al dashboard.
      if (existePerfil) {
        return navigate('/dashboard-cliente', { replace: true });
      }
      const payload = buildPayload();
      await api.post('gocuotas/crear-perfil/', payload);
      setMensaje('Perfil creado correctamente');
      setTimeout(() => navigate('/dashboard-cliente', { replace: true }), 800);
    } catch (err) {
      const msg = parseError(err);
      if (msg.toLowerCase().includes('ya fue creado')) {
        return navigate('/dashboard-cliente', { replace: true });
      }
      setError(msg);
      console.error('Crear perfil cliente:', err);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>Cargando…</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>
        {existePerfil ? 'Tu Perfil de Cliente' : 'Cargar Perfil de Cliente'}
      </h2>
      <p style={{ fontSize: 12, color: '#555', textAlign: 'center', marginTop: 4 }}>
        El email se toma del usuario con el que iniciaste sesión.
      </p>

      {mensaje && <p style={{ color: 'green', textAlign: 'center' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required />
        <input type="text" name="addressStreet" placeholder="Calle" value={formData.addressStreet} onChange={handleChange} required />
        <input type="text" name="addressHouseNumber" placeholder="Número" value={formData.addressHouseNumber} onChange={handleChange} required />
        <input type="text" name="addressCity" placeholder="Ciudad" value={formData.addressCity} onChange={handleChange} required />
        <input type="text" name="addressNeighborhood" placeholder="Barrio" value={formData.addressNeighborhood} onChange={handleChange} required />

        <button
          type="submit"
          disabled={enviando}
          style={{
            padding: 10,
            backgroundColor: enviando ? '#6b7280' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: enviando ? 'not-allowed' : 'pointer',
          }}
        >
          {existePerfil ? 'Ir al dashboard' : (enviando ? 'Guardando…' : 'Guardar Perfil')}
        </button>
      </form>
    </div>
  );
};

export default CargarPerfilCliente;
