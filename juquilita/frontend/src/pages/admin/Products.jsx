import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

function getStockStatus(stock, min) {
  if (stock === 0) return { text: 'Agotado', cls: 'badge-out' };
  if (stock <= min) return { text: 'Bajo', cls: 'badge-low' };
  return { text: 'OK', cls: 'badge-available' };
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', brand: '', category_id: '', description: '', price: '', cost: '',
    stock: '', minimum_stock: '5', unit: 'pieza', image_url: '', active: true,
  });

  useEffect(() => {
    loadProducts();
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  function loadProducts() {
    api.getAllProducts(search).then(setProducts).catch(() => {});
  }

  useEffect(() => { loadProducts(); }, [search]);

  function openNew() {
    setEditingProduct(null);
    setForm({ name: '', brand: '', category_id: '', description: '', price: '', cost: '', stock: '', minimum_stock: '5', unit: 'pieza', image_url: '', active: true });
    setShowForm(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setForm({
      name: product.name, brand: product.brand || '', category_id: product.category_id || '',
      description: product.description || '', price: product.price, cost: product.cost || '',
      stock: product.stock, minimum_stock: product.minimum_stock, unit: product.unit || 'pieza',
      image_url: product.image_url || '', active: product.active,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        cost: form.cost ? parseFloat(form.cost) : 0,
        minimum_stock: parseInt(form.minimum_stock) || 5,
        category_id: form.category_id ? parseInt(form.category_id) : null,
      };
      if (editingProduct) {
        delete data.stock;
        await api.updateProduct(editingProduct.id, data);
      } else {
        data.stock = parseInt(form.stock) || 0;
        await api.createProduct(data);
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  }

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Productos</h1>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Nuevo producto</button>
      </div>

      <div className="search-bar">
        <input className="input" placeholder="Buscar producto…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {products.map(p => {
                const status = getStockStatus(p.stock, p.minimum_stock);
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>{p.brand}</div>
                    </td>
                    <td>{p.category_name || '—'}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td><span className={`badge ${status.cls}`}>{status.text}</span></td>
                    <td><button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Editar</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Nombre</label>
                <input className="input" value={form.name} onChange={e => updateField('name', e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Marca</label>
                <input className="input" value={form.brand} onChange={e => updateField('brand', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Categoría</label>
                <select className="input" value={form.category_id} onChange={e => updateField('category_id', e.target.value)}>
                  <option value="">Sin categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Descripción</label>
                <textarea className="input" value={form.description} onChange={e => updateField('description', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group">
                  <label>Precio</label>
                  <input className="input" type="number" step="0.01" value={form.price} onChange={e => updateField('price', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Costo</label>
                  <input className="input" type="number" step="0.01" value={form.cost} onChange={e => updateField('cost', e.target.value)} />
                </div>
              </div>
              {!editingProduct && (
                <div className="input-group">
                  <label>Stock inicial</label>
                  <input className="input" type="number" value={form.stock} onChange={e => updateField('stock', e.target.value)} />
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group">
                  <label>Stock mínimo</label>
                  <input className="input" type="number" value={form.minimum_stock} onChange={e => updateField('minimum_stock', e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Unidad</label>
                  <input className="input" value={form.unit} onChange={e => updateField('unit', e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>URL de imagen</label>
                <input className="input" value={form.image_url} onChange={e => updateField('image_url', e.target.value)} placeholder="https://..." />
              </div>
              {editingProduct && (
                <div className="input-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={form.active} onChange={e => updateField('active', e.target.checked)} />
                    Producto activo
                  </label>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm">Guardar producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
