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

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) return <AdminLayout><p>Cargando...</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Resumen</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Productos</div>
          <div className="stat-value">{data.total_products}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pedidos nuevos</div>
          <div className="stat-value">{data.new_orders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Stock bajo</div>
          <div className="stat-value">{data.low_stock}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pedidos de hoy</div>
          <div className="stat-value">${Number(data.today_total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Pedidos recientes</h3>
          {data.recent_orders.length === 0 ? (
            <p style={{ color: 'var(--gray-400)' }}>Sin pedidos aún</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_orders.map(order => (
                    <tr key={order.id}>
                      <td><Link to={`/admin/pedidos/${order.id}`} style={{ color: 'var(--terracotta)', fontWeight: 600 }}>{order.folio}</Link></td>
                      <td>{order.customer_name}</td>
                      <td>${Number(order.total).toFixed(2)}</td>
                      <td><span className={`badge ${STATUS_BADGE[order.status]}`}>{STATUS_LABELS[order.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Productos con poco stock</h3>
          {data.low_stock_products.length === 0 ? (
            <p style={{ color: 'var(--gray-400)' }}>Todo en orden</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Mínimo</th>
                  </tr>
                </thead>
                <tbody>
                  {data.low_stock_products.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td style={{ fontWeight: 600, color: p.stock === 0 ? 'var(--terracotta)' : 'var(--yellow)' }}>{p.stock}</td>
                      <td>{p.minimum_stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
