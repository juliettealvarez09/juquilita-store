import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STATUS_LABELS = {
  RECEIVED: 'Recibido',
  PREPARING: 'Preparando',
  READY: 'Listo',
  COMPLETED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const STATUS_BADGE = {
  RECEIVED: 'badge-received',
  PREPARING: 'badge-preparing',
  READY: 'badge-ready',
  COMPLETED: 'badge-completed',
  CANCELLED: 'badge-cancelled',
};

const DELIVERY_LABELS = {
  pickup: 'Recoger en Juquilita',
  delivery: 'Entrega a domicilio',
};

export default function OrderLookup({ cartCount }) {
  const { folio } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getOrderByFolio(folio).then(setOrder).catch(err => setError(err.message));
  }, [folio]);

  if (error) return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Pedido no encontrado</h2>
        <p style={{ color: 'var(--gray-500)' }}>Verifica tu número de folio.</p>
      </div>
    </>
  );

  if (!order) return <><Navbar cartCount={cartCount} /><div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Cargando...</div></>;

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container" style={{ maxWidth: '600px' }}>
        <section className="page-section">
          <h2>Pedido {order.folio}</h2>
          <div className="card">
            <div style={{ marginBottom: '1rem' }}>
              <span className={`badge ${STATUS_BADGE[order.status]}`}>{STATUS_LABELS[order.status]}</span>
            </div>
            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9375rem' }}>
              <div><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div><strong>Cliente:</strong> {order.customer_name}</div>
              <div><strong>Entrega:</strong> {DELIVERY_LABELS[order.delivery_type]}</div>
              {order.address && <div><strong>Dirección:</strong> {order.address}</div>}
            </div>
            <hr className="section-divider" />
            {order.items?.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span>{item.quantity} × {item.product_name}</span>
                <span style={{ fontWeight: 600 }}>${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
            <hr className="section-divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem' }}>
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)} MXN</span>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
