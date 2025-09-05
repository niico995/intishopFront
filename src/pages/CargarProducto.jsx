// // import { useEffect, useMemo, useState } from "react";
// // import axiosInstance from "../api/axiosConfig";
// // let toast;
// // try { toast = (await import("../utils/notify")).toast; } catch { toast = (m)=>alert(m); }

// // const initialForm = {
// //   nombre: "",
// //   descripcion: "",
// //   precio_minorista: "",
// //   precio_mayorista: "",
// //   proveedor: "",
// //   stock: "",
// //   categorias: [],
// //   envio_modo: "unidad",       // "unidad" | "bulto"
// //   unidad_peso_kg: "",
// //   unidad_vol_dm3: "",
// //   bulto_unidades: "",
// //   bulto_peso_kg: "",
// //   bulto_vol_dm3: "",
// // };

// // export default function CargarProducto() {
// //   const [form, setForm] = useState(initialForm);
// //   const [cats, setCats] = useState([]);          // [{id, nombre}, ...]
// //   const [imagenes, setImagenes] = useState([]);  // File[]
// //   const [subiendo, setSubiendo] = useState(false);

// //   // UI para crear categoría
// //   const [newCatName, setNewCatName] = useState("");
// //   const [creatingCat, setCreatingCat] = useState(false);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const { data } = await axiosInstance.get("products/categorias/");
// //         const lista = Array.isArray(data) ? data : (data?.results ?? data?.items ?? data?.data ?? []);
// //         setCats(Array.isArray(lista) ? lista : []);
// //       } catch (e) {
// //         console.error(e);
// //         toast("No pude cargar categorías");
// //       }
// //     })();
// //   }, []);

// //   const previews = useMemo(
// //     () => imagenes.map(f => ({ name: f.name, url: URL.createObjectURL(f) })),
// //     [imagenes]
// //   );

// //   const onChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm((p) => ({ ...p, [name]: value }));
// //   };

// //   const onSelectCats = (e) => {
// //     const values = Array.from(e.target.selectedOptions).map(o => Number(o.value));
// //     setForm(p => ({ ...p, categorias: values }));
// //   };

// //   const onFiles = (e) => {
// //     const files = Array.from(e.target.files || []);
// //     setImagenes(files);
// //   };

// //   // ---------- Crear categoría nueva ----------
// //   const existingCatByName = (name) => {
// //     const n = name?.trim()?.toLowerCase();
// //     if (!n) return null;
// //     return cats.find(c => (c?.nombre ?? "").trim().toLowerCase() === n) || null;
// //   };

// //   const createCategoryAPI = async (nombre) => {
// //     // 1) Intento POST directo a /products/categorias/
// //     try {
// //       const { data } = await axiosInstance.post("products/categorias/", { nombre });
// //       return data;
// //     } catch (e1) {
// //       // 2) Fallback a /products/categorias/crear/
// //       try {
// //         const { data } = await axiosInstance.post("products/categorias/crear/", { nombre });
// //         return data;
// //       } catch (e2) {
// //         // Re-lanzar el segundo error (más representativo si ambos fallan)
// //         throw e2;
// //       }
// //     }
// //   };

// //   const addNewCategory = async () => {
// //     const name = newCatName.trim();
// //     if (!name) return toast("Ingresá el nombre de la categoría");

// //     // Si ya existe, solo la seleccionamos
// //     const ya = existingCatByName(name);
// //     if (ya?.id) {
// //       setForm(p => ({
// //         ...p,
// //         categorias: p.categorias.includes(ya.id) ? p.categorias : [...p.categorias, ya.id],
// //       }));
// //       setNewCatName("");
// //       return toast("La categoría ya existía; la seleccioné");
// //     }

// //     setCreatingCat(true);
// //     try {
// //       const creada = await createCategoryAPI(name);
// //       // Soportar backend que devuelva {id, nombre} o {categoria:{...}}
// //       const cat = creada?.id ? creada : (creada?.categoria ?? creada);

// //       if (!cat?.id) {
// //         throw new Error("Respuesta inesperada al crear la categoría");
// //       }

// //       setCats(prev => [...prev, cat]);
// //       setForm(p => ({ ...p, categorias: [...p.categorias, cat.id] }));
// //       setNewCatName("");
// //       toast("Categoría creada y seleccionada");
// //     } catch (e) {
// //       console.error(e);
// //       toast(e?.response?.data?.error || "No se pudo crear la categoría");
// //     } finally {
// //       setCreatingCat(false);
// //     }
// //   };
// //   // -------------------------------------------

