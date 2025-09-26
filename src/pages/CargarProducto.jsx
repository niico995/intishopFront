// import { useEffect, useMemo, useState } from "react";
// import axios from "../api/axiosConfig";
// import { toast } from "../utils/notify";

// export default function CargarProducto() {
//   const [formData, setFormData] = useState({
//     nombre: "",
//     descripcion: "",
//     costo: "",
//     costo_envio: "",
//     stock: "",
//     categorias: [], // IDs
//   });
//   const [categorias, setCategorias] = useState([]);
//   const [loadingCats, setLoadingCats] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // Precio calculado local (solo display); el back lo recalcula igual.
//   const precioCalculado = useMemo(() => {
//     const c = parseFloat((formData.costo || "0").toString().replace(",", "."));
//     if (isNaN(c)) return "0.00";
//     return (c * 1.5).toFixed(2);
//   }, [formData.costo]);

//   useEffect(() => {
//     const getCategorias = async () => {
//       setLoadingCats(true);
//       try {
//         const res = await axios.get("products/categorias/");
//         setCategorias(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error(err);
//         toast("Error al cargar las categorías", "error");
//       } finally {
//         setLoadingCats(false);
//       }
//     };
//     getCategorias();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let val = value;
//     if (name === "costo" || name === "costo_envio") {
//       val = value.replace(",", ".");
//     }
//     setFormData((prev) => ({ ...prev, [name]: val }));
//   };

//   const handleCategorias = (e) => {
//     const opts = Array.from(e.target.selectedOptions);
//     const values = opts.map((o) => Number(o.value));
//     setFormData((prev) => ({ ...prev, categorias: values }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const payload = {
//         nombre: formData.nombre?.trim(),
//         descripcion: formData.descripcion?.trim(),
//         costo: Number(formData.costo || 0).toFixed(2),
//         // precio NO se envía; lo calcula el back (costo×1.5)
//         costo_envio: Number(formData.costo_envio || 0).toFixed(2),
//         stock: Number(formData.stock || 0),
//         categorias: formData.categorias,
//       };

//       await axios.post("products/crear/", payload);
//       toast("Producto creado con éxito", "success");

//       setFormData({
//         nombre: "",
//         descripcion: "",
//         costo: "",
//         costo_envio: "",
//         stock: "",
//         categorias: [],
//       });
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err?.response?.data?.error ||
//         err?.response?.data?.detail ||
//         "No se pudo crear el producto";
//       toast(msg, "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <h1 className="text-lg font-semibold mb-3">Cargar producto</h1>

//       <form onSubmit={onSubmit} className="grid gap-3">
//         <div className="grid gap-2">
//           <label className="text-sm font-medium">Nombre</label>
//           <input
//             name="nombre"
//             value={formData.nombre}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 w-full"
//             required
//             inputMode="text"
//             placeholder="Ej.: Filtro de aceite XYZ"
//           />
//         </div>

//         <div className="grid gap-2">
//           <label className="text-sm font-medium">Descripción</label>
//           <textarea
//             name="descripcion"
//             value={formData.descripcion}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 w-full min-h-28"
//             required
//             placeholder="Detalles, compatibilidades, etc."
//           />
//         </div>

//         <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Costo (ingresá vos)</label>
//             <input
//               name="costo"
//               type="number"
//               step="0.01"
//               value={formData.costo}
//               onChange={handleChange}
//               className="border rounded px-3 py-2 w-full"
//               required
//               inputMode="decimal"
//               placeholder="0.00"
//             />
//             <p className="text-[11px] text-gray-500">
//               El sistema calcula el <b>precio</b> como <b>costo × 1.5</b>.
//             </p>
//           </div>

//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Precio (auto)</label>
//             <input
//               value={precioCalculado}
//               className="border rounded px-3 py-2 w-full bg-gray-50"
//               readOnly
//               tabIndex={-1}
//             />
//             <p className="text-[11px] text-gray-500">Precio final mostrado al cliente.</p>
//           </div>
//         </div>

//         <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Costo de envío</label>
//             <input
//               name="costo_envio"
//               type="number"
//               step="0.01"
//               value={formData.costo_envio}
//               onChange={handleChange}
//               className="border rounded px-3 py-2 w-full"
//               inputMode="decimal"
//               placeholder="0.00"
//             />
//           </div>

//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Stock</label>
//             <input
//               name="stock"
//               type="number"
//               min="0"
//               value={formData.stock}
//               onChange={handleChange}
//               className="border rounded px-3 py-2 w-full"
//               inputMode="numeric"
//               placeholder="0"
//             />
//           </div>
//         </div>

