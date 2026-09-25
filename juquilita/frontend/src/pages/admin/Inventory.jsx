import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

function getStockStatus(stock, min) {
  if (stock === 0) return { text: 'Agotado', cls: 'badge-out' };
  if (stock <= min) return { text: 'Bajo', cls: 'badge-low' };
  return { text: 'OK', cls: 'badge-available' };
}

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  function loadProducts() {
    api.getAllProducts().then(setProducts).catch(() => {});
  }

  function openModal(product, type) {
    setModal({ product, type });
    setQuantity('');
    setNotes('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) return;

    setLoading(true);
    try {
      const data = { product_id: modal.product.id, quantity: qty, notes };
      if (modal.type === 'entry') {
        await api.inventoryEntry(data);
      } else {
        await api.inventoryExit(data);
      }
      setModal(null);
      loadProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const newStock = modal
    ? modal.type === 'entry'
      ? modal.product.stock + (parseInt(quantity) || 0)
      : modal.product.stock - (parseInt(quantity) || 0)
    : 0;

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Inventario</h1>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Producto</th><th>Existencia</th><th>Stock mínimo</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {products.map(p => {
                const status = getStockStatus(p.stock, p.minimum_stock);
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.stock} {p.unit}</td>
                    <td>{p.minimum_stock}</td>
                    <td><span className={`badge ${status.cls}`}>{status.text}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openModal(p, 'entry')}>Entrada</button>
                        <button className="btn btn-outline btn-sm" onClick={() => openModal(p, 'exit')}>Salida</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Registrar {modal.type === 'entry' ? 'entrada' : 'salida'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontWeight: 600 }}>{modal.product.name}</div>
                <div style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Stock actual: {modal.product.stock} {modal.product.unit}</div>
              </div>
              <div className="input-group">
                <label>Cantidad</label>
                <input className="input" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Notas</label>
                <textarea className="input" value={notes} onChange={e => setNotes(e.target.value)} placeholder={modal.type === 'entry' ? 'Compra de mercancía' : 'Motivo de la salida'} />
              </div>
              {parseInt(quantity) > 0 && (
                <div style={{ padding: '0.75rem 1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--gray-400)' }}>Nuevo stock: </span>
                  <span style={{ fontWeight: 700 }}>{newStock}</span>
                </div>
              )}
              {modal.type === 'exit' && parseInt(quantity) > modal.product.stock && (
                <div className="error-msg">No hay suficiente stock</div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancelar</button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={loading || (modal.type === 'exit' && parseInt(quantity) > modal.product.stock)}
                >
                  Registrar {modal.type === 'entry' ? 'entrada' : 'salida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
