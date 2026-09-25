const express = require('express');
const db = require('../database/db');
const { authMiddleware } = require('../services/auth');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [products, newOrders, lowStock, todayTotal, recentOrders, lowStockProducts] = await Promise.all([
      db.query('SELECT COUNT(*) FROM products WHERE active = true'),
      db.query("SELECT COUNT(*) FROM orders WHERE status = 'RECEIVED'"),
      db.query('SELECT COUNT(*) FROM products WHERE stock <= minimum_stock AND active = true'),
      db.query("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status != 'CANCELLED'"),
      db.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5"),
      db.query("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.stock <= p.minimum_stock AND p.active = true ORDER BY p.stock ASC LIMIT 10"),
    ]);

    res.json({
      total_products: parseInt(products.rows[0].count),
      new_orders: parseInt(newOrders.rows[0].count),
      low_stock: parseInt(lowStock.rows[0].count),
      today_total: parseFloat(todayTotal.rows[0].total),
      recent_orders: recentOrders.rows,
      low_stock_products: lowStockProducts.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener dashboard' });
  }
});

module.exports = router;
