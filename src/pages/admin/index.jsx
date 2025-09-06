
import { Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminGuard from "../../components/AdminGuard";
import AdminSociosList from "./socios/AdminSociosList";
import AdminSocioForm from "./socios/AdminSocioForm";
import AdminSocioDetail from "./socios/AdminSocioDetail";
import AdminPagosResumen from "./pagos/AdminPagosResumen";
import AdminPagosPorSocio from "./pagos/AdminPagosPorSocio";

export const adminRoutes = (
  <Route
    path="/admin"
    element={<AdminGuard><AdminLayout /></AdminGuard>}
  >
    <Route index element={<AdminPagosResumen />} />
    <Route path="socios" element={<AdminSociosList />} />
    <Route path="socios/nuevo" element={<AdminSocioForm />} />
    <Route path="socios/:id" element={<AdminSocioDetail />} />
    <Route path="pagos" element={<AdminPagosResumen />} />
    <Route path="pagos/socio/:id" element={<AdminPagosPorSocio />} />
  </Route>
);
