import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems, getTotal, clearCart } from '../services/cart';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Confirm({ cartCount, onCartChange }) {
  const navigate = useNavigate();
  const items = getItems();
  const total = getTotal();

  const [deliveryType, setDeliveryType] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('pay_on_pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [references, setReferences] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/pedido');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Nombre y teléfono son requeridos.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setError('La dirección es requerida para entrega a domicilio.');
      return;
    }

    setLoading(true);
    try {
      const order = await api.createOrder({
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_type: deliveryType,
        address: address.trim() || undefined,
        references: references.trim() || undefined,
        payment_method: paymentMethod,
      });
      clearCart();
      onCartChange();
      navigate(`/pedido-confirmado/${order.folio}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container" style={{ maxWidth: '600px' }}>
        <section className="page-section">
          <h2>Confirma tu pedido</h2>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            {items.map(item => (
              <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                <span>{item.quantity} × {item.name}</span>
                <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', fontWeight: 700, fontSize: '1.125rem' }}>
              <span>Total</span>
              <span>${total.toFixed(2)} MXN</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}

            <div className="confirm-section">
              <h3>¿Cómo quieres recibirlo?</h3>
              <div className="radio-group">
                <label className={`radio-option ${deliveryType === 'pickup' ? 'selected' : ''}`}>
                  <input type="radio" name="delivery" value="pickup" checked={deliveryType === 'pickup'} onChange={() => setDeliveryType('pickup')} />
                  <span>Recoger en Juquilita</span>
                </label>
                <label className={`radio-option ${deliveryType === 'delivery' ? 'selected' : ''}`}>
                  <input type="radio" name="delivery" value="delivery" checked={deliveryType === 'delivery'} onChange={() => setDeliveryType('delivery')} />
                  <span>Entrega a domicilio</span>
                </label>
              </div>
            </div>

            <div className="confirm-section">
              <h3>Tus datos</h3>
              <div className="input-group">
                <label>Nombre</label>
                <input className="input" type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Tu nombre" />
              </div>
              <div className="input-group">
                <label>Teléfono</label>
                <input className="input" type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="55 1234 5678" />
              </div>
              {deliveryType === 'delivery' && (
                <>
                  <div className="input-group">
                    <label>Dirección</label>
                    <input className="input" type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Calle, número, colonia" />
                  </div>
                  <div className="input-group">
                    <label>Referencias</label>
                    <textarea className="input" value={references} onChange={e => setReferences(e.target.value)} placeholder="Entre calles, color de la casa…" />
                  </div>
                </>
              )}
            </div>

            <div className="confirm-section">
              <h3>¿Cómo quieres pagar?</h3>
              <div className="radio-group">
                <label className={`radio-option ${paymentMethod === 'pay_on_pickup' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="pay_on_pickup" checked={paymentMethod === 'pay_on_pickup'} onChange={() => setPaymentMethod('pay_on_pickup')} />
                  <span>Pago al recoger</span>
                </label>
                <label className={`radio-option ${paymentMethod === 'pay_on_delivery' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="pay_on_delivery" checked={paymentMethod === 'pay_on_delivery'} onChange={() => setPaymentMethod('pay_on_delivery')} />
                  <span>Pago al recibir</span>
                </label>
              </div>
            </div>

            <div style={{ padding: '1rem 0', fontSize: '1.25rem', fontWeight: 700, textAlign: 'right' }}>
              Total: ${total.toFixed(2)} MXN
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? 'Procesando…' : 'Confirmar pedido'}
            </button>
          </form>
        </section>
      </div>
      <Footer />
    </>
  );
}
