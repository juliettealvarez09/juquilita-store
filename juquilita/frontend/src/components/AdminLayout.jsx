import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: '/admin', label: 'Inicio' },
    { path: '/admin/productos', label: 'Productos' },
    { path: '/admin/inventario', label: 'Inventario' },
    { path: '/admin/pedidos', label: 'Pedidos' },
  ];

  function isActive(path) {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">JUQUILITA</div>
        {links.map(link => (
          <Link key={link.path} to={link.path} className={isActive(link.path) ? 'active' : ''}>
            {link.label}
          </Link>
        ))}
        <a className="logout-btn" onClick={logout} style={{ cursor: 'pointer' }}>Cerrar sesión</a>
      </aside>
      <main className="admin-main">
        <div className="admin-mobile-nav">
          {links.map(link => (
            <Link key={link.path} to={link.path} className={isActive(link.path) ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
        </div>
        {children}
      </main>
    </div>
  );
}
