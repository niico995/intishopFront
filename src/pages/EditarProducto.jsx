// // import { useEffect, useMemo, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import axiosInstance from "../api/axiosConfig";
// // let toast;
// // try { toast = (await import("../utils/notify")).toast; } catch { toast = (m)=>alert(m); }

// // export default function EditarProducto() {
// //   const { id } = useParams();
// //   const [form, setForm] = useState(null);
// //   const [cats, setCats] = useState([]);
// //   const [nuevasImgs, setNuevasImgs] = useState([]);  // File[]
// //   const [guardando, setGuardando] = useState(false);
// //   const [subiendoImgs, setSubiendoImgs] = useState(false);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const [pRes, cRes] = await Promise.all([
// //           axiosInstance.get(`products/productos/${id}/`),
// //           axiosInstance.get("products/categorias/"),
// //         ]);
// //         const p = pRes.data;
// //         setForm({
// //           id: p.id,
// //           nombre: p.nombre || "",
// //           descripcion: p.descripcion || "",
// //           precio_base: p.precio_base ?? "",
// //           costo: p.costo ?? "",
// //           proveedor: p.proveedor || "",
// //           stock: p.stock ?? "",
// //           categorias: p.categorias || [],
// //           envio_modo: p.envio_modo || "unidad",
// //           unidad_peso_kg: p.unidad_peso_kg ?? "",
// //           unidad_vol_dm3: p.unidad_vol_dm3 ?? "",
// //           bulto_unidades: p.bulto_unidades ?? "",
// //           bulto_peso_kg: p.bulto_peso_kg ?? "",
// //           bulto_vol_dm3: p.bulto_vol_dm3 ?? "",
// //           imagenes: Array.isArray(p.imagenes) ? p.imagenes : [],
// //           slug: p.slug,
// //         });
// //         setCats(Array.isArray(cRes.data) ? cRes.data : []);
// //       } catch (e) {
// //         console.error(e);
// //         toast("No pude cargar el producto");
// //       }
// //     })();
// //   }, [id]);

// //   const previews = useMemo(
// //     () => nuevasImgs.map(f => ({ name: f.name, url: URL.createObjectURL(f) })),
// //     [nuevasImgs]
// //   );

// //   if (!form) return <div className="p-4">Cargando…</div>;

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
// //     setNuevasImgs(files);
// //   };

// //   const guardar = async (e) => {
// //     e.preventDefault();
// //     setGuardando(true);
// //     try {
// //       const fd = new FormData();
// //       // En PATCH mandamos SOLO lo editable (pero podés enviar todo)
// //       ["nombre","descripcion","precio_base","costo","proveedor","stock",
// //        "envio_modo","unidad_peso_kg","unidad_vol_dm3","bulto_unidades","bulto_peso_kg","bulto_vol_dm3"
// //       ].forEach(k => {
// //         if (form[k] !== "" && form[k] !== null && form[k] !== undefined) {
// //           fd.append(k, form[k]);
// //         }
// //       });
// //       form.categorias.forEach(id => fd.append("categorias", id));
// //       await axiosInstance.patch(`products/productos/${id}/`, fd);
// //       toast("Producto actualizado");
// //     } catch (e) {
// //       console.error(e);
// //       toast(e?.response?.data?.error || "No se pudo actualizar");
// //     } finally {
// //       setGuardando(false);
// //     }
// //   };

// //   const subirImagenes = async () => {
// //     if (!nuevasImgs.length) return toast("No seleccionaste imágenes");
// //     setSubiendoImgs(true);
// //     try {
// //       const fdImg = new FormData();
// //       nuevasImgs.forEach(f => fdImg.append("imagenes", f));
// //       const { data } = await axiosInstance.post(`products/productos/${id}/subir_imagenes/`, fdImg, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });
// //       // refrescar lista local
// //       setForm(p => ({ ...p, imagenes: [...p.imagenes, ...data] }));
// //       setNuevasImgs([]);
// //       toast("Imágenes subidas");
// //     } catch (e) {
// //       console.error(e);
// //       toast(e?.response?.data?.error || "No se pudo subir imágenes");
// //     } finally {
// //       setSubiendoImgs(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto p-4 space-y-6">
// //       <h1 className="text-2xl font-semibold">Editar producto #{id}</h1>

