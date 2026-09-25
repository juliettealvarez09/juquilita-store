import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const DELIVERY_LABELS = {
  pickup: 'Recoger en Juquilita',
  delivery: 'Entrega a domicilio',
};

export default function OrderSuccess({ cartCount }) {
  const { folio } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.getOrderByFolio(folio).then(setOrder).catch(() => {});
  }, [folio]);

  if (!order) return <><Navbar cartCount={cartCount} /><div className="container" style={{padding: '3rem', textAlign: 'center'}}>Cargando...</div></>;

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container">
        <div className="success-page">
          <h1>¡Listo!</h1>
          <p className="success-subtitle">Recibimos tu pedido.</p>
          <div className="success-detail">
            <div className="row"><span className="label">Pedido</span><span className="value">{order.folio}</span></div>
            <div className="row"><span className="label">Total</span><span className="value">${Number(order.total).toFixed(2)} MXN</span></div>
            <div className="row"><span className="label">Entrega</span><span className="value">{DELIVERY_LABELS[order.delivery_type]}</span></div>
            <div className="row"><span className="label">Estado</span><span className="value">{STATUS_LABELS[order.status]}</span></div>
          </div>
          <p style={{ marginTop: '2rem', color: 'var(--gray-500)' }}>Juquilita preparará tu pedido.</p>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Volver al inicio</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
