const API = 'http://localhost:3001/api';

function headers() {
  const h = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, { headers: headers(), ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error de servidor');
  return data;
}

export const api = {
  login: (email, password) => request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getProducts: (search, category) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    return request(`/products?${params}`);
  },
  getAllProducts: (search) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/products/all${params}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getCategories: () => request('/categories'),
  createCategory: (name) => request('/categories', { method: 'POST', body: JSON.stringify({ name }) }),

  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => request('/orders'),
  getOrder: (id) => request(`/orders/${id}`),
  getOrderByFolio: (folio) => request(`/orders/folio/${folio}`),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  inventoryEntry: (data) => request('/inventory/entry', { method: 'POST', body: JSON.stringify(data) }),
  inventoryExit: (data) => request('/inventory/exit', { method: 'POST', body: JSON.stringify(data) }),
  getMovements: () => request('/inventory/movements'),

  getDashboard: () => request('/dashboard'),
};