// //       <form onSubmit={guardar} className="space-y-4">
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Nombre</span>
// //             <input className="border rounded px-3 py-2" name="nombre" value={form.nombre} onChange={onChange} />
// //           </label>
// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Proveedor</span>
// //             <input className="border rounded px-3 py-2" name="proveedor" value={form.proveedor} onChange={onChange} />
// //           </label>

// //           <label className="md:col-span-2 flex flex-col">
// //             <span className="text-sm mb-1">Descripción</span>
// //             <textarea className="border rounded px-3 py-2" rows={3} name="descripcion" value={form.descripcion} onChange={onChange} />
// //           </label>

// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Precio del socio (base)</span>
// //             <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_base" value={form.precio_base} onChange={onChange} />
// //           </label>
// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Costo</span>
// //             <input type="number" step="0.01" className="border rounded px-3 py-2" name="costo" value={form.costo} onChange={onChange} />
// //           </label>
// //           <label className="flex flex-col">
// //             <span className="text-sm mb-1">Stock</span>
// //             <input type="number" className="border rounded px-3 py-2" name="stock" value={form.stock} onChange={onChange} />
// //           </label>

// //           <label className="flex flex-col md:col-span-1">
// //             <span className="text-sm mb-1">Categorías</span>
// //             <select multiple className="border rounded px-3 py-2 h-40" value={form.categorias} onChange={onSelectCats}>
// //               {cats.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
// //             </select>
// //             <span className="text-xs text-gray-500 mt-1">Ctrl/Cmd + click para seleccionar varias</span>
// //           </label>
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
// //                 <span className="text-sm mb-1">Peso por unidad (kg)</span>
// //                 <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_peso_kg" value={form.unidad_peso_kg} onChange={onChange} />
// //               </label>
// //               <label className="flex flex-col">
// //                 <span className="text-sm mb-1">Volumen por unidad (dm³)</span>
// //                 <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_vol_dm3" value={form.unidad_vol_dm3} onChange={onChange} />
// //               </label>
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
// //               <label className="flex flex-col">
// //                 <span className="text-sm mb-1">Unidades por bulto</span>
// //                 <input type="number" className="border rounded px-3 py-2" name="bulto_unidades" value={form.bulto_unidades} onChange={onChange} />
// //               </label>
// //               <label className="flex flex-col">
// //                 <span className="text-sm mb-1">Peso por bulto (kg)</span>
// //                 <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_peso_kg" value={form.bulto_peso_kg} onChange={onChange} />
// //               </label>
// //               <label className="flex flex-col">
// //                 <span className="text-sm mb-1">Volumen por bulto (dm³)</span>
// //                 <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_vol_dm3" value={form.bulto_vol_dm3} onChange={onChange} />
// //               </label>
// //             </div>
// //           )}
// //         </div>

// //         {/* IMÁGENES ACTUALES */}
// //         {!!form.imagenes?.length && (
// //           <div className="border rounded p-3">
// //             <div className="font-medium mb-2">Imágenes actuales</div>
// //             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
// //               {form.imagenes.map(img => (
// //                 <div key={img.id} className="aspect-square border rounded overflow-hidden">
// //                   <img src={img.url} alt={`img-${img.id}`} className="w-full h-full object-cover" />
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* NUEVAS IMÁGENES */}
// //         <div className="border rounded p-3 space-y-2">
// //           <div className="font-medium">Agregar imágenes (jpg/png/webp)</div>
// //           <input type="file" accept="image/*" multiple onChange={onFiles} />
// //           {previews?.length > 0 && (
// //             <>
// //               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
// //                 {previews.map(p => (
// //                   <div key={p.url} className="aspect-square border rounded overflow-hidden">
// //                     <img src={p.url} alt={p.name} className="w-full h-full object-cover"/>
// //                   </div>
// //                 ))}
// //               </div>
// //               <button type="button" disabled={subiendoImgs} onClick={subirImagenes}
// //                 className="px-4 py-2 bg-black text-white rounded hover:opacity-90">
// //                 {subiendoImgs ? "Subiendo..." : "Subir nuevas imágenes"}
// //               </button>
// //             </>
// //           )}
// //         </div>

