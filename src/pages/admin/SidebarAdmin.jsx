
import { Link, useLocation } from 'react-router-dom';
import { Users, DollarSign, Image as ImageIcon } from 'lucide-react';

export default function SidebarAdmin() {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + '/');

  const linkClasses = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 ${
      isActive(path) ? 'bg-gray-300 font-bold' : ''
    }`;

  return (
    <aside className="w-64 h-screen bg-gray-100 p-4 border-r">
      <h2 className="text-xl font-semibold mb-6">Panel Admin</h2>
      <nav className="space-y-2">
        <Link to="/admin/socios" className={linkClasses('/admin/socios')}>
          <Users size={18} />
          <span>Socios</span>
        </Link>

        {/* Resumen Pagos (ruta correcta según tu App.jsx) */}
        <Link to="/admin/resumen-pagos" className={linkClasses('/admin/resumen-pagos')}>
          <DollarSign size={18} />
          <span>Resumen Pagos</span>
        </Link>

        {/* Nuevo: Banners Home */}
        <Link to="/admin/banners-home" className={linkClasses('/admin/banners-home')}>
          <ImageIcon size={18} />
          <span>Banners Home</span>
        </Link>
      </nav>
    </aside>
  );
}
