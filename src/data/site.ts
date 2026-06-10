export const site = {
  name: "Nakama Store Morocco",
  nameShort: "Nakama",
  tagline: "Decorative wooden katanas inspired by Japanese legends.",
  description:
    "Made for collectors, anime lovers, gaming setups, and premium room decoration. Free delivery across Morocco. For decoration only.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212XXXXXXXXX",
  instagram: "https://www.instagram.com/nakama_store_morocco",
  trustBadges: [
    { icon: "truck", label: "Free delivery across Morocco" },
    { icon: "shield", label: "Decorative wooden katana" },
    { icon: "credit-card-off", label: "No online payment required" },
    { icon: "phone", label: "Order confirmation by contact" },
    { icon: "info", label: "For decoration only" },
  ],
};
