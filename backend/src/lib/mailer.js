const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function formatPrice(price) {
  return new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(price);
}

function formatDate(date) {
  if (!date) return 'Уточняется';
  return new Date(date).toLocaleString('ru-KZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function sendTicketEmail({ to, userName, order, event, items }) {
  const seatsHtml = items.map(item => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #1f1f35;color:#a78bfa;font-weight:600;">
        Ряд ${item.seat?.row || '—'}, Место ${item.seat?.number || '—'}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #1f1f35;color:#6ee7b7;font-weight:600;text-align:right;">
        ${formatPrice(item.price || item.seat?.price || 0)}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #1f1f35;color:#94a3b8;font-family:monospace;font-size:12px;">
        ${(item.ticketCode || item.ticket_code || '').slice(0, 8).toUpperCase()}
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080810;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#8B5CF6,#EC4899);padding:12px 24px;border-radius:16px;margin-bottom:16px;">
        <span style="font-size:24px;">🎟️</span>
        <span style="color:white;font-size:22px;font-weight:900;letter-spacing:-0.5px;">TicketHub</span>
      </div>
      <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0 0 8px;">Ваши билеты готовы!</h1>
      <p style="color:#94a3b8;font-size:16px;margin:0;">Привет, ${userName}! Оплата прошла успешно 🎉</p>
    </div>

    <!-- Event card -->
    <div style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1));border:1px solid rgba(139,92,246,0.3);border-radius:20px;padding:24px;margin-bottom:24px;">
      <div style="display:flex;gap:16px;align-items:flex-start;">
        ${event?.poster ? `<img src="${event.poster}" alt="" style="width:80px;height:80px;border-radius:12px;object-fit:cover;flex-shrink:0;">` : ''}
        <div>
          <h2 style="color:#ffffff;font-size:20px;font-weight:800;margin:0 0 8px;">${event?.title || 'Событие'}</h2>
          <p style="color:#a78bfa;margin:0 0 4px;font-size:14px;">📅 ${formatDate(event?.start_date || event?.startDate)}</p>
          <p style="color:#94a3b8;margin:0;font-size:14px;">📍 ${event?.venue?.name || ''}, ${event?.venue?.city || ''}</p>
        </div>
      </div>
    </div>

    <!-- Seats table -->
    <div style="background:#0f0f1a;border:1px solid #1f1f35;border-radius:16px;overflow:hidden;margin-bottom:24px;">
      <div style="padding:16px 20px;border-bottom:1px solid #1f1f35;background:rgba(139,92,246,0.1);">
        <h3 style="color:#ffffff;margin:0;font-size:16px;font-weight:700;">🎫 Ваши места</h3>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#0a0a14;">
            <th style="padding:10px 16px;text-align:left;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Место</th>
            <th style="padding:10px 16px;text-align:right;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Цена</th>
            <th style="padding:10px 16px;text-align:left;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Код</th>
          </tr>
        </thead>
        <tbody>${seatsHtml}</tbody>
      </table>
      <div style="padding:16px 20px;border-top:1px solid #1f1f35;display:flex;justify-content:space-between;align-items:center;">
        <span style="color:#94a3b8;font-size:14px;">Итого</span>
        <span style="color:#a78bfa;font-size:22px;font-weight:900;">${formatPrice(order.total_amount || order.totalAmount || 0)}</span>
      </div>
    </div>

    <!-- QR code -->
    ${order.qr_code || order.qrCode ? `
    <div style="text-align:center;background:#0f0f1a;border:1px solid #1f1f35;border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#94a3b8;margin:0 0 16px;font-size:14px;">Покажите QR-код на входе</p>
      <img src="${order.qr_code || order.qrCode}" alt="QR" style="width:160px;height:160px;background:white;padding:8px;border-radius:12px;">
    </div>` : ''}

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f1f35;">
      <p style="color:#475569;font-size:13px;margin:0 0 8px;">Заказ #${(order.id || '').slice(0, 8).toUpperCase()}</p>
      <p style="color:#334155;font-size:12px;margin:0;">© 2025 TicketHub · Казахстан · <a href="mailto:support@tickethub.kz" style="color:#8B5CF6;">support@tickethub.kz</a></p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"TicketHub" <noreply@tickethub.kz>',
      to,
      subject: `🎟️ Ваши билеты на "${event?.title || 'событие'}" — TicketHub`,
      html,
    });
    console.log(`✉️  Ticket email sent to ${to}`);
  } catch (err) {
    console.error('Email send error:', err.message);
    // Don't throw — email failure shouldn't break order
  }
}

module.exports = { sendTicketEmail };
