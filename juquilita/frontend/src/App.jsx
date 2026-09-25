import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCount } from './services/cart';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Order from './pages/Order';
import Confirm from './pages/Confirm';
import OrderSuccess from './pages/OrderSuccess';
import OrderLookup from './pages/OrderLookup';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import AdminOrderDetail from './pages/admin/OrderDetail';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  const [cartCount, setCartCount] = useState(getCount());

  const refreshCart = useCallback(() => {
    setCartCount(getCount());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home cartCount={cartCount} />} />
        <Route path="/tienda" element={<Shop cartCount={cartCount} onCartChange={refreshCart} />} />
        <Route path="/producto/:id" element={<ProductDetail cartCount={cartCount} onCartChange={refreshCart} />} />
        <Route path="/pedido" element={<Order cartCount={cartCount} onCartChange={refreshCart} />} />
        <Route path="/confirmar" element={<Confirm cartCount={cartCount} onCartChange={refreshCart} />} />
        <Route path="/pedido-confirmado/:folio" element={<OrderSuccess cartCount={cartCount} />} />
        <Route path="/pedido/:folio" element={<OrderLookup cartCount={cartCount} />} />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/productos" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/admin/inventario" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/admin/pedidos" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/admin/pedidos/:id" element={<ProtectedRoute><AdminOrderDetail /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
