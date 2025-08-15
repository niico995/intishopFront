import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

const MAX_MB = 5;

const CargarProducto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categorias: [],
  });

  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // imágenes webp seleccionadas (una o varias)
  const [files, setFiles] = useState([]);            // File[]
  const [previews, setPreviews] = useState([]);      // object URLs

  useEffect(() => {
    getCategorias();
    return () => previews.forEach(url => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategorias = async () => {
    try {
      const res = await axios.get('products/categorias/');
      setCategorias(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las categorías');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (id) => {
    setFormData(prev => {
      const seleccionadas = prev.categorias.includes(id)
        ? prev.categorias.filter(cat => cat !== id)
        : [...prev.categorias, id];
      return { ...prev, categorias: seleccionadas };
    });
  };

  // ---- IMÁGENES SOLO WEBP (múltiples) ----
  const validateAndSetFiles = (fileList) => {
    setMensaje('');
    setError('');

    const maxBytes = MAX_MB * 1024 * 1024;
    const incoming = Array.from(fileList || []);
    const valid = [];
    const newPreviews = [];

    for (const f of incoming) {
      const isWebpMime = f.type === 'image/webp';
      const isWebpExt = /\.webp$/i.test(f.name);
      if (!isWebpMime || !isWebpExt) {
        setError('Solo se permiten imágenes .webp');
        return;
      }
      if (f.size > maxBytes) {
        setError(`Una imagen supera los ${MAX_MB} MB`);
        return;
      }
    }

    // ok, son todas válidas
    // limpiar previews anteriores
    previews.forEach(url => URL.revokeObjectURL(url));

    incoming.forEach(f => {
      valid.push(f);
      newPreviews.push(URL.createObjectURL(f));
    });

    setFiles(valid);
    setPreviews(newPreviews);
  };

  const onFileInputChange = (e) => {
    validateAndSetFiles(e.target.files);
  };

  const onDrop = (e) => {
    e.preventDefault();
    validateAndSetFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => e.preventDefault();

  const clearImages = () => {
    files.length && previews.forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
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

  // Subida de imágenes a /products/imagenes/subir/
  const uploadImages = async (productId) => {
    if (!files.length) return;

    const fd = new FormData();
    fd.append('product', productId);
    files.forEach(f => fd.append('files', f)); // el backend usa getlist("files")

    await axios.post('products/imagenes/subir/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      // 1) Crear producto (JSON). categorias como array de IDs.
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio,
        stock: formData.stock,
        categorias: formData.categorias,
      };

      const res = await axios.post('products/crear/', payload); // <-- JSON, no multipart
      const productId = res.data?.id;

      // 2) Si hay imágenes, subirlas ahora (solo webp)
      if (productId) {
        await uploadImages(productId);
      }

      setMensaje('Producto creado correctamente');
      setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categorias: [] });
      clearImages();
    } catch (err) {
      console.error(err);
      // si el backend devuelve errores del serializer, mostralos
      const apiErr = err?.response?.data;
      setError(
        typeof apiErr === 'string'
          ? apiErr
          : 'Error al crear el producto'
      );
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20, fontSize: '32px' }}>Cargar Producto</h2>

      {mensaje && <p style={{ color: 'green', textAlign: 'center' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows={4}
          style={{ padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
        />

        <label>Precio:</label>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
        />

        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
        />

        <label>Categorías:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {categorias.map(cat => (
            <label key={cat.id} style={{ fontSize: 14 }}>
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

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <input
            type="text"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            placeholder="Nueva categoría"
            style={{ flex: 1, padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <button type="button" onClick={crearCategoria} style={{ padding: 8 }}>Agregar</button>
        </div>

        {/* ---- Imágenes (solo .webp) ---- */}
        <label style={{ marginTop: 10 }}>Imágenes (solo .webp):</label>
        <input
          type="file"
          accept="image/webp"
          multiple
          onChange={onFileInputChange}
          style={{ padding: 8, borderRadius: 5, border: '1px solid #ccc' }}
        />

        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{
            marginTop: 8,
            padding: 16,
            border: '2px dashed #ccc',
            borderRadius: 8,
            textAlign: 'center',
            fontSize: 14
          }}
        >
          Arrastrá y soltá tus .webp acá
          {previews.length > 0 && (
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
              {previews.map((src, i) => (
                <img key={i} src={src} alt={`Preview ${i}`} style={{ width: '100%', borderRadius: 6, objectFit: 'cover' }} />
              ))}
              <button
                type="button"
                onClick={clearImages}
                style={{ gridColumn: '1 / -1', marginTop: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#fafafa' }}
              >
                Quitar todas
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Cargar
        </button>
      </form>
    </div>
  );
};

export default CargarProducto;
