// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useState } from "react";

// const linkCls = ({ isActive }) =>
//   `block px-3 py-2 rounded-md text-sm font-medium transition
//    ${isActive ? "bg-white/15 text-white" : "text-white/90 hover:bg-white/10"}`;

// export default function AdminLayout() {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex">
//       {/* Sidebar */}
//       <aside
//         className={`bg-slate-900 text-white w-64 p-4 flex flex-col fixed inset-y-0 z-40
//                     transform transition-transform duration-200
//                     ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
//       >
//         <h2 className="text-2xl font-bold mb-6">Admin</h2>
//         <nav className="space-y-1">
//           {/* 👇 ABSOLUTAS, NO relativas */}
//           <NavLink to="/admin/resumen-pagos" className={linkCls}>
//             Resumen de Pagos
//           </NavLink>
//           <NavLink to="/admin/socios" className={linkCls}>
//             Socios
//           </NavLink>
//           {/* ✅ Banners Home */}
//           <NavLink to="/admin/banners-home" className={linkCls}>
//             Banners Home
//           </NavLink>
//           {/* ✅ Nuevo: Multiplicador de precios */}
//           <NavLink to="/admin/config/precios" className={linkCls}>
//             Multiplicador
//           </NavLink>
//         </nav>
//         <button
//           onClick={() => {
//             logout();
//             navigate("/login");
//           }}
//           className="mt-auto bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-2 text-sm"
//         >
//           Cerrar sesión
//         </button>
//       </aside>

//       {/* Topbar móvil */}
//       <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white p-3 z-30 flex justify-between items-center">
//         <button
//           onClick={() => setOpen((v) => !v)}
//           className="px-2 py-1 border border-white/30 rounded"
//         >
//           Menú
//         </button>
//         <span className="font-semibold">Panel Admin</span>
//         <button
//           onClick={() => {
//             logout();
//             navigate("/login");
//           }}
//           className="px-2 py-1 border border-white/30 rounded"
//         >
//           Salir
//         </button>
//       </div>

//       {/* Contenido */}
//       <main className="flex-1 md:ml-64 w-full p-4 md:p-6 mt-12 md:mt-0">
//         <Outlet />
//       </main>

//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 bg-black/30 z-30 md:hidden"
//         />
//       )}
//     </div>
//   );
// }
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const linkCls = ({ isActive }) =>
  `block px-3 py-2 rounded-md text-sm font-medium transition
   ${isActive ? "bg-white/15 text-white" : "text-white/90 hover:bg-white/10"}`;

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 text-white w-64 p-4 flex flex-col fixed inset-y-0 z-40
                    transform transition-transform duration-200
                    ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-6">Admin</h2>
        <nav className="space-y-1">
          {/* 👇 ABSOLUTAS, NO relativas */}
          <NavLink to="/admin/resumen-pagos" className={linkCls}>
            Resumen de Pagos
          </NavLink>
          <NavLink to="/admin/socios" className={linkCls}>
            Socios
          </NavLink>
          {/* ✅ Banners Home */}
          <NavLink to="/admin/banners-home" className={linkCls}>
            Banners Home
          </NavLink>
          {/* ✅ Nuevo: Multiplicador de precios */}
          <NavLink to="/admin/config/precios" className={linkCls}>
            Multiplicador
          </NavLink>
        </nav>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-2 text-sm"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Topbar móvil */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white p-3 z-30 flex justify-between items-center">
        <button
          onClick={() => setOpen((v) => !v)}
          className="px-2 py-1 border border-white/30 rounded"
        >
          Menú
        </button>
        <span className="font-semibold">Panel Admin</span>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-2 py-1 border border-white/30 rounded"
        >
          Salir
        </button>
      </div>

      {/* Contenido */}
      <main className="flex-1 md:ml-64 w-full p-4 md:p-6 mt-12 md:mt-0">
        <Outlet />
      </main>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        />
      )}
    </div>
  );
}