// //   const validar = () => {
// //     if (!form.nombre?.trim()) return "Ingresá un nombre";
// //     if (!form.precio_minorista) return "Precio minorista requerido";
// //     if (!form.stock && form.stock !== 0) return "Stock requerido";
// //     if (!form.categorias?.length) return "Seleccioná al menos una categoría";

// //     if (form.envio_modo === "unidad") {
// //       if (form.unidad_peso_kg === "") return "Peso por unidad requerido";
// //       if (form.unidad_vol_dm3 === "") return "Volumen por unidad requerido";
// //     } else {
// //       if (!form.bulto_unidades) return "Unidades por bulto requerido";
// //       if (form.bulto_peso_kg === "") return "Peso por bulto requerido";
// //       if (form.bulto_vol_dm3 === "") return "Volumen por bulto requerido";
// //     }
// //     return null;
// //   };

// //   const crear = async (e) => {
// //     e.preventDefault();
// //     const err = validar();
// //     if (err) return toast(err);

// //     setSubiendo(true);
// //     try {
// //       const fd = new FormData();
// //       // Campos simples
// //       ["nombre","descripcion","precio_minorista","precio_mayorista","proveedor","stock","envio_modo",
// //        "unidad_peso_kg","unidad_vol_dm3","bulto_unidades","bulto_peso_kg","bulto_vol_dm3"
// //       ].forEach(k => {
// //         if (form[k] !== "" && form[k] !== null && form[k] !== undefined) {
// //           fd.append(k, form[k]);
// //         }
// //       });
// //       // Categorías (múltiple)
// //       (form.categorias || []).forEach(id => fd.append("categorias", id));

// //       // 1) Crear producto
// //       const { data: producto } = await axiosInstance.post("products/productos/", fd);

// //       // 2) Subir imágenes si hay
// //       if (imagenes.length) {
// //         const fdImg = new FormData();
// //         imagenes.forEach(f => fdImg.append("imagenes", f));
// //         await axiosInstance.post(`products/productos/${producto.id}/subir_imagenes/`, fdImg, {
// //           headers: { "Content-Type": "multipart/form-data" },
// //         });
// //       }

// //       toast("Producto creado con éxito");
// //       setForm(initialForm);
// //       setImagenes([]);
// //     } catch (e) {
// //       console.error(e);
// //       toast(e?.response?.data?.error || "No se pudo crear el producto");
// //     } finally {
// //       setSubiendo(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto p-4 space-y-6">
// //       <h1 className="text-2xl font-semibold">Cargar producto</h1>

// //       <form onSubmit={crear} className="space-y-4">
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Nombre *</span>
// //             <input className="border rounded px-3 py-2" name="nombre" value={form.nombre} onChange={onChange} />
// //           </label>

// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Proveedor</span>
// //             <input className="border rounded px-3 py-2" name="proveedor" value={form.proveedor} onChange={onChange} />
// //           </label>

// //           <label className="md:col-span-2 flex flex-col">
// //             <span className="text-sm mb-1">Descripción</span>
// //             <textarea className="border rounded px-3 py-2" name="descripcion" value={form.descripcion} onChange={onChange} rows={3}/>
// //           </label>

// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Precio minorista *</span>
// //             <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_minorista" value={form.precio_minorista} onChange={onChange} />
// //           </label>

// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Precio mayorista</span>
// //             <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_mayorista" value={form.precio_mayorista} onChange={onChange} />
// //           </label>

// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Stock *</span>
// //             <input type="number" className="border rounded px-3 py-2" name="stock" value={form.stock} onChange={onChange} />
// //           </label>

// //           {/* CATEGORÍAS */}
// //           <div className="md:col-span-1 flex flex-col gap-2">
// //             <span className="text-sm">Categorías *</span>
// //             <select multiple className="border rounded px-3 py-2 h-40" value={form.categorias} onChange={onSelectCats}>
// //               {(cats || []).map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
// //             </select>
// //             <span className="text-xs text-gray-500">Ctrl/Cmd + click para seleccionar varias</span>

