"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, MapPin, Building2,
  Minus, Plus, Loader2,
  ShieldCheck, Truck, CreditCard, Package, Gift,
} from "lucide-react";
import type { WCProduct } from "@/lib/woocommerce";
import { formatPrice } from "@/lib/woocommerce";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCart } from "@/components/providers/CartProvider";

/* ─── types ─────────────────────────────────────────────────── */

interface AccItem {
  databaseId: number;
  slug:  string;
  name:  string;
  price: number;
  image: string | null;
}

/* ─── constants ──────────────────────────────────────────────── */

const KATANA: Record<string, { en: string; ar: string; ja: string }> = {
  "black-dragon": { en: "BLACK DRAGON", ar: "التنين الأسود", ja: "黒い龍" },
  "white-dragon": { en: "WHITE DRAGON", ar: "التنين الأبيض", ja: "白い龍" },
};

const INIT_BLACK_ACCS: AccItem[] = [
  { databaseId: 0, slug: "black-wall-mount",           name: "Black Wall Mount",           price: 99, image: null },
  { databaseId: 0, slug: "black-double-display-stand", name: "Black Double Display Stand", price: 99, image: null },
  { databaseId: 0, slug: "black-display-stand",        name: "Black Display Stand",        price: 99, image: null },
];

const INIT_WHITE_ACCS: AccItem[] = [
  { databaseId: 0, slug: "white-wall-mount",           name: "White Wall Mount",           price: 99, image: null },
  { databaseId: 0, slug: "white-double-display-stand", name: "White Double Display Stand", price: 99, image: null },
  { databaseId: 0, slug: "white-display-stand",        name: "White Display Stand",        price: 99, image: null },
];

/* ─── helpers ────────────────────────────────────────────────── */

function parsePrice(raw: string | null | undefined): number {
  const s = formatPrice(raw);
  if (!s) return 1399;
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || 1399;
}

function fmt(n: number): string { return n.toLocaleString("en-US"); }

