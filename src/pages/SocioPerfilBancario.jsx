// src/pages/SocioPerfilBancario.jsx
import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { toast, alert } from '../utils/notify';

export default function SocioPerfilBancario() {
  const [cbu, setCbu] = useState('');
  const [alias, setAlias] = useState('');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('sellers/mi-perfil-socio/');
        setCbu(data?.cbu || '');
        setAlias(data?.alias || '');
        setComprobanteUrl(data?.cbu_comprobante_url || '');
      } catch {
        // perfil puede no existir
      }
    })();
  }, []);

  const uploadComprobante = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('sellers/bank/upload/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setComprobanteUrl(data?.url || '');
    toast('Comprobante subido');
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (file) await uploadComprobante();
      await api.patch('sellers/bank/', {
        cbu: cbu.trim(),
        alias: alias.trim(),
        cbu_comprobante_url: comprobanteUrl
      });
      toast('Datos bancarios guardados');
    } catch (e) {
      const d = e?.response?.data;
      alert('Error al guardar', d?.error || 'Revisá los datos', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{maxWidth:560, margin:'20px auto', padding:16}}>
      <h2>Datos Bancarios</h2>
      <form onSubmit={onSave} style={{display:'grid', gap:12}}>
        <label>CBU (22 dígitos)
          <input value={cbu} onChange={e=>setCbu(e.target.value.replace(/\D+/g,''))}
                 maxLength={22} required style={{width:'100%', padding:8, marginTop:6}} />
        </label>
        <label>Alias
          <input value={alias} onChange={e=>setAlias(e.target.value)} style={{width:'100%', padding:8, marginTop:6}} />
        </label>
        <label>Comprobante (imagen)
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} />
          {comprobanteUrl && <div style={{marginTop:8}}><a href={comprobanteUrl} target="_blank" rel="noreferrer">Ver comprobante</a></div>}
        </label>
        <button type="submit" disabled={saving}
          style={{padding:10, border:'none', borderRadius:6, background:saving?'#6b7280':'#22c55e', color:'#fff'}}>
          {saving? 'Guardando…':'Guardar'}
        </button>
      </form>
    </div>
  );
}