// //             {/* Crear nueva categoría */}
// //             <div className="flex items-center gap-2">
// //               <input
// //                 className="border rounded px-3 py-2 flex-1"
// //                 placeholder="Nueva categoría"
// //                 value={newCatName}
// //                 onChange={(e)=>setNewCatName(e.target.value)}
// //                 onKeyDown={(e)=>{ if (e.key==='Enter'){ e.preventDefault(); addNewCategory(); } }}
// //               />
// //               <button
// //                 type="button"
// //                 onClick={addNewCategory}
// //                 disabled={creatingCat}
// //                 className="px-3 py-2 bg-black text-white rounded hover:opacity-90"
// //               >
// //                 {creatingCat ? "Agregando..." : "Agregar"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* ENVÍO */}
// //         <div className="border rounded p-3 space-y-3">
// //           <div className="font-medium">Envío</div>
// //           <div className="flex items-center gap-4">
// //             <label className="flex items-center gap-2">
// //               <input type="radio" name="envio_modo" value="unidad" checked={form.envio_modo==="unidad"} onChange={onChange}/>
// //               Por unidad
// //             </label>
// //             <label className="flex items-center gap-2">
// //               <input type="radio" name="envio_modo" value="bulto" checked={form.envio_modo==="bulto"} onChange={onChange}/>
// //               Por bulto
// //             </label>
// //           </div>

// //           {form.envio_modo === "unidad" ? (
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //               <label className="flex flex-col">
// //                 <span className="text-sm mb-1">Peso por unidad (kg) *</span>
// //                 <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_peso_kg" value={form.unidad_peso_kg} onChange={onChange} />
// //               </label>
// //               <label className="flex flex-col">
// //                 <span className="text-sm mb-1">Volumen por unidad (dm³) *</span>
// //                 <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_vol_dm3" value={form.unidad_vol_dm3} onChange={onChange} />
// //               </label>
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
// //               <label className="flex flex-col">
// //                 <span className="text-sm mb-1">Unidades por bulto *</span>
// //                 <input type="number" className="border rounded px-3 py-2" name="bulto_unidades" value={form.bulto_unidades} onChange={onChange} />
// //               </label>
// //               <label className="flex flex-col">
// //                 <span className="text-sm mb-1">Peso por bulto (kg) *</span>
// //                 <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_peso_kg" value={form.bulto_peso_kg} onChange={onChange} />
// //               </label>
// //               <label className="flex flex-col">
// //                 <span className="text-sm mb-1">Volumen por bulto (dm³) *</span>
// //                 <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_vol_dm3" value={form.bulto_vol_dm3} onChange={onChange} />
// //               </label>
// //             </div>
// //           )}
// //         </div>

// //         {/* IMÁGENES */}
// //         <div className="border rounded p-3 space-y-2">
// //           <div className="font-medium">Imágenes (jpg/png/webp, sin conversión)</div>
// //           <input type="file" accept="image/*" multiple onChange={onFiles}/>
// //           {previews?.length > 0 && (
// //             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
// //               {previews.map(p => (
// //                 <div key={p.url} className="aspect-square border rounded overflow-hidden">
// //                   <img src={p.url} alt={p.name} className="w-full h-full object-cover"/>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         <div className="flex justify-end">
// //           <button disabled={subiendo} className="px-4 py-2 bg-black text-white rounded hover:opacity-90">
// //             {subiendo ? "Guardando..." : "Crear producto"}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import {
//   crearProducto,
//   listarCategorias,
//   crearCategoria,
//   uploadProductImage,
// } from "../api/products";