// //         <div className="flex justify-end">
// //           <button disabled={guardando} className="px-4 py-2 bg-black text-white rounded hover:opacity-90">
// //             {guardando ? "Guardando..." : "Guardar cambios"}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import {
//   getProductoSeller,
//   actualizarProducto,
//   listarCategorias,
//   uploadProductImage,
//   listProductImages,
//   setPrimaryImage,
//   deleteProductImage,
// } from "../api/products";
// import { useParams } from "react-router-dom";

// export default function EditarProducto() {
//   const { id } = useParams();
//   const [form, setForm] = useState(null);
//   const [cats, setCats] = useState([]);
//   const [newFiles, setNewFiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [imgs, setImgs] = useState([]);

//   useEffect(() => {
//     let alive = true;
//     Promise.all([getProductoSeller(id), listarCategorias(), listProductImages(id)])
//       .then(([prod, cResp, iResp]) => {
//         if (!alive) return;
//         setForm(prod.data);
//         setCats(cResp.data || []);
//         setImgs(iResp.data || []);
//       })
//       .catch((e) => console.error(e))
//       .finally(() => alive && setLoading(false));
//     return () => { alive = false; };
//   }, [id]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await actualizarProducto(id, {
//         nombre: form.nombre,
//         descripcion: form.descripcion,
//         costo: form.costo,
//         precio: form.precio,
//         proveedor: form.proveedor,
//         stock: form.stock,
//         categorias: form.categorias || [],
//         envio_modo: form.envio_modo,
//         bulto_unidades: form.bulto_unidades,
//         costo_envio_unidad: form.costo_envio_unidad,
//         costo_envio_bulto: form.costo_envio_bulto,
//       });

//       if (newFiles.length) {
//         await Promise.all(newFiles.map((f, idx) => uploadProductImage(id, f, { sort_order: idx })));
//       }

//       const imgsRes = await listProductImages(id);
//       setImgs(imgsRes.data || []);
//       setNewFiles([]);
//       alert("Producto actualizado");
//     } catch (err) {
//       console.error(err?.response?.data || err?.message);
//       alert("Error al actualizar");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading || !form) return <div className="p-6">Cargando...</div>;

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-6">
//       <h1 className="text-xl font-semibold mb-4">Editar producto #{id}</h1>
//       <form onSubmit={onSubmit} className="space-y-4">
//         <input className="w-full px-3 py-2 rounded-lg bg-white/5" value={form.nombre}
//                onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
//         <textarea className="w-full px-3 py-2 rounded-lg bg-white/5" rows={4} value={form.descripcion}
//                   onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
//         <div className="grid grid-cols-2 gap-3">
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Costo" value={form.costo}
//                  onChange={(e) => setForm({ ...form, costo: e.target.value })} />
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Precio" value={form.precio}
//                  onChange={(e) => setForm({ ...form, precio: e.target.value })} />
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Marca (proveedor)" value={form.proveedor}
//                  onChange={(e) => setForm({ ...form, proveedor: e.target.value })} />
//           <input className="px-3 py-2 rounded-lg bg-white/5" placeholder="Stock" type="number" value={form.stock}
//                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
//         </div>

//         <div>
//           <label className="text-sm text-gray-300">Categorías</label>
//           <div className="flex gap-2 mt-2 flex-wrap">
//             {cats.map((c) => {
//               const active = (form.categorias || []).includes(c.id);
//               return (
//                 <button
//                   type="button"
//                   key={c.id}
//                   onClick={() =>
//                     setForm((s) => ({
//                       ...s,
//                       categorias: active
//                         ? s.categorias.filter((x) => x !== c.id)
//                         : [...(s.categorias || []), c.id],
//                     }))
//                   }
//                   className={`px-3 py-1 rounded-full text-sm ${active ? "bg-blue-600" : "bg-white/10"}`}
//                 >
//                   {c.nombre}
//                 </button>
//               );
//             })}
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

