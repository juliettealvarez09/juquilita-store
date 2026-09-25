const express = require('express');
const db = require('../database/db');
const { authMiddleware } = require('../services/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nombre es requerido' });
    const result = await db.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

module.exports = router;
