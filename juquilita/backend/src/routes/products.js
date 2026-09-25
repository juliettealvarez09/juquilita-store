const express = require('express');
const db = require('../database/db');
const { authMiddleware } = require('../services/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = true
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      query += ` AND (
        p.name ILIKE $${i} OR
        p.brand ILIKE $${i} OR
        p.description ILIKE $${i} OR
        c.name ILIKE $${i}
      )`;
    }

    if (category) {
      params.push(category);
      query += ` AND p.category_id = $${params.length}`;
    }

    query += ' ORDER BY p.name';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      query += ` AND (p.name ILIKE $${i} OR p.brand ILIKE $${i})`;
    }

    query += ' ORDER BY p.name';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, brand, description, price, cost, stock, minimum_stock, unit, image_url, category_id } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }
    const result = await db.query(
      `INSERT INTO products (name, brand, description, price, cost, stock, minimum_stock, unit, image_url, category_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, brand, description, price, cost || 0, stock || 0, minimum_stock || 5, unit || 'pieza', image_url, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, brand, description, price, cost, minimum_stock, unit, image_url, category_id, active } = req.body;
    const result = await db.query(
      `UPDATE products SET
        name = COALESCE($1, name),
        brand = COALESCE($2, brand),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        cost = COALESCE($5, cost),
        minimum_stock = COALESCE($6, minimum_stock),
        unit = COALESCE($7, unit),
        image_url = COALESCE($8, image_url),
        category_id = COALESCE($9, category_id),
        active = COALESCE($10, active),
        updated_at = NOW()
       WHERE id = $11 RETURNING *`,
      [name, brand, description, price, cost, minimum_stock, unit, image_url, category_id, active, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

module.exports = router;
