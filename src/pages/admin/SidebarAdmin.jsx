// src/components/admin/SidebarAdmin.jsx
import { Link, useLocation } from 'react-router-dom';
import { Users, DollarSign } from 'lucide-react';

export default function SidebarAdmin() {
  const { pathname } = useLocation();

  const linkClasses = (path) =>
    `block px-4 py-2 rounded hover:bg-gray-200 ${
      pathname === path ? 'bg-gray-300 font-bold' : ''
    }`;

  return (
    <aside className="w-64 h-screen bg-gray-100 p-4 border-r">
      <h2 className="text-xl font-semibold mb-6">Panel Admin</h2>
      <nav className="space-y-2">
        <Link to="/admin/socios" className={linkClasses('/admin/socios')}>
          <Users className="inline mr-2" size={18} />
          Socios
        </Link>
        <Link to="/admin/pagos/resumen" className={linkClasses('/admin/pagos/resumen')}>
          <DollarSign className="inline mr-2" size={18} />
          Resumen Pagos
        </Link>
      </nav>
    </aside>
  );
}
