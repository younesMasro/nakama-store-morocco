import nodemailer from "nodemailer";

export interface OrderNotificationData {
  orderId:    string | number;
  fullName:   string;
  phone:      string;
  city:       string;
  address:    string;
  blackQty:   number;
  whiteQty:   number;
  hasBundle:  boolean;
  accessories: { name: string; quantity: number }[];
}

/* ── Gmail ─────────────────────────────────────────────────── */

function buildEmailHtml(d: OrderNotificationData): string {
  const rows: string[] = [];

  if (d.blackQty > 0) rows.push(`<tr><td>Black Dragon</td><td>${d.blackQty}</td></tr>`);
  if (d.whiteQty > 0) rows.push(`<tr><td>White Dragon</td><td>${d.whiteQty}</td></tr>`);
  for (const acc of d.accessories) {
    if (acc.quantity > 0) rows.push(`<tr><td>${acc.name}</td><td>${acc.quantity}</td></tr>`);
  }
  if (d.hasBundle) rows.push(`<tr><td>🎁 Free Gift (Double Stand)</td><td>1</td></tr>`);

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#222">
  <h2 style="color:#b99a5b;border-bottom:2px solid #b99a5b;padding-bottom:8px">
    🗡️ New Order — Nakama Store Morocco
  </h2>
  <p><strong>Order ID:</strong> ${d.orderId}</p>
  <h3 style="margin-top:20px">Customer</h3>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:4px 0;color:#555;width:120px">Name</td><td><strong>${d.fullName}</strong></td></tr>
    <tr><td style="padding:4px 0;color:#555">Phone</td><td><strong>${d.phone}</strong></td></tr>
    <tr><td style="padding:4px 0;color:#555">City</td><td>${d.city}</td></tr>
    <tr><td style="padding:4px 0;color:#555">Address</td><td>${d.address}</td></tr>
  </table>
  <h3 style="margin-top:20px">Items Ordered</h3>
  <table style="width:100%;border-collapse:collapse;border:1px solid #eee">
    <thead>
      <tr style="background:#f5f5f5">
        <th style="padding:8px;text-align:left;border-bottom:1px solid #eee">Product</th>
        <th style="padding:8px;text-align:left;border-bottom:1px solid #eee">Qty</th>
      </tr>
    </thead>
    <tbody>${rows.join("")}</tbody>
  </table>
  <p style="margin-top:24px;font-size:13px;color:#888">
    Delivery: 24H–48H · Free delivery · Cash on delivery<br>
    Call the customer to confirm the order.
  </p>
</body>
</html>`;
}

export async function sendOrderEmail(data: OrderNotificationData): Promise<void> {
  const user     = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  const to       = process.env.ORDER_RECEIVER_EMAIL;

  if (!user || !password || !to) {
    console.warn("[Nakama] Email not sent — GMAIL_USER / GMAIL_APP_PASSWORD / ORDER_RECEIVER_EMAIL missing.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: password },
  });

  const subject = `🗡️ New Order #${data.orderId} — ${data.fullName} (${data.city})`;

  await transporter.sendMail({
    from:    `"Nakama Store" <${user}>`,
    to,
    subject,
    html:    buildEmailHtml(data),
    text:    `New order #${data.orderId}\nName: ${data.fullName}\nPhone: ${data.phone}\nCity: ${data.city}\nAddress: ${data.address}`,
  });
}

/* ── WhatsApp via CallMeBot ────────────────────────────────── */

export async function sendWhatsAppNotification(data: OrderNotificationData): Promise<void> {
  const phone  = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey) {
    console.warn("[Nakama] WhatsApp not sent — CALLMEBOT_PHONE / CALLMEBOT_API_KEY missing.");
    return;
  }

  const lines: string[] = [
    `🗡️ New Order #${data.orderId} — Nakama Store`,
    ``,
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `City: ${data.city}`,
    `Address: ${data.address}`,
    ``,
  ];

  if (data.blackQty > 0) lines.push(`• Black Dragon x${data.blackQty}`);
  if (data.whiteQty > 0) lines.push(`• White Dragon x${data.whiteQty}`);
  for (const acc of data.accessories) {
    if (acc.quantity > 0) lines.push(`• ${acc.name} x${acc.quantity}`);
  }
  if (data.hasBundle) lines.push(`• 🎁 Free Gift (Double Stand) x1`);

  lines.push(``, `Call customer to confirm. Free delivery. COD.`);

  const text = encodeURIComponent(lines.join("\n"));
  const url  = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("[Nakama] CallMeBot error:", res.status, await res.text());
  }
}
