const express = require('express');
const pool = require('../db');
const router = express.Router();

// Toate locațiile + terenurile
router.get('/', async (req, res) => {
  const [locations] = await pool.query('SELECT * FROM locations WHERE active = TRUE');
  const [fields] = await pool.query('SELECT * FROM fields WHERE active = TRUE');
  const result = locations.map(loc => ({
    ...loc,
    fields: fields.filter(f => f.location_id === loc.id),
  }));
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Locație negăsită' });
  res.json(rows[0]);
});

module.exports = router;
