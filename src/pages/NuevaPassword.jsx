// // src/pages/NuevaPassword.jsx
// import { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../api/axiosConfig";
// import { toast } from "../utils/notify";

// export default function NuevaPassword() {
//   const [sp] = useSearchParams();
//   const navigate = useNavigate();
//   const token = sp.get("token");
//   const [pwd, setPwd] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!token) {
//       toast.error("Falta el token.");
//     }
//   }, [token]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) return toast.error("Token inválido.");
//     if (!pwd || pwd.length < 8) return toast.error("Mínimo 8 caracteres.");
//     setLoading(true);
//     try {
//       await axiosInstance.post("users/password/reset/confirm/", {
//         token,
//         new_password: pwd,
//       });
//       toast.success("Listo. Iniciá sesión con tu nueva contraseña.");
//       navigate("/login");
//     } catch (err) {
//       const msg = err?.response?.data?.error || "No se pudo actualizar.";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-4">Nueva contraseña</h1>
//       <form onSubmit={onSubmit} className="space-y-4">
//         <input
//           type="password"
//           className="w-full border rounded-lg p-3"
//           placeholder="Nueva contraseña (mín. 8)"
//           value={pwd}
//           onChange={(e) => setPwd(e.target.value)}
//         />
//         <button
//           disabled={loading}
//           className="w-full rounded-lg p-3 bg-black text-white disabled:opacity-60"
//         >
//           {loading ? "Guardando..." : "Guardar y continuar"}
//         </button>
//       </form>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { toast } from "../utils/notify";

export default function NuevaPassword() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const token = sp.get("token") || "";

  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenOk, setTokenOk] = useState(true); // asumimos OK si no queremos validar

  useEffect(() => {
    if (!token) {
      toast("Falta el token en la URL.", "error");
      setTokenOk(false);
      return;
    }
    // (Opcional) validar token antes de mostrar el form
    axios
      .get(`users/password/reset/validate/?token=${encodeURIComponent(token)}`)
      .then((res) => setTokenOk(Boolean(res?.data?.valid)))
      .catch(() => setTokenOk(true)); // si falla la validación, dejamos pasar para intentar el confirm
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast("Falta el token.", "error");
    if (!pwd1 || !pwd2) return toast("Completá ambas contraseñas.", "error");
    if (pwd1 !== pwd2) return toast("Las contraseñas no coinciden.", "error");
    if (pwd1.length < 8) return toast("La contraseña debe tener al menos 8 caracteres.", "error");

    setLoading(true);
    try {
      const { data } = await axios.post("users/password/reset/confirm/", {
        token,
        new_password: pwd1,
      });

      toast("Contraseña actualizada correctamente.", "success");

      // Si habilitaste autologin en el back, podés guardar los tokens acá
      if (data?.access && data?.refresh) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        return navigate("/", { replace: true });
      }

      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "No se pudo actualizar la contraseña";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenOk) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Enlace inválido o vencido</h1>
        <p className="text-sm text-gray-600">Solicitá uno nuevo desde Recuperar contraseña.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Nueva contraseña</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full border rounded-lg p-3"
          placeholder="Nueva contraseña"
          value={pwd1}
          onChange={(e) => setPwd1(e.target.value)}
          minLength={8}
          required
        />
        <input
          type="password"
          className="w-full border rounded-lg p-3"
          placeholder="Repetí la contraseña"
          value={pwd2}
          onChange={(e) => setPwd2(e.target.value)}
          minLength={8}
          required
        />
        <button
          disabled={loading}
          className="w-full rounded-lg p-3 bg-black text-white disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar nueva contraseña"}
        </button>
      </form>
    </div>
  );
}