//         <div className="grid gap-2">
//           <label className="text-sm font-medium">Categorías</label>
//           <select
//             multiple
//             value={formData.categorias}
//             onChange={handleCategorias}
//             className="border rounded px-3 py-2 w-full"
//           >
//             {loadingCats ? (
//               <option>Cargando…</option>
//             ) : categorias.length === 0 ? (
//               <option disabled>No hay categorías</option>
//             ) : (
//               categorias.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.nombre}
//                 </option>
//               ))
//             )}
//           </select>
//           <p className="text-[11px] text-gray-500">
//             En móvil: tocá y arrastrá para seleccionar varias (o mantené presionado).
//           </p>
//         </div>

//         <button
//           type="submit"
//           disabled={submitting}
//           className="px-4 py-2 border rounded w-full sm:w-auto hover:bg-gray-50 disabled:opacity-50"
//         >
//           {submitting ? "Guardando…" : "Guardar producto"}
//         </button>
//       </form>
//     </div>
//   );
// }










// import { useEffect, useMemo, useState } from "react";
// import axios from "../api/axiosConfig";        // ⬅️ solo default, sin { API_BASE }
// import { toast } from "../utils/notify";

// export default function CargarProducto() {
//   const [formData, setFormData] = useState({
//     nombre: "",
//     descripcion: "",
//     costo: "",
//     costo_envio: "",
//     stock: "",
//     categorias: [], // IDs
//   });

//   const [categorias, setCategorias] = useState([]);
//   const [loadingCats, setLoadingCats] = useState(true);
//   const [creatingCat, setCreatingCat] = useState(false);
//   const [newCat, setNewCat] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const precioCalculado = useMemo(() => {
//     const c = parseFloat((formData.costo || "0").toString().replace(",", "."));
//     if (isNaN(c)) return "0.00";
//     return (c * 1.5).toFixed(2);
//   }, [formData.costo]);

//   const fetchCategorias = async () => {
//     setLoadingCats(true);
//     try {
//       const res = await axios.get("products/categorias/");
//       setCategorias(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error(err);
//       toast("Error al cargar las categorías", "error");
//     } finally {
//       setLoadingCats(false);
//     }
//   };

//   useEffect(() => {
//     // Log opcional de la base URL real que está usando axios
//     try {
//       console.log("[CargarProducto] baseURL:", axios.defaults.baseURL);
//     } catch {}
//     fetchCategorias();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let val = value;
//     if (name === "costo" || name === "costo_envio") val = value.replace(",", ".");
//     setFormData((prev) => ({ ...prev, [name]: val }));
//   };

//   const handleCategorias = (e) => {
//     const values = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
//     setFormData((prev) => ({ ...prev, categorias: values }));
//   };

