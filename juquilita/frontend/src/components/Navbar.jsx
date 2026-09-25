import { Link, useLocation } from 'react-router-dom';
import { getCount } from '../services/cart';

export default function Navbar({ cartCount }) {
  const location = useLocation();
  const count = cartCount ?? getCount();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">JUQUILITA</Link>
        <div className="navbar-links">
          <Link to="/tienda" className={location.pathname === '/tienda' ? 'active' : ''}>
            Productos
          </Link>
          <Link to="/pedido" className={location.pathname === '/pedido' ? 'active' : ''}>
            Mi pedido
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