/* ─── sub-components ─────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase",
      color: "var(--gold)", opacity: 0.72, marginBottom: "1.1rem",
    }}>
      {children}
    </p>
  );
}

function SummaryRow({ label, value, valueStyle, strikethrough }: {
  label: React.ReactNode; value: React.ReactNode;
  valueStyle?: React.CSSProperties; strikethrough?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
      <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", lineHeight: 1.4 }}>{label}</span>
      <span style={{
        color: "var(--text)", fontSize: "0.72rem", textAlign: "right", flexShrink: 0,
        textDecoration: strikethrough ? "line-through" : "none",
        opacity: strikethrough ? 0.4 : 1,
        ...valueStyle,
      }}>
        {value}
      </span>
    </div>
  );
}

function FormField({ label, Icon, type = "text", value, onChange, error, placeholder, autoComplete }: {
  label: string; Icon: React.ElementType; type?: string;
  value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{
        fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase",
        color: "var(--gold)", opacity: focused ? 1 : 0.72, transition: "opacity .2s",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <Icon size={14} strokeWidth={1.5} style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: focused ? "var(--gold)" : "var(--text-muted)", transition: "color .2s", pointerEvents: "none",
        }} />
        <input
          type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", height: 50, paddingLeft: 40, paddingRight: 14, borderRadius: 10,
            border: error
              ? "1.5px solid #ef4444"
              : focused ? "1.5px solid var(--gold)" : "1px solid rgba(185,154,91,0.24)",
            backgroundColor: focused ? "rgba(185,154,91,0.06)" : "rgba(185,154,91,0.03)",
            color: "var(--text)", fontSize: "0.9rem", outline: "none",
            transition: "border-color .2s, background .2s",
            fontFamily: "var(--font-inter, sans-serif)",
          }}
        />
      </div>
      {error && <p style={{ fontSize: "0.58rem", color: "#ef4444" }}>{error}</p>}
    </div>
  );
}

function MiniStepper({ value, min = 0, max = 20, onChange, large }: {
  value: number; min?: number; max?: number; onChange: (v: number) => void; large?: boolean;
}) {
  const sz = large ? 52 : 36;
  const base = (disabled: boolean): React.CSSProperties => ({
    width: sz, height: sz, display: "flex", alignItems: "center", justifyContent: "center",
    border: "none", backgroundColor: "transparent",
    color: disabled ? "rgba(185,154,91,0.28)" : "var(--gold)",
    cursor: disabled ? "default" : "pointer",
  });
  return (
    <div style={{
      display: "inline-flex", alignItems: "center",
      border: "1px solid rgba(185,154,91,0.32)", borderRadius: large ? 12 : 8,
      overflow: "hidden", flexShrink: 0,
    }}>
      <button type="button" onClick={() => onChange(Math.max(value - 1, min))} disabled={value <= min}
        style={{ ...base(value <= min), borderRight: "1px solid rgba(185,154,91,0.2)" }}
        onMouseEnter={(e) => { if (value > min) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(185,154,91,0.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
      >
        <Minus size={large ? 17 : 13} strokeWidth={2} />
      </button>
      <div style={{ minWidth: large ? 68 : 36, height: sz, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: large ? 2 : 0 }}>
        <AnimatePresence mode="wait">
          <motion.span key={value}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.12 }}
            className="font-heading"
            style={{ display: "block", fontSize: large ? "1.6rem" : "1rem", lineHeight: 1, color: "var(--text)" }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        {large && (
          <span style={{ fontSize: "0.42rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.5 }}>
            {value === 1 ? "UNIT" : "UNITS"}
          </span>
        )}
      </div>
      <button type="button" onClick={() => onChange(Math.min(value + 1, max))} disabled={value >= max}
        style={{ ...base(value >= max), borderLeft: "1px solid rgba(185,154,91,0.2)" }}
        onMouseEnter={(e) => { if (value < max) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(185,154,91,0.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
      >
        <Plus size={large ? 17 : 13} strokeWidth={2} />
      </button>
    </div>
  );
}

function AccessoryIcon({ slug }: { slug: string }) {
  const g = "var(--gold)";
  if (slug.includes("wall-mount")) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={g} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity={0.65}>
      <rect x="2" y="3" width="4" height="18" rx="1"/>
      <path d="M6 8h10a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H6"/>
      <line x1="16" y1="12" x2="16" y2="17"/>
      <line x1="13" y1="17" x2="19" y2="17"/>
    </svg>
  );
  if (slug.includes("double-display-stand")) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={g} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity={0.65}>
      <line x1="7" y1="3" x2="7" y2="17"/>
      <line x1="14" y1="3" x2="14" y2="17"/>
      <path d="M4 17h6M11 17h6"/>
      <path d="M5 20h4M12 20h4"/>
    </svg>
  );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={g} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity={0.65}>
      <line x1="12" y1="3" x2="12" y2="17"/>
      <path d="M7 17h10"/>
      <path d="M9 20h6"/>
    </svg>
  );
}

function AccessoryRow({ acc, qty, onChange, isBundleGift, isBlack, isLast }: {
  acc: AccItem; qty: number; onChange: (n: number) => void;
  isBundleGift: boolean; isBlack: boolean; isLast: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = !!acc.image && !imgFailed;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.75rem",
      padding: "0.75rem 0",
      borderBottom: isLast ? "none" : "1px solid rgba(185,154,91,0.08)",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 10, flexShrink: 0, overflow: "hidden",
        backgroundColor: isBlack ? "#111108" : "#f0e8d4",
        border: "1px solid rgba(185,154,91,0.22)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: showImg ? 4 : 0,
      }}>
        {showImg ? (
          <img
            src={acc.image!}
            alt={acc.name}
            onError={() => setImgFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <AccessoryIcon slug={acc.slug} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "0.74rem", color: "var(--text)", fontWeight: 500, lineHeight: 1.25, marginBottom: 2 }}>
          {acc.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.6rem", color: "var(--gold)", opacity: 0.8 }}>{acc.price} DH</span>
          {isBundleGift && (
            <span style={{
              fontSize: "0.44rem", backgroundColor: "rgba(185,154,91,0.14)", color: "var(--gold)",
              padding: "1px 6px", borderRadius: 4, letterSpacing: "0.08em",
            }}>
              × 1 FREE WITH BUNDLE
            </span>
          )}
        </div>
      </div>

      <MiniStepper value={qty} onChange={onChange} />
    </div>
  );
}

/* KatanaSection — one dragon card with its nested accessories */
function KatanaSection({
  dragonSlug, wcData, clientImage, qty, onQtyChange, unit,
  accessories, accQtys, onAccQtyChange, isBlack, freeGiftSlug,
  cardBg, cardBorder, divider,
}: {
  dragonSlug: "black-dragon" | "white-dragon";
  wcData: WCProduct | null;
  clientImage: string | null;
  qty: number;
  onQtyChange: (n: number) => void;
  unit: number;
  accessories: AccItem[];
  accQtys: Record<string, number>;
  onAccQtyChange: (slug: string, qty: number) => void;
  isBlack: boolean;
  freeGiftSlug: string | null;
  cardBg: string;
  cardBorder: string;
  divider: string;
}) {
  const isDark = dragonSlug === "black-dragon";
  const names  = KATANA[dragonSlug];
  const imgSrc = wcData?.image?.sourceUrl ?? clientImage;

  return (
    <div style={{
      borderRadius: 16, border: `1px solid ${cardBorder}`,
      backgroundColor: cardBg, overflow: "hidden",
    }}>
      {/* ── Dragon header: thumbnail + name + stepper ── */}
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
          {/* Thumbnail */}
          <div style={{
            width: 52, height: 52, borderRadius: 10, flexShrink: 0, overflow: "hidden",
            background: isDark
              ? "linear-gradient(135deg,#0d0d0d,#1a1206)"
              : "linear-gradient(135deg,#f7f2e8,#efe6d7)",
            border: `1px solid ${isDark ? "rgba(185,154,91,0.28)" : "rgba(185,154,91,0.35)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {imgSrc ? (
              <img src={imgSrc} alt={names.en}
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
            ) : (
              <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>⚔️</span>
            )}
          </div>

          {/* Name + price */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.44rem", letterSpacing: "0.24em", color: "var(--gold)", opacity: 0.6, marginBottom: 1 }}>
              {names.ja}
            </p>
            <p className="font-heading" style={{ fontSize: "0.95rem", letterSpacing: "0.08em", color: "var(--text)", lineHeight: 1.1 }}>
              {names.en}
            </p>
            <p style={{ fontSize: "0.58rem", color: "var(--text-muted)", opacity: 0.5, marginTop: 2 }}>
              {fmt(unit)} DH / unit
            </p>
          </div>

          {/* Qty + subtotal */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            <MiniStepper value={qty} onChange={onQtyChange} />
            <AnimatePresence mode="wait">
              {qty > 0 && (
                <motion.p key={qty * unit}
                  initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ fontSize: "0.7rem", color: "var(--gold)", textAlign: "right", lineHeight: 1 }}
                >
                  {fmt(unit * qty)} DH
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Accessories ── */}
      <div style={{ borderTop: `1px solid ${divider}`, padding: "1rem 1.5rem 1.4rem" }}>
        <p style={{
          fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase",
          color: "var(--gold)", opacity: 0.62, marginBottom: "0.15rem",
        }}>
          COMPLETE YOUR {isDark ? "BLACK" : "WHITE"} DRAGON SETUP
        </p>
        <p style={{ fontSize: "0.64rem", color: "var(--text-muted)", opacity: 0.5, lineHeight: 1.5, marginBottom: "0.8rem" }}>
          Optional accessories. Quantity starts at 0.
        </p>
        <div>
          {accessories.map((acc, i) => (
            <AccessoryRow
              key={acc.slug}
              acc={acc}
              qty={accQtys[acc.slug] ?? 0}
              onChange={(q) => onAccQtyChange(acc.slug, q)}
              isBundleGift={freeGiftSlug === acc.slug}
              isBlack={isBlack}
              isLast={i === accessories.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── main component ──────────────────────────────────────────── */

interface Props {
  initialSlug: string | null;
  initialQty:  number;
  wcBlack:     WCProduct | null;
  wcWhite:     WCProduct | null;
}

export default function CheckoutClient({ initialSlug, initialQty, wcBlack, wcWhite }: Props) {
  const router     = useRouter();
  const { theme }  = useTheme();
  const { clearCart } = useCart();
  const isBlack    = theme === "black-dragon";

  /* ── Katana quantities ── */
  const [blackQty, setBlackQty] = useState(initialSlug === "black-dragon" ? initialQty : 0);
  const [whiteQty, setWhiteQty] = useState(initialSlug === "white-dragon" ? initialQty : 0);

  /* ── Accessory data (populated by client-side fetch) ── */
  const [blackAccs, setBlackAccs] = useState<AccItem[]>(INIT_BLACK_ACCS);
  const [whiteAccs, setWhiteAccs] = useState<AccItem[]>(INIT_WHITE_ACCS);

  /* ── Accessory quantities — all start at 0 ── */
  const [accQtys, setAccQtys] = useState<Record<string, number>>({
    "black-wall-mount":           0,
    "black-double-display-stand": 0,
    "black-display-stand":        0,
    "white-wall-mount":           0,
    "white-double-display-stand": 0,
    "white-display-stand":        0,
  });
  const setAccQty = useCallback((slug: string, qty: number) => {
    setAccQtys((prev) => ({ ...prev, [slug]: Math.max(0, Math.min(20, qty)) }));
  }, []);

  /* ── Dragon images (client-side, bypasses Hostinger loopback block) ── */
  const [clientBlackImg, setClientBlackImg] = useState<string | null>(null);
  const [clientWhiteImg, setClientWhiteImg] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    type WPNode = {
      databaseId: number;
      slug: string;
      name: string;
      image?: { sourceUrl?: string } | null;
      price?: string;
    };

    function resolveAcc(
      direct: WPNode | null | undefined,
      catNodes: WPNode[],
      targetSlug: string,
      fallback: AccItem,
      excludeKeyword?: string,
    ): AccItem {
      const match =
        direct ??
        catNodes.find((n) => {
          if (n.slug === targetSlug) return true;
          const nm = (n.name ?? "").toLowerCase();
          const allParts = targetSlug.split("-");
          return (
            allParts.every((p) => nm.includes(p)) &&
            !(excludeKeyword && nm.includes(excludeKeyword))
          );
        });
      if (!match) return fallback;
      return {
        databaseId: match.databaseId || fallback.databaseId,
        slug:       targetSlug,
        name:       match.name || fallback.name,
        price:      parseInt((match.price ?? "99").replace(/[^0-9]/g, ""), 10) || 99,
        image:      match.image?.sourceUrl ?? fallback.image,
      };
    }

    fetch("https://admin.nakamastore.ma/graphql", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      signal:  controller.signal,
      body: JSON.stringify({
        query: `{
          cat: products(first:30, where:{category:"accessories"}) {
            nodes { databaseId slug name image{sourceUrl} ...on SimpleProduct{price} }
          }
          bwm:  product(id:"black-wall-mount",           idType:SLUG){ databaseId name image{sourceUrl} ...on SimpleProduct{price} }
          bdds: product(id:"black-double-display-stand",  idType:SLUG){ databaseId name image{sourceUrl} ...on SimpleProduct{price} }
          bds:  product(id:"black-display-stand",         idType:SLUG){ databaseId name image{sourceUrl} ...on SimpleProduct{price} }
          wwm:  product(id:"white-wall-mount",            idType:SLUG){ databaseId name image{sourceUrl} ...on SimpleProduct{price} }
          wdds: product(id:"white-double-display-stand",  idType:SLUG){ databaseId name image{sourceUrl} ...on SimpleProduct{price} }
          wds:  product(id:"white-display-stand",         idType:SLUG){ databaseId name image{sourceUrl} ...on SimpleProduct{price} }
          bd:   product(id:"black-dragon",                idType:SLUG){ image{sourceUrl} }
          wd:   product(id:"white-dragon",                idType:SLUG){ image{sourceUrl} }
        }`,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        clearTimeout(timer);
        const dt = d?.data ?? {};
        const catNodes: WPNode[] = dt.cat?.nodes ?? [];

        setClientBlackImg(dt.bd?.image?.sourceUrl ?? null);
        setClientWhiteImg(dt.wd?.image?.sourceUrl ?? null);

        setBlackAccs([
          resolveAcc(dt.bwm,  catNodes, "black-wall-mount",           INIT_BLACK_ACCS[0]),
          resolveAcc(dt.bdds, catNodes, "black-double-display-stand", INIT_BLACK_ACCS[1]),
          resolveAcc(dt.bds,  catNodes, "black-display-stand",        INIT_BLACK_ACCS[2], "double"),
        ]);
        setWhiteAccs([
          resolveAcc(dt.wwm,  catNodes, "white-wall-mount",           INIT_WHITE_ACCS[0]),
          resolveAcc(dt.wdds, catNodes, "white-double-display-stand", INIT_WHITE_ACCS[1]),
          resolveAcc(dt.wds,  catNodes, "white-display-stand",        INIT_WHITE_ACCS[2], "double"),
        ]);
      })
      .catch(() => clearTimeout(timer));

    return () => { clearTimeout(timer); controller.abort(); };
  }, []);

  /* ── Prices ── */
  const blackUnit = parsePrice(wcBlack?.price);
  const whiteUnit = parsePrice(wcWhite?.price);

  /* ── Bundle & free gift ── */
  const hasBundle = blackQty >= 1 && whiteQty >= 1;

  const freeGiftSlug = useMemo<string | null>(() => {
    if (!hasBundle) return null;
    // Prefer black-double-display-stand; fall back to white
    return (
      blackAccs.find((a) => a.slug === "black-double-display-stand")?.slug ??
      whiteAccs.find((a) => a.slug === "white-double-display-stand")?.slug ??
      null
    );
  }, [hasBundle, blackAccs, whiteAccs]);

  const freeGiftAcc = useMemo<AccItem | null>(() => {
    if (!freeGiftSlug) return null;
    return [...blackAccs, ...whiteAccs].find((a) => a.slug === freeGiftSlug) ?? null;
  }, [freeGiftSlug, blackAccs, whiteAccs]);

  /* ── Totals ── */
  const katanaTotal = blackQty * blackUnit + whiteQty * whiteUnit;
  const accTotal = useMemo(() =>
    [...blackAccs, ...whiteAccs].reduce((sum, a) => sum + a.price * (accQtys[a.slug] ?? 0), 0),
    [blackAccs, whiteAccs, accQtys],
  );
  const grandTotal = katanaTotal + accTotal;

  /* ── Form state ── */
  const [fullName, setFullName] = useState("");
  const [phone,    setPhone]    = useState("");
  const [city,     setCity]     = useState("");
  const [address,  setAddress]  = useState("");
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);
  const [apiErr,   setApiErr]   = useState("");

  /* ── Validation ── */
  function validate() {
    const e: Record<string, string> = {};
    if (fullName.trim().length < 2) e.fullName = "Required.";
    if (phone.trim().length < 9)    e.phone    = "Enter a valid number.";
    if (city.trim().length < 2)     e.city     = "Required.";
    if (address.trim().length < 5)  e.address  = "Enter your full address.";
    if (blackQty + whiteQty < 1)    e.katana   = "Please select at least one katana before confirming your order.";
    setErrors(e);
    return !Object.keys(e).length;
  }

  /* ── Submit ── */
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiErr("");

    const allAccs = [...blackAccs, ...whiteAccs];
    const accessoriesPayload = allAccs
      .filter((a) => (accQtys[a.slug] ?? 0) > 0)
      .map((a) => ({ slug: a.slug, databaseId: a.databaseId, quantity: accQtys[a.slug] }));

    try {
      const res  = await fetch("/api/order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          fullName, phone, city, address,
          blackQty, whiteQty,
          accessories:          accessoriesPayload,
          hasBundle,
          bundleGiftDatabaseId: hasBundle && freeGiftAcc ? freeGiftAcc.databaseId : null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setApiErr(data.error ?? "Something went wrong."); return; }

      try {
        sessionStorage.setItem("nakama-last-order", JSON.stringify({
          orderId: data.orderId, name: fullName,
          blackQty, whiteQty, blackUnit, whiteUnit,
          accessories: allAccs
            .filter((a) => (accQtys[a.slug] ?? 0) > 0)
            .map((a) => ({ name: a.name, quantity: accQtys[a.slug], price: a.price })),
          hasBundle, grandTotal,
        }));
      } catch { /* sessionStorage may be unavailable */ }

      clearCart();
      router.push(`/thank-you?orderId=${data.orderId}&name=${encodeURIComponent(fullName)}`);
    } catch {
      setApiErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Design tokens ── */
  const bg        = isBlack ? "#050505"             : "#F7F2E8";
  const cardBg    = isBlack ? "rgba(18,18,18,0.95)" : "rgba(255,252,245,0.96)";
  const innerCard = isBlack ? "rgba(10,10,8,0.9)"   : "rgba(240,234,218,0.65)";
  const cardBorder = "rgba(185,154,91,0.22)";
  const divider    = "rgba(185,154,91,0.12)";
  const summaryBg  = isBlack ? "rgba(185,154,91,0.06)" : "rgba(185,154,91,0.09)";

  const deliveryItems = [
    { Icon: Truck,       label: "Livraison gratuite partout au Maroc" },
    { Icon: CreditCard,  label: "Paiement à la livraison — aucun paiement en ligne" },
    { Icon: Package,     label: "Emballage sécurisé et premium" },
    { Icon: Phone,       label: "Notre équipe vous appellera pour confirmer la commande" },
  ];

  return (
    <div style={{ minHeight: "100svh", backgroundColor: bg, transition: "background .4s", paddingTop: "76px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(1.5rem,4vh,3rem) clamp(1rem,4vw,2rem)" }}>
        <form onSubmit={submit} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
            className="lg:grid-cols-[1fr_360px]">

            {/* ════════════ LEFT ════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >

              {/* Contact + Delivery */}
              <div style={{
                borderRadius: 18, border: `1px solid ${cardBorder}`,
                backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                overflow: "hidden",
              }}>
                <div style={{ padding: "1.75rem 1.75rem 1.5rem" }}>
                  <SectionLabel>CONTACT INFORMATION</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                    className="sm:grid-cols-2 grid-cols-1">
                    <FormField label="Full Name"    Icon={User}  value={fullName} onChange={setFullName} error={errors.fullName} placeholder="Younes"            autoComplete="name" />
                    <FormField label="Phone Number" Icon={Phone} value={phone}    onChange={setPhone}    error={errors.phone}    placeholder="+212 6XX XXX XXX" autoComplete="tel" type="tel" />
                  </div>
                </div>

                <div style={{ height: 1, backgroundColor: divider, margin: "0 1.75rem" }} />

                <div style={{ padding: "1.5rem 1.75rem 1.75rem" }}>
                  <SectionLabel>DELIVERY INFORMATION</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                    className="sm:grid-cols-2 grid-cols-1">
                    <FormField label="City"             Icon={Building2} value={city}    onChange={setCity}    error={errors.city}    placeholder="Casablanca"               autoComplete="address-level2" />
                    <FormField label="Delivery Address" Icon={MapPin}    value={address} onChange={setAddress} error={errors.address} placeholder="123 Rue Example, Appt 4" autoComplete="street-address" />
                  </div>
                </div>
              </div>

              {/* Choose Your Katana */}
              <div style={{
                borderRadius: 18, border: `1px solid ${cardBorder}`,
                backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                padding: "1.5rem 1.75rem",
              }}>
                <SectionLabel>CHOOSE YOUR KATANA</SectionLabel>
                <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", opacity: 0.6, lineHeight: 1.6, marginTop: -8, marginBottom: "1.25rem" }}>
                  Adjust the quantity for each model. Accessories are optional and start at 0 — add only what you need.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <KatanaSection
                    dragonSlug="black-dragon"
                    wcData={wcBlack}
                    clientImage={clientBlackImg}
                    qty={blackQty}
                    onQtyChange={setBlackQty}
                    unit={blackUnit}
                    accessories={blackAccs}
                    accQtys={accQtys}
                    onAccQtyChange={setAccQty}
                    isBlack={isBlack}
                    freeGiftSlug={freeGiftSlug}
                    cardBg={innerCard}
                    cardBorder={cardBorder}
                    divider={divider}
                  />

                  <KatanaSection
                    dragonSlug="white-dragon"
                    wcData={wcWhite}
                    clientImage={clientWhiteImg}
                    qty={whiteQty}
                    onQtyChange={setWhiteQty}
                    unit={whiteUnit}
                    accessories={whiteAccs}
                    accQtys={accQtys}
                    onAccQtyChange={setAccQty}
                    isBlack={isBlack}
                    freeGiftSlug={freeGiftSlug}
                    cardBg={innerCard}
                    cardBorder={cardBorder}
                    divider={divider}
                  />
                </div>

                {/* Bundle banner */}
                <AnimatePresence>
                  {hasBundle && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                      style={{
                        marginTop: "1rem", overflow: "hidden", borderRadius: 10,
                        border: "1px solid rgba(185,154,91,0.4)",
                        backgroundColor: "rgba(185,154,91,0.08)",
                        padding: "0.85rem 1rem",
                        display: "flex", alignItems: "flex-start", gap: 10,
                      }}
                    >
                      <Gift size={15} strokeWidth={1.5} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: "0.68rem", color: "var(--gold)", lineHeight: 1.6 }}>
                        <strong>Bundle deal!</strong> Black + White Dragon — Double Display Stand offered <strong>FREE</strong>.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errors.katana && (
                  <p style={{ fontSize: "0.62rem", color: "#ef4444", marginTop: "0.85rem" }}>
                    {errors.katana}
                  </p>
                )}
              </div>

              {/* CTA card */}
              <div style={{
                borderRadius: 18, border: `1px solid ${cardBorder}`,
                backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                padding: "1.5rem 1.75rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.72 }}>
                    ORDER TOTAL
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <AnimatePresence mode="wait">
                      <motion.span key={grandTotal}
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="font-heading"
                        style={{ fontSize: "2rem", color: "var(--text)", lineHeight: 1 }}
                      >
                        {fmt(grandTotal)}
                      </motion.span>
                    </AnimatePresence>
                    <span style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.18em" }}>DH</span>
                  </div>
                </div>

                {apiErr && (
                  <p style={{
                    fontSize: "0.7rem", color: "#ef4444", marginBottom: "1rem",
                    padding: "0.6rem 0.9rem", borderRadius: 8,
                    border: "1px solid rgba(239,68,68,0.24)", backgroundColor: "rgba(239,68,68,0.06)",
                  }}>
                    {apiErr}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", height: 54, borderRadius: 12, border: "none",
                    backgroundColor: loading ? "rgba(185,154,91,0.5)" : "var(--gold)",
                    color: "var(--bg)", fontSize: "0.68rem", letterSpacing: "0.24em",
                    textTransform: "uppercase", fontWeight: 700,
                    cursor: loading ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "filter .25s", fontFamily: "var(--font-inter, sans-serif)",
                    boxShadow: loading ? "none" : "0 4px 24px rgba(185,154,91,0.24)",
                  }}
                  onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
                >
                  {loading
                    ? <><Loader2 size={17} strokeWidth={2} className="animate-spin" /> PLACING ORDER…</>
                    : <>CONFIRM ORDER →</>}
                </button>

                <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                  {([
                    [ShieldCheck, "Secure"],
                    [Truck,       "Free delivery"],
                    [CreditCard,  "Cash on delivery"],
                    [Package,     "Packaged safely"],
                  ] as [React.ElementType, string][]).map(([Icon, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon size={11} strokeWidth={1.5} style={{ color: "var(--gold)", opacity: 0.45 }} />
                      <span style={{ fontSize: "0.58rem", color: "var(--text-muted)", opacity: 0.55 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ════════════ RIGHT ════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >

              {/* Order Summary */}
              <div style={{
                borderRadius: 16, border: `1px solid ${cardBorder}`,
                backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                padding: "1.25rem 1.5rem",
              }}>
                <SectionLabel>ORDER SUMMARY</SectionLabel>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "0.85rem" }}>
                  {blackQty > 0 && (
                    <SummaryRow label={`Black Dragon × ${blackQty}`} value={`${fmt(blackUnit * blackQty)} DH`} />
                  )}
                  {whiteQty > 0 && (
                    <SummaryRow label={`White Dragon × ${whiteQty}`} value={`${fmt(whiteUnit * whiteQty)} DH`} />
                  )}

                  {[...blackAccs, ...whiteAccs].map((a) => {
                    const q = accQtys[a.slug] ?? 0;
                    if (q === 0) return null;
                    return (
                      <SummaryRow key={a.slug} label={`${a.name} × ${q}`} value={`${fmt(a.price * q)} DH`} />
                    );
                  })}

                  <AnimatePresence>
                    {hasBundle && freeGiftAcc && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>
                            Double Display Stand × 1
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textDecoration: "line-through", opacity: 0.4 }}>99 DH</span>
                            <span style={{ fontSize: "0.52rem", color: "var(--gold)", backgroundColor: "rgba(185,154,91,0.12)", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.06em" }}>
                              FREE
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <SummaryRow label="Delivery"      value="FREE"        valueStyle={{ color: "var(--gold)", fontWeight: 600 }} />
                  <SummaryRow label="Delivery time" value="24H – 48H"   valueStyle={{ color: "var(--text-muted)", opacity: 0.7 }} />
                  <SummaryRow label="Payment"       value="Cash on delivery" valueStyle={{ color: "var(--text-muted)", opacity: 0.7 }} />
                </div>

                <div style={{ height: 1, backgroundColor: divider, marginBottom: "0.85rem" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ color: "var(--gold)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                    TOTAL
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <AnimatePresence mode="wait">
                      <motion.span key={grandTotal}
                        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="font-heading"
                        style={{ fontSize: "1.9rem", color: "var(--text)", lineHeight: 1 }}
                      >
                        {fmt(grandTotal)}
                      </motion.span>
                    </AnimatePresence>
                    <span style={{ color: "var(--gold)", fontSize: "0.58rem", letterSpacing: "0.2em" }}>DH</span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div style={{
                borderRadius: 12, border: `1px solid ${cardBorder}`,
                backgroundColor: summaryBg,
                padding: "1.1rem 1.25rem",
                display: "flex", flexDirection: "column", gap: "0.7rem",
              }}>
                {deliveryItems.map(({ Icon, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      border: "1px solid rgba(185,154,91,0.28)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                    }}>
                      <Icon size={12} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                    </div>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1.5, marginTop: 4 }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
