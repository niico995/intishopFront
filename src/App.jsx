import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// 🛒 Carrito (contador global)
import { CartProvider } from "./components/CartContext";

// 🧭 Navbar pública (solo en rutas públicas)
import Navbar from "./components/NavBar";

// Páginas públicas / tienda
import Home from "./pages/Home";
import Tienda from "./pages/Tienda";
import Buscar from "./pages/Buscar";
import Categoria from "./pages/Categoria";
import Carrito from "./pages/Carrito";
import ProductPage from "./pages/ProductPage";
import VendedorPage from "./pages/VendedorPage";

// Auth/Registro/Login
import Registro from "./pages/Registro";
import Login from "./pages/login/login";

// Cliente
import CargarPerfilCliente from "./pages/CargarPerfilCliente";
import DashboardCliente from "./pages/DashboardCliente";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import ResumenPagos from "./pages/admin/ResumenPagos";
import DetallePagos from "./pages/admin/DetallePago";
import AdminGuard from "./components/AdminGuard";
import AdminSociosList from "./pages/admin/AdminSocioList";
import AdminSocioDetail from "./pages/admin/AdminSocioDetail";
import AdminSocioForm from "./pages/admin/AdminSocioForm";

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
import BannersSocio from "./pages/BannerSocio";

// Layout público con Navbar
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* ========= PÚBLICO (con Navbar) ========= */}
            <Route element={<PublicLayout />}>
              {/* Público / Tienda */}
              <Route path="/" element={<Home />} />
              <Route path="/producto/:id" element={<ProductPage />} />
              <Route path="/vendedor/:id" element={<VendedorPage />} />

              {/* Buscador y categoría */}
              <Route path="/buscar" element={<Buscar />} />
              <Route path="/c/:slug" element={<Categoria />} />

              {/* Carrito */}
              <Route path="/carrito" element={<Carrito />} />

              {/* Perfil público (placeholder por ahora) */}
              <Route
                path="/perfil"
                element={<div className="max-w-6xl mx-auto p-4">Perfil del usuario (luego lo armamos)</div>}
              />

              {/* Atajo para ser socio */}
              <Route path="/quiero-ser-socio" element={<Navigate to="/registro/socio" replace />} />

              {/* Registro (con Navbar) */}
              <Route path="/registro/cliente" element={<Registro />} />
              <Route path="/registro/admin" element={<Registro />} />
              <Route path="/registro/socio" element={<Registro />} />

              {/* Cliente (si querés sin Navbar, los sacamos de este layout) */}
              <Route path="/cliente/perfil" element={<CargarPerfilCliente />} />
              <Route path="/dashboard-cliente" element={<DashboardCliente />} />
            </Route>

            {/* ========= LOGIN (sin Navbar) ========= */}
            <Route path="/login" element={<Login />} />

            {/* ========= ADMIN (sin Navbar) ========= */}
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<ResumenPagos />} />
              <Route path="resumen-pagos" element={<ResumenPagos />} />
              <Route path="socios" element={<AdminSociosList />} />
              <Route path="socios/nuevo" element={<AdminSocioForm />} />
              <Route path="socios/:id" element={<AdminSocioDetail />} />
              <Route path="pagos/socio/:id" element={<DetallePagos />} />
            </Route>

            {/* ========= SOCIO (sin Navbar) ========= */}
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

            {/* ========= 404 → tienda ========= */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