// export default function CargarProducto() {
//   const [form, setForm] = useState({
//     nombre: "",
//     descripcion: "",
//     costo: "",
//     precio: "",
//     proveedor: "", // label de front = "Marca" (pero API sigue usando proveedor)
//     stock: 0,
//     categorias: [],
//     envio_modo: "unidad",
//     bulto_unidades: 1,
//     costo_envio_unidad: "0",
//     costo_envio_bulto: "0",
//   });
//   const [cats, setCats] = useState([]);
//   const [files, setFiles] = useState([]);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     listarCategorias().then((r) => setCats(r.data || [])).catch(console.error);
//   }, []);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       // crear producto
//       const { data: prod } = await crearProducto(form);
//       // subir imágenes (si hay)
//       if (files.length) {
//         await Promise.all(files.map((f, idx) => uploadProductImage(prod.id, f, { is_primary: idx === 0, sort_order: idx })));
//       }
//       alert("Producto creado");
//       // reset
//       setForm((s) => ({ ...s, nombre: "", descripcion: "", costo: "", precio: "", stock: 0, categorias: [] }));
//       setFiles([]);
//     } catch (err) {
//       console.error(err?.response?.data || err?.message);
//       alert("Error al crear producto");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const addCategoria = async () => {
//     const nombre = prompt("Nueva categoría:");
//     if (!nombre) return;
//     try {
//       const { data } = await crearCategoria(nombre);
//       setCats((prev) => [...prev, data]);
//       setForm((s) => ({ ...s, categorias: [...s.categorias, data.id] }));
//     } catch (e) {
//       console.error(e?.response?.data || e?.message);
//       alert("No se pudo crear la categoría");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-6">
//       <h1 className="text-xl font-semibold mb-4">Cargar producto</h1>
//       <form onSubmit={onSubmit} className="space-y-4">
//         <input
//           className="w-full px-3 py-2 rounded-lg bg-white/5"
//           placeholder="Nombre"
//           value={form.nombre}
//           onChange={(e) => setForm({ ...form, nombre: e.target.value })}
//           required
//         />
//         <textarea
//           className="w-full px-3 py-2 rounded-lg bg-white/5"
//           placeholder="Descripción"
//           value={form.descripcion}
//           onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
//           rows={4}
//         />
//         <div className="grid grid-cols-2 gap-3">
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Costo" value={form.costo}
//                  onChange={(e) => setForm({ ...form, costo: e.target.value })} />
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Precio" value={form.precio}
//                  onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Marca (proveedor)" value={form.proveedor}
//                  onChange={(e) => setForm({ ...form, proveedor: e.target.value })} />
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Stock" type="number" value={form.stock}
//                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
//         </div>

//         <div>
//           <label className="text-sm text-gray-300">Categorías</label>
//           <div className="flex gap-2 mt-2 flex-wrap">
//             {cats.map((c) => {
//               const active = form.categorias.includes(c.id);
//               return (
//                 <button
//                   type="button"
//                   key={c.id}
//                   onClick={() =>
//                     setForm((s) => ({
//                       ...s,
//                       categorias: active
//                         ? s.categorias.filter((x) => x !== c.id)
//                         : [...s.categorias, c.id],
//                     }))
//                   }
//                   className={`px-3 py-1 rounded-full text-sm ${active ? "bg-blue-600" : "bg-white/10"}`}
//                 >
//                   {c.nombre}
//                 </button>
//               );
//             })}
//             <button type="button" onClick={addCategoria} className="px-3 py-1 rounded-full text-sm bg-green-600">
//               + Nueva
//             </button>
//           </div>
//         </div>

//         {/* Envío */}
//         <div className="grid grid-cols-2 gap-3">
//           <select
//             className="px-3 py-2 rounded-lg bg-white/5"
//             value={form.envio_modo}
//             onChange={(e) => setForm({ ...form, envio_modo: e.target.value })}
//           >
//             <option value="unidad">Envío por unidad</option>
//             <option value="bulto">Envío por bulto</option>
//           </select>
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Unidades por bulto" type="number"
//                  value={form.bulto_unidades}
//                  onChange={(e) => setForm({ ...form, bulto_unidades: Number(e.target.value || 1) })} />
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Costo envío unidad" value={form.costo_envio_unidad}
//                  onChange={(e) => setForm({ ...form, costo_envio_unidad: e.target.value })} />
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Costo envío bulto" value={form.costo_envio_bulto}
//                  onChange={(e) => setForm({ ...form, costo_envio_bulto: e.target.value })} />
//         </div>

//         {/* Imágenes */}
//         <div>
//           <label className="text-sm text-gray-300">Imágenes</label>
//           <input
//             type="file"
//             multiple
//             onChange={(e) => setFiles(Array.from(e.target.files || []))}
//             className="mt-1 block"
//           />
//         </div>

//         <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 disabled:opacity-50">
//           {saving ? "Guardando..." : "Crear producto"}
//         </button>
//       </form>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosConfig";
let toast;
try { toast = (await import("../utils/notify")).toast; } catch { toast = (m)=>alert(m); }

const initialForm = {
  nombre: "",
  descripcion: "",
  precio_minorista: "",
  precio_mayorista: "",
  proveedor: "",
  stock: "",
  categorias: [],
  envio_modo: "unidad",       // "unidad" | "bulto"
  unidad_peso_kg: "",
  unidad_vol_dm3: "",
  bulto_unidades: "",
  bulto_peso_kg: "",
  bulto_vol_dm3: "",
};