//   const crearCategoria = async () => {
//     const nombre = (newCat || "").trim();
//     if (!nombre) return toast("Ingresá un nombre de categoría", "warning");
//     setCreatingCat(true);
//     try {
//       // El back acepta también "products/categorias/crear/" si preferís
//       const res = await axios.post("products/categorias/", { nombre });
//       const creada = res?.data;
//       toast("Categoría creada", "success");
//       setNewCat("");
//       if (creada?.id) {
//         setCategorias((prev) => [...prev, creada].sort((a, b) => a.nombre.localeCompare(b.nombre)));
//         setFormData((prev) => ({
//           ...prev,
//           categorias: [...new Set([...(prev.categorias || []), creada.id])],
//         }));
//       } else {
//         fetchCategorias();
//       }
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err?.response?.data?.error ||
//         err?.response?.data?.nombre?.[0] ||
//         err?.response?.data?.detail ||
//         "No se pudo crear la categoría";
//       toast(msg, "error");
//     } finally {
//       setCreatingCat(false);
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const payload = {
//         nombre: formData.nombre?.trim(),
//         descripcion: formData.descripcion?.trim(),
//         costo: Number(formData.costo || 0).toFixed(2),
//         // precio lo calcula el back (costo × 1.5)
//         costo_envio: Number(formData.costo_envio || 0).toFixed(2),
//         stock: Number(formData.stock || 0),
//         categorias: formData.categorias,
//       };

//       await axios.post("products/crear/", payload);
//       toast("Producto creado con éxito", "success");
//       setFormData({
//         nombre: "",
//         descripcion: "",
//         costo: "",
//         costo_envio: "",
//         stock: "",
//         categorias: [],
//       });
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err?.response?.data?.error ||
//         err?.response?.data?.detail ||
//         "No se pudo crear el producto";
//       toast(msg, "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <h1 className="text-lg font-semibold mb-3">Cargar producto</h1>

//       <form onSubmit={onSubmit} className="grid gap-3">
//         <div className="grid gap-2">
//           <label className="text-sm font-medium">Nombre</label>
//           <input
//             name="nombre"
//             value={formData.nombre}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 w-full"
//             required
//             placeholder="Ej.: Filtro de aceite XYZ"
//           />
//         </div>

//         <div className="grid gap-2">
//           <label className="text-sm font-medium">Descripción</label>
//           <textarea
//             name="descripcion"
//             value={formData.descripcion}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 w-full min-h-28"
//             required
//             placeholder="Detalles, compatibilidades, etc."
//           />
//         </div>

//         <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Costo (ingresá vos)</label>
//             <input
//               name="costo"
//               type="number"
//               step="0.01"
//               value={formData.costo}
//               onChange={handleChange}
//               className="border rounded px-3 py-2 w-full"
//               required
//               inputMode="decimal"
//               placeholder="0.00"
//             />
//             <p className="text-[11px] text-gray-500">
//               El sistema calcula el <b>precio</b> como <b>costo × 1.5</b>.
//             </p>
//           </div>
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Precio (auto)</label>
//             <input
//               value={precioCalculado}
//               className="border rounded px-3 py-2 w-full bg-gray-50"
//               readOnly
//               tabIndex={-1}
//             />
//             <p className="text-[11px] text-gray-500">Precio final mostrado al cliente.</p>
//           </div>
//         </div>

//         <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Costo de envío</label>
//             <input
//               name="costo_envio"
//               type="number"
//               step="0.01"
//               value={formData.costo_envio}
//               onChange={handleChange}
//               className="border rounded px-3 py-2 w-full"
//               inputMode="decimal"
//               placeholder="0.00"
//             />
//           </div>
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Stock</label>
//             <input
//               name="stock"
//               type="number"
//               min="0"
//               value={formData.stock}
//               onChange={handleChange}
//               className="border rounded px-3 py-2 w-full"
//               inputMode="numeric"
//               placeholder="0"
//             />
//           </div>
//         </div>

//         <div className="grid gap-2">
//           <label className="text-sm font-medium">Categorías</label>
//           <select
//             multiple
//             value={formData.categorias}
//             onChange={handleCategorias}
//             className="border rounded px-3 py-2 w-full"
//           >
//             {loadingCats ? (
//               <option>Cargando…</option>
//             ) : categorias.length === 0 ? (
//               <option disabled>No hay categorías</option>
//             ) : (
//               categorias
//                 .slice()
//                 .sort((a, b) => a.nombre.localeCompare(b.nombre))
//                 .map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.nombre}
//                   </option>
//                 ))
//             )}
//           </select>

//           <div className="flex gap-2 mt-2">
//             <input
//               className="border rounded px-3 py-2 flex-1"
//               placeholder="Nueva categoría…"
//               value={newCat}
//               onChange={(e) => setNewCat(e.target.value)}
//             />
//             <button
//               type="button"
//               onClick={crearCategoria}
//               disabled={creatingCat}
//               className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
//             >
//               {creatingCat ? "Creando…" : "Crear"}
//             </button>
//           </div>

//           <p className="text-[11px] text-gray-500">
//             En móvil: tocá y arrastrá para seleccionar varias (o mantené presionado).
//           </p>
//         </div>

//         <button
//           type="submit"
//           disabled={submitting}
//           className="px-4 py-2 border rounded w-full sm:w-auto hover:bg-gray-50 disabled:opacity-50"
//         >
//           {submitting ? "Guardando…" : "Guardar producto"}
//         </button>
//       </form>
//     </div>
//   );
// }


// src/pages/CargarProducto.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "../api/axiosConfig"; // tu axiosInstance
import { toast } from "../utils/notify";

export default function CargarProducto() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    costo: "",
    costo_envio: "",
    stock: "",
    categorias: [], // IDs
  });

  const [categorias, setCategorias] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [creatingCat, setCreatingCat] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // imágenes seleccionadas (File[])
  const [files, setFiles] = useState([]);

  // preview urls para mostrar miniaturas
  const [previews, setPreviews] = useState([]);

  const precioCalculado = useMemo(() => {
    const c = parseFloat((formData.costo || "0").toString().replace(",", "."));
    if (isNaN(c)) return "0.00";
    return (c * 1.5).toFixed(2);
  }, [formData.costo]);

  const fetchCategorias = async () => {
    setLoadingCats(true);
    try {
      const res = await axios.get("products/categorias/");
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast("Error al cargar las categorías", "error");
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    try {
      console.log("[CargarProducto] baseURL:", axios.defaults.baseURL);
    } catch {}
    fetchCategorias();
  }, []);

  // ---------------- imágenes ----------------
  const onPickFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    // (opcional) filtrar tipos o tamaños
    const valid = selected.filter((f) => f.type.startsWith("image/"));

    setFiles((prev) => [...prev, ...valid]);
  };

  useEffect(() => {
    // generar previews
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);

    // cleanup para liberar memoria
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const removeFileAt = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // ------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "costo" || name === "costo_envio") val = value.replace(",", ".");
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleCategorias = (e) => {
    const values = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
    setFormData((prev) => ({ ...prev, categorias: values }));
  };

  const crearCategoria = async () => {
    const nombre = (newCat || "").trim();
    if (!nombre) return toast("Ingresá un nombre de categoría", "warning");
    setCreatingCat(true);
    try {
      const res = await axios.post("products/categorias/", { nombre });
      const creada = res?.data;
      toast("Categoría creada", "success");
      setNewCat("");
      if (creada?.id) {
        setCategorias((prev) => [...prev, creada].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        setFormData((prev) => ({
          ...prev,
          categorias: [...new Set([...(prev.categorias || []), creada.id])],
        }));
      } else {
        fetchCategorias();
      }
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.nombre?.[0] ||
        err?.response?.data?.detail ||
        "No se pudo crear la categoría";
      toast(msg, "error");
    } finally {
      setCreatingCat(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Construimos FormData (multipart)
      const fd = new FormData();
      fd.append("nombre", (formData.nombre || "").trim());
      fd.append("descripcion", (formData.descripcion || "").trim());
      fd.append("costo", Number(formData.costo || 0).toFixed(2));
      fd.append("costo_envio", Number(formData.costo_envio || 0).toFixed(2));
      fd.append("stock", String(Number(formData.stock || 0)));

      // categorías: el backend acepta múltiples keys "categorias"
      (formData.categorias || []).forEach((id) => fd.append("categorias", String(id)));

      // imágenes: el backend acepta "imagenes" (o "files" / "file")
      if (files.length) {
        files.forEach((f) => fd.append("imagenes", f, f.name));
      }

      // 👇 endpoint multipart que crea producto + imágenes de una
      const { data } = await axios.post("products/crear-con-imagenes/", fd, {
        // Muy importante: NO setear Content-Type manualmente.
        // Axios lo define con el boundary correcto.
      });

      toast("Producto creado con éxito", "success");
      console.log("[CrearProducto] respuesta:", data);

      // reset
      setFormData({
        nombre: "",
        descripcion: "",
        costo: "",
        costo_envio: "",
        stock: "",
        categorias: [],
      });
      setFiles([]);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "No se pudo crear el producto";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold mb-3">Cargar producto</h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Nombre</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
            placeholder="Ej.: Filtro de aceite XYZ"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full min-h-28"
            required
            placeholder="Detalles, compatibilidades, etc."
          />
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Costo (ingresá vos)</label>
            <input
              name="costo"
              type="number"
              step="0.01"
              value={formData.costo}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
              inputMode="decimal"
              placeholder="0.00"
            />
            <p className="text-[11px] text-gray-500">
              El sistema calcula el <b>precio</b> como <b>costo × 1.5</b>.
            </p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Precio (auto)</label>
            <input
              value={precioCalculado}
              className="border rounded px-3 py-2 w-full bg-gray-50"
              readOnly
              tabIndex={-1}
            />
            <p className="text-[11px] text-gray-500">Precio final mostrado al cliente.</p>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Costo de envío</label>
            <input
              name="costo_envio"
              type="number"
              step="0.01"
              value={formData.costo_envio}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              inputMode="decimal"
              placeholder="0.00"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              inputMode="numeric"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Categorías</label>
          <select
            multiple
            value={formData.categorias}
            onChange={handleCategorias}
            className="border rounded px-3 py-2 w-full"
          >
            {loadingCats ? (
              <option>Cargando…</option>
            ) : categorias.length === 0 ? (
              <option disabled>No hay categorías</option>
            ) : (
              categorias
                .slice()
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))
            )}
          </select>

          <div className="flex gap-2 mt-2">
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Nueva categoría…"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <button
              type="button"
              onClick={crearCategoria}
              disabled={creatingCat}
              className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              {creatingCat ? "Creando…" : "Crear"}
            </button>
          </div>

          <p className="text-[11px] text-gray-500">
            En móvil: tocá y arrastrá para seleccionar varias (o mantené presionado).
          </p>
        </div>

        {/* Imágenes */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Imágenes (podés subir varias)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPickFiles}
            className="block"
          />
          {previews.length > 0 && (
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative border rounded overflow-hidden">
                  <img src={src} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFileAt(i)}
                    className="absolute top-1 right-1 bg-white/90 border text-xs px-2 py-0.5 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-gray-500">
            Formatos aceptados: JPG, PNG, WebP. La primera se marcará como principal.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 border rounded w-full sm:w-auto hover:bg-gray-50 disabled:opacity-50"
        >
          {submitting ? "Guardando…" : "Guardar producto"}
        </button>
      </form>
    </div>
  );
}
