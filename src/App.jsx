import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Registro from "./pages/Registro";
import Login from "./pages/login/login";
import Tienda from "./pages/Tienda";

// Cliente
import CargarPerfilCliente from "./pages/CargarPerfilCliente";
import DashboardCliente from "./pages/DashboardCliente";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import ResumenPagos from "./pages/admin/ResumenPagos";
import DetallePagos from "./pages/admin/DetallePago";

// Socio
import SocioLayout from "./pages/SocioLayout";
import VerificarPerfilSocio from "./pages/VerificarPerfilSocio";
import CrearPerfilSocio from "./pages/CrearPerfilSocio";
import MiPerfilSocio from "./pages/CargarPerfilSocio";
import PerfilSocio from "./pages/PerfilSocio";
import PagosSocio from "./pages/PagosSocio";
import CargarProducto from "./pages/CargarProducto";
import EditarProducto from "./pages/EditarProducto";
import ListadoProductos from "./pages/ListadoProductos";
import ProductPage from "./pages/ProductPage";
import VendedorPage from "./pages/VendedorPage";
import BannersSocio from "./pages/BannerSocio";


import AdminGuard from "./components/AdminGuard";
import AdminSociosList from "./pages/admin/AdminSocioList";
import AdminSocioDetail from "./pages/admin/AdminSocioDetail";
import AdminSocioForm from "./pages/admin/AdminSocioForm";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Público */}
          <Route path="/" element={<Tienda />} />
          <Route path="/login" element={<Login />} />
          <Route path="/producto/:id" element={<ProductPage />} />
<Route path="/vendedor/:id" element={< VendedorPage />} />

          {/* Registro */}
          <Route path="/registro/cliente" element={<Registro />} />
          <Route path="/registro/admin" element={<Registro />} />
          <Route path="/registro/socio" element={<Registro />} />

          {/* Cliente */}
          <Route path="/cliente/perfil" element={<CargarPerfilCliente />} />
          <Route path="/dashboard-cliente" element={<DashboardCliente />} />

          {/* Admin */}
<Route
  path="/admin"
  element={
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  }
>
  {/* 👇 sin Navigate, mostramos el resumen directo */}
  <Route index element={<ResumenPagos />} />
  <Route path="resumen-pagos" element={<ResumenPagos />} />
  <Route path="socios" element={<AdminSociosList />} />
  <Route path="socios/nuevo" element={<AdminSocioForm />} />
  <Route path="socios/:id" element={<AdminSocioDetail />} />
  <Route path="pagos/socio/:id" element={<DetallePagos />} />
</Route>

          {/* Socio */}
          <Route path="/socio" element={<VerificarPerfilSocio />}>
            <Route element={<SocioLayout />}>
              <Route path="crear-perfil" element={<CrearPerfilSocio />} />
              <Route path="perfil" element={<MiPerfilSocio />} />
              <Route path="perfil-ver" element={<PerfilSocio />} />
              <Route path="pagos" element={<PagosSocio />} />
              <Route path="productos" element={<ListadoProductos />} />
              <Route path="productos/cargar" element={<CargarProducto />} />
              <Route path="productos/editar/:id" element={<EditarProducto />} />
              <Route path="banners" element={<BannersSocio />} />
              {/* Catch-all para rutas inválidas dentro de socio */}
              <Route path="*" element={<Navigate to="/socio/productos" replace />} />
            </Route>
          </Route>

          {/* Si no existe la ruta, redirigir a la tienda */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