//         {/* Imágenes actuales */}
//         <div>
//           <div className="text-sm text-gray-300 mb-2">Imágenes</div>
//           <div className="flex flex-wrap gap-3">
//             {imgs.map((im) => (
//               <div key={im.id} className="w-32">
//                 {/* eslint-disable-next-line jsx-a11y/alt-text */}
//                 <img src={im.url} className="w-32 h-24 object-cover rounded-lg" />
//                 <div className="flex gap-1 mt-1">
//                   {!im.is_primary && (
//                     <button type="button" className="text-xs px-2 py-1 bg-blue-600 rounded"
//                             onClick={async () => {
//                               await setPrimaryImage(im.id);
//                               const refreshed = await listProductImages(id);
//                               setImgs(refreshed.data || []);
//                             }}>Primaria</button>
//                   )}
//                   <button type="button" className="text-xs px-2 py-1 bg-red-600 rounded"
//                           onClick={async () => {
//                             await deleteProductImage(im.id);
//                             setImgs((prev) => prev.filter((x) => x.id !== im.id));
//                           }}>Borrar</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Subir nuevas */}
//         <div>
//           <label className="text-sm text-gray-300">Agregar imágenes</label>
//           <input type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files || []))} className="mt-1 block" />
//         </div>

//         <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 disabled:opacity-50">
//           {saving ? "Guardando..." : "Guardar cambios"}
//         </button>
//       </form>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
let toast;
try { toast = (await import("../utils/notify")).toast; } catch { toast = (m)=>alert(m); }

