import type { OrderFormData } from "@/types/order";

export function buildWhatsAppMessage(data: OrderFormData): string {
  const modelName = data.model === "black-dragon" ? "Black Dragon" : "White Dragon";
  const lines = [
    `🗡️ *New Order — Nakama Store Morocco*`,
    ``,
    `*Model:* ${modelName}`,
    `*Name:* ${data.fullName}`,
    `*Phone:* ${data.phone}`,
    data.email ? `*Email:* ${data.email}` : null,
    `*City:* ${data.city}`,
    `*Address:* ${data.address}`,
    data.notes ? `*Notes:* ${data.notes}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function getWhatsAppLink(data: OrderFormData, number: string): string {
  const message = buildWhatsAppMessage(data);
  const encoded = encodeURIComponent(message);
  const clean = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encoded}`;
}
