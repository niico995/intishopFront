import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';

const EditarProducto = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categorias: [],
  });
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // 📸 Imágenes actuales
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    getProducto();
    getCategorias();
    getImagenes();
  }, []);

  const getProducto = async () => {
    try {
      const res = await axios.get(`products/${id}/`);
      setFormData({
        nombre: res.data.nombre,
        descripcion: res.data.descripcion,
        precio: res.data.precio,
        stock: res.data.stock,
        categorias: res.data.categorias || [],
      });
    } catch (err) {
      console.error(err);
      setError('Error al cargar el producto');
    }
  };

  const getCategorias = async () => {
    try {
      const res = await axios.get('products/categorias/');
      setCategorias(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las categorías');
    }
  };

  // 🔹 Obtener imágenes actuales del producto
  const getImagenes = async () => {
    try {
      const res = await axios.get(`products/imagenes/`, {
        params: { product: id },
      });
      setImagenes(res.data);
    } catch (err) {
      console.error('Error al obtener imágenes:', err);
    }
  };

  // 🗑 Eliminar imagen
  const eliminarImagen = async (imgId) => {
    try {
      await axios.delete(`products/imagenes/${imgId}/eliminar/`);
      setImagenes(prev => prev.filter(img => img.id !== imgId));
    } catch (err) {
      console.error('Error eliminando imagen:', err);
    }
  };

  // ⬆️ Subir nuevas imágenes
  const subirImagenes = async (fileList) => {
    const fd = new FormData();
    fd.append('product', id);
    for (let f of fileList) {
      fd.append('files', f);
    }
    try {
      await axios.post('products/imagenes/subir/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      getImagenes(); // recargar
    } catch (err) {
      console.error('Error subiendo imágenes:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (catId) => {
    setFormData(prev => {
      const seleccionadas = prev.categorias.includes(catId)
        ? prev.categorias.filter(c => c !== catId)
        : [...prev.categorias, catId];
      return { ...prev, categorias: seleccionadas };
    });
  };

  const crearCategoria = async () => {
    if (!nuevaCategoria.trim()) return;
    try {
      const res = await axios.post('products/categorias/crear/', {
        nombre: nuevaCategoria,
      });
      setCategorias(prev => [...prev, { id: res.data.id, nombre: res.data.nombre }]);
      setFormData(prev => ({ ...prev, categorias: [...prev.categorias, res.data.id] }));
      setNuevaCategoria('');
    } catch (err) {
      console.error('Error creando categoría:', err);
      setError('No se pudo crear la categoría');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await axios.put(`products/${id}/actualizar/`, formData);
      setMensaje('Producto actualizado correctamente');
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el producto');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20, fontSize: 28, color: 'green' }}>
        Editar Producto
      </h2>
      {mensaje && <p style={{ color: 'green', textAlign: 'center' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* 🖼 Imágenes actuales */}
      {imagenes.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3>Imágenes actuales</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {imagenes.map(img => (
              <div
                key={img.id}
                style={{
                  border: img.is_primary ? '3px solid green' : '1px solid #ccc',
                  padding: 5,
                  borderRadius: 8,
                  textAlign: 'center'
                }}
              >
                <img
                  src={img.url}
                  alt={`Imagen ${img.id}`}
                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 6 }}
                />
                {img.is_primary && <div style={{ fontSize: 12, color: 'green' }}>Principal</div>}
                <button
                  type="button"
                  onClick={() => eliminarImagen(img.id)}
                  style={{
                    marginTop: 5,
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📤 Subir nuevas imágenes */}
      <div style={{ marginBottom: 20 }}>
        <h3>Agregar nuevas imágenes (.webp)</h3>
        <input
          type="file"
          accept="image/webp"
          multiple
          onChange={(e) => subirImagenes(e.target.files)}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows={3}
          style={{ width: '100%', marginBottom: 10 }}
        />

        <label>Precio:</label>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />

        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />

        <label>Categorías:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 10 }}>
          {categorias.map(cat => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={formData.categorias.includes(cat.id)}
                onChange={() => handleCheckbox(cat.id)}
                style={{ marginRight: 5 }}
              />
              {cat.nombre}
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', marginBottom: 10 }}>
          <input
            type="text"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            placeholder="Nueva categoría"
            style={{ flex: 1, marginRight: 8 }}
          />
          <button type="button" onClick={crearCategoria}>Agregar</button>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#007bff',
            color: '#fff',
            padding: 10,
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default EditarProducto;
