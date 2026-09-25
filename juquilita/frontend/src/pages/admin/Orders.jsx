import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

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
  pickup: 'Recoger',
  delivery: 'Entrega',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => { loadOrders(); }, []);

  function loadOrders() {
    api.getOrders().then(setOrders).catch(() => {});
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Pedidos</h1>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Folio</th><th>Cliente</th><th>Teléfono</th><th>Total</th><th>Entrega</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>Sin pedidos</td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td><Link to={`/admin/pedidos/${o.id}`} style={{ color: 'var(--terracotta)', fontWeight: 600 }}>{o.folio}</Link></td>
                  <td>{o.customer_name}</td>
                  <td>{o.customer_phone}</td>
                  <td>${Number(o.total).toFixed(2)}</td>
                  <td>{DELIVERY_LABELS[o.delivery_type]}</td>
                  <td><span className={`badge ${STATUS_BADGE[o.status]}`}>{STATUS_LABELS[o.status]}</span></td>
                  <td>{new Date(o.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