export default function CargarProducto() {
  const [form, setForm] = useState(initialForm);
  const [cats, setCats] = useState([]);          // [{id, nombre}, ...]
  const [imagenes, setImagenes] = useState([]);  // File[]
  const [subiendo, setSubiendo] = useState(false);

  // UI para crear categoría
  const [newCatName, setNewCatName] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("products/categorias/");
        const lista = Array.isArray(data) ? data : (data?.results ?? data?.items ?? data?.data ?? []);
        setCats(Array.isArray(lista) ? lista : []);
      } catch (e) {
        console.error(e);
        toast("No pude cargar categorías");
      }
    })();
  }, []);

  const previews = useMemo(
    () => imagenes.map(f => ({ name: f.name, url: URL.createObjectURL(f) })),
    [imagenes]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSelectCats = (e) => {
    const values = Array.from(e.target.selectedOptions).map(o => Number(o.value));
    setForm(p => ({ ...p, categorias: values }));
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setImagenes(files);
  };

  // ---------- Crear categoría nueva ----------
  const existingCatByName = (name) => {
    const n = name?.trim()?.toLowerCase();
    if (!n) return null;
    return cats.find(c => (c?.nombre ?? "").trim().toLowerCase() === n) || null;
  };

  const createCategoryAPI = async (nombre) => {
    // 1) Intento POST directo a /products/categorias/
    try {
      const { data } = await axiosInstance.post("products/categorias/", { nombre });
      return data;
    } catch (e1) {
      // 2) Fallback a /products/categorias/crear/
      try {
        const { data } = await axiosInstance.post("products/categorias/crear/", { nombre });
        return data;
      } catch (e2) {
        // Re-lanzar el segundo error (más representativo si ambos fallan)
        throw e2;
      }
    }
  };

  const addNewCategory = async () => {
    const name = newCatName.trim();
    if (!name) return toast("Ingresá el nombre de la categoría");

    // Si ya existe, solo la seleccionamos
    const ya = existingCatByName(name);
    if (ya?.id) {
      setForm(p => ({
        ...p,
        categorias: p.categorias.includes(ya.id) ? p.categorias : [...p.categorias, ya.id],
      }));
      setNewCatName("");
      return toast("La categoría ya existía; la seleccioné");
    }

    setCreatingCat(true);
    try {
      const creada = await createCategoryAPI(name);
      // Soportar backend que devuelva {id, nombre} o {categoria:{...}}
      const cat = creada?.id ? creada : (creada?.categoria ?? creada);

      if (!cat?.id) {
        throw new Error("Respuesta inesperada al crear la categoría");
      }

      setCats(prev => [...prev, cat]);
      setForm(p => ({ ...p, categorias: [...p.categorias, cat.id] }));
      setNewCatName("");
      toast("Categoría creada y seleccionada");
    } catch (e) {
      console.error(e);
      toast(e?.response?.data?.error || "No se pudo crear la categoría");
    } finally {
      setCreatingCat(false);
    }
  };
  // -------------------------------------------

  const validar = () => {
    if (!form.nombre?.trim()) return "Ingresá un nombre";
    if (!form.precio_minorista) return "Precio minorista requerido";
    if (!form.stock && form.stock !== 0) return "Stock requerido";
    if (!form.categorias?.length) return "Seleccioná al menos una categoría";

    if (form.envio_modo === "unidad") {
      if (form.unidad_peso_kg === "") return "Peso por unidad requerido";
      if (form.unidad_vol_dm3 === "") return "Volumen por unidad requerido";
    } else {
      if (!form.bulto_unidades) return "Unidades por bulto requerido";
      if (form.bulto_peso_kg === "") return "Peso por bulto requerido";
      if (form.bulto_vol_dm3 === "") return "Volumen por bulto requerido";
    }
    return null;
  };

  const crear = async (e) => {
    e.preventDefault();
    const err = validar();
    if (err) return toast(err);

    setSubiendo(true);
    try {
      const fd = new FormData();
      // Campos simples
      ["nombre","descripcion","precio_minorista","precio_mayorista","proveedor","stock","envio_modo",
       "unidad_peso_kg","unidad_vol_dm3","bulto_unidades","bulto_peso_kg","bulto_vol_dm3"
      ].forEach(k => {
        if (form[k] !== "" && form[k] !== null && form[k] !== undefined) {
          fd.append(k, form[k]);
        }
      });
      // Categorías (múltiple)
      (form.categorias || []).forEach(id => fd.append("categorias", id));

      // 1) Crear producto
      const { data: producto } = await axiosInstance.post("products/productos/", fd);

      // 2) Subir imágenes si hay
      if (imagenes.length) {
        const fdImg = new FormData();
        imagenes.forEach(f => fdImg.append("imagenes", f));
        await axiosInstance.post(`products/productos/${producto.id}/subir_imagenes/`, fdImg, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast("Producto creado con éxito");
      setForm(initialForm);
      setImagenes([]);
    } catch (e) {
      console.error(e);
      toast(e?.response?.data?.error || "No se pudo crear el producto");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Cargar producto</h1>

      <form onSubmit={crear} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm mb-1">Nombre *</span>
            <input className="border rounded px-3 py-2" name="nombre" value={form.nombre} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Proveedor</span>
            <input className="border rounded px-3 py-2" name="proveedor" value={form.proveedor} onChange={onChange} />
          </label>

          <label className="md:col-span-2 flex flex-col">
            <span className="text-sm mb-1">Descripción</span>
            <textarea className="border rounded px-3 py-2" name="descripcion" value={form.descripcion} onChange={onChange} rows={3}/>
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Precio minorista *</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_minorista" value={form.precio_minorista} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Precio mayorista</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_mayorista" value={form.precio_mayorista} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Stock *</span>
            <input type="number" className="border rounded px-3 py-2" name="stock" value={form.stock} onChange={onChange} />
          </label>

          {/* CATEGORÍAS */}
          <div className="md:col-span-1 flex flex-col gap-2">
            <span className="text-sm">Categorías *</span>
            <select multiple className="border rounded px-3 py-2 h-40" value={form.categorias} onChange={onSelectCats}>
              {(cats || []).map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <span className="text-xs text-gray-500">Ctrl/Cmd + click para seleccionar varias</span>

            {/* Crear nueva categoría */}
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-3 py-2 flex-1"
                placeholder="Nueva categoría"
                value={newCatName}
                onChange={(e)=>setNewCatName(e.target.value)}
                onKeyDown={(e)=>{ if (e.key==='Enter'){ e.preventDefault(); addNewCategory(); } }}
              />
              <button
                type="button"
                onClick={addNewCategory}
                disabled={creatingCat}
                className="px-3 py-2 bg-black text-white rounded hover:opacity-90"
              >
                {creatingCat ? "Agregando..." : "Agregar"}
              </button>
            </div>
          </div>
        </div>

        {/* ENVÍO */}
        <div className="border rounded p-3 space-y-3">
          <div className="font-medium">Envío</div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="envio_modo" value="unidad" checked={form.envio_modo==="unidad"} onChange={onChange}/>
              Por unidad
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="envio_modo" value="bulto" checked={form.envio_modo==="bulto"} onChange={onChange}/>
              Por bulto
            </label>
          </div>

          {form.envio_modo === "unidad" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="text-sm mb-1">Peso por unidad (kg) *</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_peso_kg" value={form.unidad_peso_kg} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Volumen por unidad (dm³) *</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_vol_dm3" value={form.unidad_vol_dm3} onChange={onChange} />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex flex-col">
                <span className="text-sm mb-1">Unidades por bulto *</span>
                <input type="number" className="border rounded px-3 py-2" name="bulto_unidades" value={form.bulto_unidades} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Peso por bulto (kg) *</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_peso_kg" value={form.bulto_peso_kg} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Volumen por bulto (dm³) *</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_vol_dm3" value={form.bulto_vol_dm3} onChange={onChange} />
              </label>
            </div>
          )}
        </div>

        {/* IMÁGENES */}
        <div className="border rounded p-3 space-y-2">
          <div className="font-medium">Imágenes (jpg/png/webp, sin conversión)</div>
          <input type="file" accept="image/*" multiple onChange={onFiles}/>
          {previews?.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
              {previews.map(p => (
                <div key={p.url} className="aspect-square border rounded overflow-hidden">
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover"/>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button disabled={subiendo} className="px-4 py-2 bg-black text-white rounded hover:opacity-90">
            {subiendo ? "Guardando..." : "Crear producto"}
          </button>
        </div>
      </form>
    </div>
  );
}
