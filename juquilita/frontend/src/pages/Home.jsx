import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home({ cartCount }) {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/tienda?search=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container">
        <section className="hero">
          <h1>Encuentra lo que necesitas</h1>
          <p>Herramientas y materiales para tu hogar, reparación o proyecto.</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              className="input"
              type="text"
              placeholder="Cemento, tornillos, pintura…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Buscar</button>
          </form>
        </section>

        <section className="page-section">
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/tienda?category=${cat.id}`} className="category-card">
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        <hr className="section-divider" />

        <section className="how-to">
          <h2>Comprar es fácil</h2>
          <div className="how-to-grid">
            <div className="how-to-step">
              <div className="how-to-number">1</div>
              <h3>Busca</h3>
              <p>Encuentra lo que necesitas.</p>
            </div>
            <div className="how-to-step">
              <div className="how-to-number">2</div>
              <h3>Agrega</h3>
              <p>Selecciona cuánto necesitas.</p>
            </div>
            <div className="how-to-step">
              <div className="how-to-number">3</div>
              <h3>Confirma</h3>
              <p>Dinos cómo quieres recibirlo.</p>
            </div>
            <div className="how-to-step">
              <div className="how-to-number">4</div>
              <h3>Listo</h3>
              <p>Juquilita prepara tu pedido.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