export default function EditarProducto() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [cats, setCats] = useState([]);
  const [nuevasImgs, setNuevasImgs] = useState([]);  // File[]
  const [guardando, setGuardando] = useState(false);
  const [subiendoImgs, setSubiendoImgs] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axiosInstance.get(`products/productos/${id}/`),
          axiosInstance.get("products/categorias/"),
        ]);
        const p = pRes.data;
        setForm({
          id: p.id,
          nombre: p.nombre || "",
          descripcion: p.descripcion || "",
          precio_base: p.precio_base ?? "",
          costo: p.costo ?? "",
          proveedor: p.proveedor || "",
          stock: p.stock ?? "",
          categorias: p.categorias || [],
          envio_modo: p.envio_modo || "unidad",
          unidad_peso_kg: p.unidad_peso_kg ?? "",
          unidad_vol_dm3: p.unidad_vol_dm3 ?? "",
          bulto_unidades: p.bulto_unidades ?? "",
          bulto_peso_kg: p.bulto_peso_kg ?? "",
          bulto_vol_dm3: p.bulto_vol_dm3 ?? "",
          imagenes: Array.isArray(p.imagenes) ? p.imagenes : [],
          slug: p.slug,
        });
        setCats(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (e) {
        console.error(e);
        toast("No pude cargar el producto");
      }
    })();
  }, [id]);

  const previews = useMemo(
    () => nuevasImgs.map(f => ({ name: f.name, url: URL.createObjectURL(f) })),
    [nuevasImgs]
  );

  if (!form) return <div className="p-4">Cargando…</div>;

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
    setNuevasImgs(files);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const fd = new FormData();
      // En PATCH mandamos SOLO lo editable (pero podés enviar todo)
      ["nombre","descripcion","precio_base","costo","proveedor","stock",
       "envio_modo","unidad_peso_kg","unidad_vol_dm3","bulto_unidades","bulto_peso_kg","bulto_vol_dm3"
      ].forEach(k => {
        if (form[k] !== "" && form[k] !== null && form[k] !== undefined) {
          fd.append(k, form[k]);
        }
      });
      form.categorias.forEach(id => fd.append("categorias", id));
      await axiosInstance.patch(`products/productos/${id}/`, fd);
      toast("Producto actualizado");
    } catch (e) {
      console.error(e);
      toast(e?.response?.data?.error || "No se pudo actualizar");
    } finally {
      setGuardando(false);
    }
  };

  const subirImagenes = async () => {
    if (!nuevasImgs.length) return toast("No seleccionaste imágenes");
    setSubiendoImgs(true);
    try {
      const fdImg = new FormData();
      nuevasImgs.forEach(f => fdImg.append("imagenes", f));
      const { data } = await axiosInstance.post(`products/productos/${id}/subir_imagenes/`, fdImg, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // refrescar lista local
      setForm(p => ({ ...p, imagenes: [...p.imagenes, ...data] }));
      setNuevasImgs([]);
      toast("Imágenes subidas");
    } catch (e) {
      console.error(e);
      toast(e?.response?.data?.error || "No se pudo subir imágenes");
    } finally {
      setSubiendoImgs(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Editar producto #{id}</h1>

      <form onSubmit={guardar} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm mb-1">Nombre</span>
            <input className="border rounded px-3 py-2" name="nombre" value={form.nombre} onChange={onChange} />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Proveedor</span>
            <input className="border rounded px-3 py-2" name="proveedor" value={form.proveedor} onChange={onChange} />
          </label>

          <label className="md:col-span-2 flex flex-col">
            <span className="text-sm mb-1">Descripción</span>
            <textarea className="border rounded px-3 py-2" rows={3} name="descripcion" value={form.descripcion} onChange={onChange} />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Precio del socio (base)</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="precio_base" value={form.precio_base} onChange={onChange} />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Costo</span>
            <input type="number" step="0.01" className="border rounded px-3 py-2" name="costo" value={form.costo} onChange={onChange} />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Stock</span>
            <input type="number" className="border rounded px-3 py-2" name="stock" value={form.stock} onChange={onChange} />
          </label>

          <label className="flex flex-col md:col-span-1">
            <span className="text-sm mb-1">Categorías</span>
            <select multiple className="border rounded px-3 py-2 h-40" value={form.categorias} onChange={onSelectCats}>
              {cats.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <span className="text-xs text-gray-500 mt-1">Ctrl/Cmd + click para seleccionar varias</span>
          </label>
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
                <span className="text-sm mb-1">Peso por unidad (kg)</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_peso_kg" value={form.unidad_peso_kg} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Volumen por unidad (dm³)</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="unidad_vol_dm3" value={form.unidad_vol_dm3} onChange={onChange} />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex flex-col">
                <span className="text-sm mb-1">Unidades por bulto</span>
                <input type="number" className="border rounded px-3 py-2" name="bulto_unidades" value={form.bulto_unidades} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Peso por bulto (kg)</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_peso_kg" value={form.bulto_peso_kg} onChange={onChange} />
              </label>
              <label className="flex flex-col">
                <span className="text-sm mb-1">Volumen por bulto (dm³)</span>
                <input type="number" step="0.001" className="border rounded px-3 py-2" name="bulto_vol_dm3" value={form.bulto_vol_dm3} onChange={onChange} />
              </label>
            </div>
          )}
        </div>

        {/* IMÁGENES ACTUALES */}
        {!!form.imagenes?.length && (
          <div className="border rounded p-3">
            <div className="font-medium mb-2">Imágenes actuales</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {form.imagenes.map(img => (
                <div key={img.id} className="aspect-square border rounded overflow-hidden">
                  <img src={img.url} alt={`img-${img.id}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NUEVAS IMÁGENES */}
        <div className="border rounded p-3 space-y-2">
          <div className="font-medium">Agregar imágenes (jpg/png/webp)</div>
          <input type="file" accept="image/*" multiple onChange={onFiles} />
          {previews?.length > 0 && (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                {previews.map(p => (
                  <div key={p.url} className="aspect-square border rounded overflow-hidden">
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover"/>
                  </div>
                ))}
              </div>
              <button type="button" disabled={subiendoImgs} onClick={subirImagenes}
                className="px-4 py-2 bg-black text-white rounded hover:opacity-90">
                {subiendoImgs ? "Subiendo..." : "Subir nuevas imágenes"}
              </button>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button disabled={guardando} className="px-4 py-2 bg-black text-white rounded hover:opacity-90">
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
