export const products = {
  "black-dragon": {
    id: "black-dragon",
    name: "Black Dragon",
    nameJa: "黒い龍",
    tagline: "POWER · MYSTERY · SHADOW",
    description:
      "Born from darkness and forged in shadow. The Black Dragon is a statement piece for collectors and dreamers who command presence in every room.",
    theme: "dark",
    accentColor: "#C9A94B",
    images: {
      fullView: [
        "/images/products/black-dragon/full-view-1.png",
        "/images/products/black-dragon/full-view-2.png",
        "/images/products/black-dragon/full-view-3.png",
        "/images/products/black-dragon/full-view-4.png",
      ],
    },
    parts: [
      {
        id: "handle",
        label: "Handle",
        labelJa: "柄",
        image: "/images/parts/handle.png",
        description: "Hand-wrapped in premium black cord for an authentic samurai grip feel.",
      },
      {
        id: "tsuba",
        label: "Tsuba",
        labelJa: "鍔",
        image: "/images/parts/handle.png",
        description: "Intricately carved guard symbolizing power and protection.",
      },
      {
        id: "dragon-engraving",
        label: "Dragon Engraving",
        labelJa: "龍彫刻",
        image: "/images/parts/dragon-engraving.png",
        description: "Detailed dragon design engraved on the saya — a sign of dominance.",
      },
      {
        id: "kashira",
        label: "Kashira",
        labelJa: "頭",
        image: "/images/parts/kashira.png",
        description: "Ornate pommel cap with traditional Japanese motifs.",
      },
    ],
    specs: [
      { label: "Overall Length", value: "103 cm" },
      { label: "Blade Length", value: "72 cm" },
      { label: "Handle Length", value: "27 cm" },
      { label: "Material", value: "Lacquered Wood" },
      { label: "Weight", value: "Approx. 1.2 kg" },
      { label: "Scabbard", value: "Hardwood (Lacquered)" },
      { label: "Type", value: "Decorative Only" },
    ],
  },
  "white-dragon": {
    id: "white-dragon",
    name: "White Dragon",
    nameJa: "白い龍",
    tagline: "PURE · HONOR · LIGHT",
    description:
      "Forged in purity. Guided by honor. The White Dragon represents light, righteousness, and timeless grace — a collector's dream.",
    theme: "light",
    accentColor: "#C9A94B",
    images: {
      fullView: [
        "/images/products/black-dragon/full-view-1.png",
      ],
    },
    parts: [
      {
        id: "handle",
        label: "Handle",
        labelJa: "柄",
        image: "/images/parts/handle.png",
        description: "Hand-wrapped in premium white cord for an elegant aesthetic.",
      },
      {
        id: "tsuba",
        label: "Tsuba",
        labelJa: "鍔",
        image: "/images/parts/handle.png",
        description: "Detailed guard with floral motifs — purity in every detail.",
      },
      {
        id: "dragon-engraving",
        label: "Dragon Engraving",
        labelJa: "龍彫刻",
        image: "/images/parts/dragon-engraving.png",
        description: "Elegant dragon engraving — a symbol of light and grace.",
      },
      {
        id: "kashira",
        label: "Kashira",
        labelJa: "頭",
        image: "/images/parts/kashira.png",
        description: "Refined pommel cap with traditional Japanese craftsmanship.",
      },
    ],
    specs: [
      { label: "Overall Length", value: "103 cm" },
      { label: "Blade Length", value: "72 cm" },
      { label: "Handle Length", value: "27 cm" },
      { label: "Material", value: "Lacquered Wood" },
      { label: "Weight", value: "Approx. 1.2 kg" },
      { label: "Scabbard", value: "Hardwood (Lacquered)" },
      { label: "Type", value: "Decorative Only" },
    ],
  },
} as const;

export type ProductId = keyof typeof products;
