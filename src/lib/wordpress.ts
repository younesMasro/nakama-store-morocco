import { fetchGraphQL } from "./graphql";
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG } from "./queries/products";

/* ── Types ────────────────────────────────────────────────── */

export interface WCProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: { sourceUrl: string } | null;
  galleryImages: { nodes: { sourceUrl: string }[] };
  productCategories: { nodes: { name: string; slug: string }[] };
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
}

interface ProductsData {
  products: { nodes: WCProduct[] };
}

interface ProductData {
  product: WCProduct | null;
}

/* ── Helpers ──────────────────────────────────────────────── */

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatPrice(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const text = stripHtml(raw);
  const match = text.match(/([\d\s,]+(?:\.\d{1,2})?)/);
  if (!match) return text;
  return match[1]
    .replace(/\s/g, "")
    .replace(/\.00$/, "")
    .replace(/,00$/, "")
    .trim();
}

/* ── Disk cache (server-side only) ───────────────────────── */

const CACHE_TTL = 24 * 60 * 60 * 1000;

function getCachePath(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");
  return path.join(process.cwd(), ".nakama-cache", "products.json");
}

function readCache(): WCProduct[] | null {
  if (typeof window !== "undefined") return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs") as typeof import("fs");
    const file = getCachePath();
    if (!fs.existsSync(file)) return null;
    const raw = JSON.parse(fs.readFileSync(file, "utf-8")) as { products: WCProduct[]; savedAt: number };
    if (Date.now() - raw.savedAt > CACHE_TTL) return null;
    return raw.products;
  } catch {
    return null;
  }
}

function writeCache(products: WCProduct[]): void {
  if (typeof window !== "undefined") return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs   = require("fs")   as typeof import("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path") as typeof import("path");
    const dir  = path.join(process.cwd(), ".nakama-cache");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "products.json"),
      JSON.stringify({ products, savedAt: Date.now() }),
      "utf-8"
    );
  } catch (e) {
    console.error("[Nakama] Failed to write product cache:", e);
  }
}

/* ── Accessory product type ───────────────────────────────── */

export interface AccessoryProduct {
  databaseId: number;
  slug:  string;
  name:  string;
  price: number;
  image: string | null;
}

const ACCESSORY_FALLBACK: AccessoryProduct[] = [
  { databaseId: 0, slug: "display-stand",       name: "Display Stand",        price: 99, image: null },
  { databaseId: 0, slug: "double-display-stand", name: "Double Display Stand", price: 99, image: null },
  { databaseId: 0, slug: "wall-mount",           name: "Wall Mount",           price: 99, image: null },
];

/* ── Product fetchers ─────────────────────────────────────── */

export async function getProducts(): Promise<WCProduct[]> {
  try {
    const data = await fetchGraphQL<ProductsData>(GET_PRODUCTS, undefined, 3600);
    const products = data.products?.nodes ?? [];
    if (products.length > 0) writeCache(products);
    return products;
  } catch (err) {
    console.error("[Nakama] getProducts() failed.", err);
    const cached = readCache();
    if (cached) {
      console.log("[Nakama] Using disk-cached product data.");
      return cached;
    }
    return [];
  }
}

export async function getAccessoriesProducts(): Promise<AccessoryProduct[]> {
  try {
    const all = await getProducts();
    const hits = all.filter((p) =>
      p.productCategories?.nodes?.some(
        (c) => c.slug === "accessories" || c.name.toLowerCase() === "accessories"
      )
    );
    if (!hits.length) return ACCESSORY_FALLBACK;
    return hits.map((p) => ({
      databaseId: p.databaseId,
      slug:       p.slug,
      name:       p.name,
      price:      parseInt((formatPrice(p.price) ?? "99").replace(/[^0-9]/g, ""), 10) || 99,
      image:      p.image?.sourceUrl ?? null,
    }));
  } catch {
    return ACCESSORY_FALLBACK;
  }
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  try {
    const data = await fetchGraphQL<ProductData>(GET_PRODUCT_BY_SLUG, { slug }, 3600);
    return data.product ?? null;
  } catch (err) {
    const msg = String(err).toLowerCase();
    if (msg.includes("no product id") || msg.includes("not found")) return null;
    console.error(`[Nakama] getProductBySlug("${slug}") failed.`, err);
    const cached = readCache();
    if (cached) return cached.find((p) => p.slug === slug) ?? null;
    return null;
  }
}
