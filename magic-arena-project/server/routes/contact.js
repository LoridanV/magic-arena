const express = require('express');
const pool = require('../db');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    // Salvează în DB
    await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || null, message]
    );

    // Trimite email notificare
    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:16px;overflow:hidden">
        <div style="background:#16a34a;padding:24px 32px">
          <h1 style="margin:0;font-size:22px;font-weight:700">✉️ Mesaj nou — MAGIC Alexandru</h1>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px;width:120px">👤 Nume</td><td style="padding:10px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px">📧 Email</td><td style="padding:10px 0;font-weight:600">${email}</td></tr>
            <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px">📞 Telefon</td><td style="padding:10px 0">${phone || '—'}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px 20px;background:#1f2937;border-radius:12px;line-height:1.6">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #1f2937;font-size:12px;color:#4b5563">
          MAGIC Alexandru · Str. Alexandru cel Bun 24, Iași
        </div>
      </div>
    `;

    transporter.sendMail({
      from: `"MAGIC Alexandru" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `✉️ Mesaj nou de la ${name}`,
      html,
    }).catch(err => console.error('❌ Email contact eșuat:', err.message));

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;