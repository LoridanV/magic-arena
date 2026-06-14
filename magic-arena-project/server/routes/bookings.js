const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('./auth');
const nodemailer = require('nodemailer');
const router = express.Router();

// ── Nodemailer transporter ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendBookingNotification({ name, phone, team, booking_date, start_time, end_time, total_price, notes }) {
  const hours = (new Date(`1970-01-01T${end_time}`) - new Date(`1970-01-01T${start_time}`)) / 3600000;

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden">
      <div style="background:#16a34a;padding:24px 32px">
        <h1 style="margin:0;font-size:22px;font-weight:700">⚽ Rezervare nouă — MAGIC Alexandru</h1>
      </div>
      <div style="padding:32px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px;width:140px">👤 Contact</td><td style="padding:10px 0;font-weight:600">${name || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px">📞 Telefon</td><td style="padding:10px 0;font-weight:600">${phone || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px">🏟️ Echipă</td><td style="padding:10px 0;font-weight:600">${team || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px">📅 Data</td><td style="padding:10px 0;font-weight:600">${booking_date}</td></tr>
          <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px">🕐 Interval</td><td style="padding:10px 0;font-weight:600">${start_time} – ${end_time} (${hours}h)</td></tr>
          <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px">💬 Note</td><td style="padding:10px 0">${notes || '—'}</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px 20px;background:#16a34a22;border:1px solid #16a34a55;border-radius:12px;display:flex;justify-content:space-between;align-items:center">
          <span style="color:#9ca3af;font-size:14px">Total de plătit la sosire</span>
          <span style="font-size:28px;font-weight:700;color:#4ade80">${total_price} RON</span>
        </div>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #1f2937;font-size:12px;color:#4b5563">
        MAGIC Alexandru · Str. Alexandru cel Bun 24, Iași
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"MAGIC Alexandru" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `⚽ Rezervare nouă – ${booking_date} ${start_time} (${team || name})`,
    html,
  });
}

// Rezervările utilizatorului curent
router.get('/mine', authMiddleware, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, f.name AS field_name, l.name AS location_name
     FROM bookings b
     JOIN fields f ON b.field_id = f.id
     JOIN locations l ON f.location_id = l.id
     WHERE b.user_id = ?
     ORDER BY b.booking_date DESC, b.start_time DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// Sloturi ocupate pentru un teren într-o zi
router.get('/slots', async (req, res) => {
  const { field_id, date } = req.query;
  const [rows] = await pool.query(
    'SELECT start_time, end_time FROM bookings WHERE field_id = ? AND booking_date = ? AND status != "cancelled"',
    [field_id, date]
  );
  res.json(rows);
});

// Creează rezervare
router.post('/', async (req, res) => {
  try {
    const { field_id, booking_date, start_time, end_time, notes, name, phone, team } = req.body;
    const [fieldRows] = await pool.query('SELECT price_per_hour FROM fields WHERE id = ?', [field_id]);
    if (fieldRows.length === 0) return res.status(404).json({ error: 'Teren inexistent' });

    const hours = (new Date(`1970-01-01T${end_time}`) - new Date(`1970-01-01T${start_time}`)) / 3600000;
    const total_price = fieldRows[0].price_per_hour * hours;

    // Salvăm în DB (user_id opțional dacă nu e logat)
    const user_id = req.user?.id ?? null;
    const [result] = await pool.query(
      `INSERT INTO bookings (user_id, field_id, booking_date, start_time, end_time, total_price, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, field_id, booking_date, start_time, end_time, total_price, notes || null]
    );

    // Trimitem email de notificare (fără să blocăm răspunsul)
    sendBookingNotification({ name, phone, team, booking_date, start_time, end_time, total_price, notes })
      .catch(err => console.error('❌ Email notificare eșuat:', err.message));

    res.json({ id: result.insertId, total_price });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Slot deja rezervat' });
    res.status(500).json({ error: err.message });
  }
});

// Anulează
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  await pool.query(
    'UPDATE bookings SET status = "cancelled" WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  res.json({ ok: true });
});

module.exports = router;