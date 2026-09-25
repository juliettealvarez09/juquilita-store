const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const inventoryRoutes = require('./routes/inventory');
const orderRoutes = require('./routes/orders');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
