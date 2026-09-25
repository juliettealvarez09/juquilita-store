import { useNavigate } from 'react-router-dom';
import { getItems, updateQuantity, removeItem, getTotal } from '../services/cart';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuantitySelector from '../components/QuantitySelector';

export default function Order({ cartCount, onCartChange }) {
  const navigate = useNavigate();
  const items = getItems();
  const total = getTotal();

  function handleQuantity(productId, qty) {
    updateQuantity(productId, qty);
    onCartChange();
  }

  function handleRemove(productId) {
    removeItem(productId);
    onCartChange();
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container">
        <section className="page-section">
          <h2>Mi pedido</h2>
          {items.length === 0 ? (
            <div className="empty-state">
              <h3>Tu pedido está vacío</h3>
              <p>Busca productos y agrégalos a tu pedido.</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/tienda')}>
                Ver productos
              </button>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.product_id} className="order-item">
                  <div className="order-item-info">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-price">${Number(item.price).toFixed(2)} por {item.unit}</div>
                  </div>
                  <div className="order-item-actions">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={qty => handleQuantity(item.product_id, qty)}
                      max={item.stock}
                    />
                    <div className="order-item-subtotal">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item.product_id)}>Eliminar</button>
                </div>
              ))}
              <div className="order-total">
                <span>Total</span>
                <span>${total.toFixed(2)} MXN</span>
              </div>
              <button className="btn btn-primary btn-block" onClick={() => navigate('/confirmar')}>
                Continuar
              </button>
            </>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
