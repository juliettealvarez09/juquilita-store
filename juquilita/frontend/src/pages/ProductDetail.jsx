import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { addItem } from '../services/cart';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuantitySelector from '../components/QuantitySelector';

function getAvailability(stock, minimumStock) {
  if (stock === 0) return { text: 'Agotado', className: 'badge-out' };
  if (stock <= minimumStock) return { text: 'Quedan pocos', className: 'badge-low' };
  return { text: 'Disponible', className: 'badge-available' };
}

export default function ProductDetail({ cartCount, onCartChange }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.getProduct(id).then(setProduct).catch(() => {});
  }, [id]);

  function handleAdd() {
    if (!product) return;
    addItem(product, quantity);
    onCartChange();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!product) return <><Navbar cartCount={cartCount} /><div className="container" style={{padding: '3rem 1rem', textAlign: 'center'}}>Cargando...</div></>;

  const avail = getAvailability(product.stock, product.minimum_stock);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container">
        <div className="product-detail">
          <img
            src={product.image_url || 'https://placehold.co/400x400/f5f0eb/1a1a1a?text=Producto'}
            alt={product.name}
            className="product-detail-img"
          />
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <div className="product-detail-brand">{product.brand}</div>
            <div>
              <span className="product-detail-price">${Number(product.price).toFixed(2)}</span>
              <span className="product-detail-unit">por {product.unit}</span>
            </div>
            <div style={{ margin: '1rem 0' }}>
              <span className={`badge ${avail.className}`}>{avail.text}</span>
            </div>
            {product.description && (
              <p className="product-detail-desc">{product.description}</p>
            )}
            {product.stock > 0 && (
              <div className="product-detail-actions">
                <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
                <button className="btn btn-primary" onClick={handleAdd}>
                  {added ? '¡Agregado!' : 'Agregar a mi pedido'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
