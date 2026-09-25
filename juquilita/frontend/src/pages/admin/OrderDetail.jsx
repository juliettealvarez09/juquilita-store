import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  pickup: 'Recoger en Juquilita',
  delivery: 'Entrega a domicilio',
};

const PAYMENT_LABELS = {
  pay_on_pickup: 'Pago al recoger',
  pay_on_delivery: 'Pago al recibir',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.getOrder(id).then(setOrder).catch(() => {});
  }, [id]);

  async function changeStatus(status) {
    if (status === 'CANCELLED' && !window.confirm('¿Cancelar este pedido? Se devolverá el inventario.')) return;
    setUpdating(true);
    try {
      const updated = await api.updateOrderStatus(id, status);
      setOrder(prev => ({ ...prev, ...updated }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  }

  if (!order) return <AdminLayout><p>Cargando...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Pedido {order.folio}</h1>
        <span className={`badge ${STATUS_BADGE[order.status]}`}>{STATUS_LABELS[order.status]}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Datos del cliente</h3>
          <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9375rem' }}>
            <div><strong>Nombre:</strong> {order.customer_name}</div>
            <div><strong>Teléfono:</strong> {order.customer_phone}</div>
            <div><strong>Entrega:</strong> {DELIVERY_LABELS[order.delivery_type]}</div>
            {order.address && <div><strong>Dirección:</strong> {order.address}</div>}
            {order.references && <div><strong>Referencias:</strong> {order.references}</div>}
            <div><strong>Pago:</strong> {PAYMENT_LABELS[order.payment_method]}</div>
            <div><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Cambiar estado</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['RECEIVED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map(status => (
              <button
                key={status}
                className={`btn btn-sm ${order.status === status ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => changeStatus(status)}
                disabled={updating || order.status === status}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Productos</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.unit_price).toFixed(2)}</td>
                  <td style={{ fontWeight: 600 }}>${Number(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'right', padding: '1rem 0', fontWeight: 700, fontSize: '1.25rem' }}>
          Total: ${Number(order.total).toFixed(2)} MXN
        </div>
      </div>
    </AdminLayout>
  );
}
