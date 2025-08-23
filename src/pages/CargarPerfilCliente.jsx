// src/pages/CargarPerfilCliente.jsx
import { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Solo dígitos para DNI y número de casa (dejamos string para controlar input)
    if (name === 'dni' || name === 'addressHouseNumber') {
      const soloDigitos = value.replace(/[^\d]/g, '');
      setFormData((prev) => ({ ...prev, [name]: soloDigitos }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    // Convertir a número donde corresponda
    const dniNum = formData.dni ? Number(formData.dni) : undefined;
    const houseNum = formData.addressHouseNumber
      ? Number(formData.addressHouseNumber)
      : undefined;

    return {
      dni: dniNum,
      name: formData.name.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      addressStreet: formData.addressStreet.trim(),
      addressHouseNumber: houseNum ?? 0,
      addressCity: formData.addressCity.trim(),
      addressNeighborhood: formData.addressNeighborhood.trim(),
      // ❌ NO mandamos email: lo toma el backend desde request.user
    };
  };

  const parseError = (err) => {
    const d = err?.response?.data;
    if (typeof d === 'string') return d;
    if (d?.error) return d.error;
    // Errores de DRF por campo
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
      const payload = buildPayload();
      await api.post('gocuotas/crear-perfil/', payload);
      setMensaje('Perfil creado correctamente');
      setTimeout(() => navigate('/dashboard-cliente', { replace: true }), 1000);
    } catch (err) {
      const msg = parseError(err);

      // Si ya está creado, mandamos al dashboard
      if (msg.toLowerCase().includes('ya fue creado')) {
        return navigate('/dashboard-cliente', { replace: true });
      }
      setError(msg);
      console.error('Crear perfil cliente:', err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Cargar Perfil de Cliente</h2>

      <p style={{ fontSize: 12, color: '#555', textAlign: 'center', marginTop: 4 }}>
        El email se tomará del usuario con el que iniciaste sesión.
      </p>

      {mensaje && <p style={{ color: 'green', textAlign: 'center' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={formData.dni}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        {/* Email eliminado del formulario */}

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="addressStreet"
          placeholder="Calle"
          value={formData.addressStreet}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="addressHouseNumber"
          placeholder="Número"
          value={formData.addressHouseNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="addressCity"
          placeholder="Ciudad"
          value={formData.addressCity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="addressNeighborhood"
          placeholder="Barrio"
          value={formData.addressNeighborhood}
          onChange={handleChange}
          required
        />

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
          {enviando ? 'Guardando…' : 'Guardar Perfil'}
        </button>
      </form>
    </div>
  );
};

export default CargarPerfilCliente;
