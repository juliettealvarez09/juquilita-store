import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { addItem } from '../services/cart';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

export default function Shop({ cartCount, onCartChange }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    api.getProducts(search, selectedCategory).then(setProducts).catch(() => {});
  }, [search, selectedCategory]);

  function handleSearch(e) {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  }

  function selectCategory(id) {
    const newCat = selectedCategory === String(id) ? '' : String(id);
    setSelectedCategory(newCat);
    const params = {};
    if (search) params.search = search;
    if (newCat) params.category = newCat;
    setSearchParams(params);
  }

  function handleAdd(product) {
    addItem(product);
    onCartChange();
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container">
        <section className="page-section">
          <h2>¿Qué necesitas?</h2>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              className="input"
              type="text"
              placeholder="Buscar producto…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Buscar</button>
          </form>

          <div className="categories-grid">
            {categories.map(cat => (
              <div
                key={cat.id}
                className={`category-card ${selectedCategory === String(cat.id) ? 'active' : ''}`}
                onClick={() => selectCategory(cat.id)}
              >
                {cat.name}
              </div>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <h3>No encontramos productos</h3>
              <p>Intenta con otra búsqueda o categoría.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onAdd={handleAdd} />
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
