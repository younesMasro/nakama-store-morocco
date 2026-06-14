"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, MapPin, Building2,
  Minus, Plus, Loader2,
  ShieldCheck, Truck, CreditCard, Package, Gift,
} from "lucide-react";
import type { WCProduct, AccessoryProduct } from "@/lib/woocommerce";
import { formatPrice } from "@/lib/woocommerce";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCart } from "@/components/providers/CartProvider";

/* ── helpers ─────────────────────────────────────────────── */
const KATANA: Record<string, { en: string; ar: string; ja: string }> = {
  "black-dragon": { en: "BLACK DRAGON", ar: "التنين الأسود", ja: "黒い龍" },
  "white-dragon": { en: "WHITE DRAGON", ar: "التنين الأبيض", ja: "白い龍" },
};

function parsePrice(raw: string | null | undefined): number {
  const s = formatPrice(raw);
  if (!s) return 1399;
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || 1399;
}

function fmt(n: number): string { return n.toLocaleString("en-US"); }

/* ── Sub-components ──────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.72, marginBottom: "1.1rem" }}>
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
      <span style={{ color: "var(--text)", fontSize: "0.72rem", textAlign: "right", flexShrink: 0, textDecoration: strikethrough ? "line-through" : "none", opacity: strikethrough ? 0.4 : 1, ...valueStyle }}>
        {value}
      </span>
    </div>
  );
}

function FormField({
  label, Icon, type = "text", value, onChange, error, placeholder, autoComplete,
}: {
  label: string; Icon: React.ElementType; type?: string;
  value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", opacity: focused ? 1 : 0.72, transition: "opacity .2s" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <Icon size={14} strokeWidth={1.5} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? "var(--gold)" : "var(--text-muted)", transition: "color .2s", pointerEvents: "none" }} />
        <input
          type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", height: 50, paddingLeft: 40, paddingRight: 14, borderRadius: 10,
            border: error ? "1.5px solid #ef4444" : focused ? "1.5px solid var(--gold)" : "1px solid rgba(185,154,91,0.24)",
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
  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    width: sz, height: sz, display: "flex", alignItems: "center", justifyContent: "center",
    border: "none", backgroundColor: "transparent",
    color: disabled ? "rgba(185,154,91,0.28)" : "var(--gold)",
    cursor: disabled ? "default" : "pointer",
  });
  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(185,154,91,0.32)", borderRadius: large ? 12 : 8, overflow: "hidden", flexShrink: 0 }}>
      <button type="button" onClick={() => onChange(Math.max(value - 1, min))} disabled={value <= min}
        style={{ ...btnStyle(value <= min), borderRight: "1px solid rgba(185,154,91,0.2)" }}
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
        style={{ ...btnStyle(value >= max), borderLeft: "1px solid rgba(185,154,91,0.2)" }}
        onMouseEnter={(e) => { if (value < max) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(185,154,91,0.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
      >
        <Plus size={large ? 17 : 13} strokeWidth={2} />
      </button>
    </div>
  );
}

function KatanaRow({ slug, unit, qty, onChange, sectionLine }: {
  slug: "black-dragon" | "white-dragon"; unit: number;
  qty: number; onChange: (n: number) => void; sectionLine: string;
}) {
  const names = KATANA[slug];
  const isDark = slug === "black-dragon";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8, flexShrink: 0,
        background: isDark ? "linear-gradient(135deg,#0d0d0d,#1a1206)" : "linear-gradient(135deg,#f7f2e8,#efe6d7)",
        border: `1px solid ${isDark ? "rgba(185,154,91,0.28)" : "rgba(185,154,91,0.35)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>⚔️</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "0.44rem", letterSpacing: "0.24em", color: "var(--gold)", opacity: 0.6 }}>{names.ja}</p>
        <p className="font-heading" style={{ fontSize: "0.8rem", letterSpacing: "0.1em", color: "var(--text)", lineHeight: 1.1 }}>{names.en}</p>
        <p style={{ fontSize: "0.6rem", color: "var(--text-muted)", opacity: 0.55 }}>{fmt(unit)} DH / unit</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <MiniStepper value={qty} onChange={onChange} large />
        {qty > 0 && (
          <div style={{ textAlign: "right", minWidth: 80 }}>
            <AnimatePresence mode="wait">
              <motion.p key={qty * unit}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-heading"
                style={{ fontSize: "1.1rem", color: "var(--text)", lineHeight: 1 }}
              >
                {fmt(unit * qty)}
              </motion.p>
            </AnimatePresence>
            <span style={{ fontSize: "0.5rem", color: "var(--gold)", letterSpacing: "0.16em" }}>DH</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AccessoryIcon({ slug }: { slug: string }) {
  const g = "var(--gold)";
  if (slug === "wall-mount") return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={g} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity={0.75}>
      <rect x="2" y="3" width="4" height="18" rx="1"/>
      <path d="M6 8h10a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H6"/>
      <line x1="16" y1="12" x2="16" y2="17"/>
      <line x1="13" y1="17" x2="19" y2="17"/>
    </svg>
  );
  if (slug === "double-display-stand") return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={g} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity={0.75}>
      <line x1="7" y1="3" x2="7" y2="17"/>
      <line x1="14" y1="3" x2="14" y2="17"/>
      <path d="M4 17h6M11 17h6"/>
      <path d="M5 20h4M12 20h4"/>
    </svg>
  );
  /* display-stand default */
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={g} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity={0.75}>
      <line x1="12" y1="3" x2="12" y2="17"/>
      <path d="M7 17h10"/>
      <path d="M9 20h6"/>
    </svg>
  );
}

function AccessoryCard({ acc, qty, onChange, isBundle, isBlack }: {
  acc: AccessoryProduct; qty: number; onChange: (n: number) => void;
  isBundle: boolean; isBlack: boolean;
}) {
  const active = qty > 0 || isBundle;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.75rem",
      padding: "0.8rem 0.9rem", borderRadius: 12,
      border: `1px solid ${active ? "rgba(185,154,91,0.5)" : "rgba(185,154,91,0.18)"}`,
      backgroundColor: active ? "rgba(185,154,91,0.07)" : "transparent",
      transition: "all .25s",
    }}>
      {/* Thumbnail */}
      <div style={{
        width: 44, height: 44, borderRadius: 8, flexShrink: 0, overflow: "hidden",
        backgroundColor: isBlack ? "#111108" : "#f0e8d4",
        border: "1px solid rgba(185,154,91,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {acc.image ? (
          <img src={acc.image} alt={acc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <AccessoryIcon slug={acc.slug} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "0.76rem", color: "var(--text)", fontWeight: 500, lineHeight: 1.25, marginBottom: 2 }}>{acc.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.6rem", color: "var(--gold)", opacity: 0.8 }}>{acc.price} DH</span>
          {isBundle && (
            <span style={{ fontSize: "0.48rem", backgroundColor: "rgba(185,154,91,0.14)", color: "var(--gold)", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.08em" }}>
              × 1 FREE WITH BUNDLE
            </span>
          )}
        </div>
      </div>

      {/* Stepper */}
      <MiniStepper value={qty} onChange={onChange} />
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */

interface Props {
  initialSlug: string;
  initialQty:  number;
  wcBlack:     WCProduct | null;
  wcWhite:     WCProduct | null;
  accessories: AccessoryProduct[];
}

export default function CheckoutClient({ initialSlug, initialQty, wcBlack, wcWhite, accessories }: Props) {
  const router       = useRouter();
  const { theme }    = useTheme();
  const { clearCart } = useCart();
  const isBlack      = theme === "black-dragon";

  /* ── Katana quantities ── */
  const [blackQty, setBlackQty] = useState(initialSlug === "black-dragon" ? initialQty : 0);
  const [whiteQty, setWhiteQty] = useState(initialSlug === "white-dragon" ? initialQty : 0);

  /* ── Accessory quantities ── */
  const [accessoryQtys, setAccessoryQtys] = useState<Record<string, number>>(() =>
    Object.fromEntries(accessories.map((a) => [a.slug, 0]))
  );
  const setAccQty = useCallback((slug: string, qty: number) => {
    setAccessoryQtys((prev) => ({ ...prev, [slug]: Math.max(0, Math.min(20, qty)) }));
  }, []);

  /* ── Contact / delivery ── */
  const [fullName, setFullName] = useState("");
  const [phone,    setPhone]    = useState("");
  const [city,     setCity]     = useState("");
  const [address,  setAddress]  = useState("");
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);
  const [apiErr,   setApiErr]   = useState("");

  /* ── Prices ── */
  const blackUnit = parsePrice(wcBlack?.price);
  const whiteUnit = parsePrice(wcWhite?.price);

  /* ── Bundle & totals ── */
  const hasBundle      = blackQty >= 1 && whiteQty >= 1;
  const freeGiftAcc    = accessories.find((a) => a.slug === "double-display-stand");
  const katanaTotal    = blackQty * blackUnit + whiteQty * whiteUnit;
  const accessoryTotal = useMemo(
    () => accessories.reduce((sum, a) => sum + a.price * (accessoryQtys[a.slug] ?? 0), 0),
    [accessories, accessoryQtys]
  );
  const grandTotal = katanaTotal + accessoryTotal;

  /* ── Validation ── */
  function validate() {
    const e: Record<string, string> = {};
    if (fullName.trim().length < 2) e.fullName = "Required.";
    if (phone.trim().length < 9)    e.phone    = "Enter a valid number.";
    if (city.trim().length < 2)     e.city     = "Required.";
    if (address.trim().length < 5)  e.address  = "Enter your full address.";
    if (blackQty + whiteQty < 1)    e.blackQty = "Select at least one katana.";
    setErrors(e);
    return !Object.keys(e).length;
  }

  /* ── Submit ── */
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiErr("");

    const accessoriesPayload = accessories
      .filter((a) => (accessoryQtys[a.slug] ?? 0) > 0)
      .map((a) => ({ slug: a.slug, databaseId: a.databaseId, quantity: accessoryQtys[a.slug] }));

    try {
      const res  = await fetch("/api/order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({
          fullName, phone, city, address,
          blackQty, whiteQty,
          accessories: accessoriesPayload,
          hasBundle,
          bundleGiftDatabaseId: hasBundle ? (freeGiftAcc?.databaseId ?? null) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setApiErr(data.error ?? "Something went wrong."); return; }

      /* persist for thank-you page */
      try {
        sessionStorage.setItem("nakama-last-order", JSON.stringify({
          orderId:    data.orderId,
          name:       fullName,
          blackQty,   whiteQty,
          blackUnit,  whiteUnit,
          accessories: accessories
            .filter((a) => (accessoryQtys[a.slug] ?? 0) > 0)
            .map((a) => ({ name: a.name, quantity: accessoryQtys[a.slug], price: a.price })),
          hasBundle,
          grandTotal,
        }));
      } catch {}

      clearCart();
      router.push(`/thank-you?orderId=${data.orderId}&name=${encodeURIComponent(fullName)}`);
    } catch {
      setApiErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Design tokens ── */
  const bg         = isBlack ? "#050505"             : "#F7F2E8";
  const cardBg     = isBlack ? "rgba(18,18,18,0.95)" : "rgba(255,252,245,0.96)";
  const cardBorder = "rgba(185,154,91,0.22)";
  const divider    = "rgba(185,154,91,0.12)";
  const summaryBg  = isBlack ? "rgba(185,154,91,0.06)" : "rgba(185,154,91,0.09)";
  const imgFilter  = isBlack
    ? "drop-shadow(0 24px 48px rgba(0,0,0,.70)) drop-shadow(0 0 18px rgba(185,154,91,.12))"
    : "drop-shadow(0 18px 36px rgba(95,65,30,.24))";

  /* ── Selected katana for product card ── */
  const primaryWC   = initialSlug === "white-dragon" ? wcWhite : wcBlack;
  const primaryImgSrc = primaryWC?.image?.sourceUrl ?? null;
  const primaryNames  = KATANA[initialSlug] ?? KATANA["black-dragon"];
  const primaryUnit   = initialSlug === "white-dragon" ? whiteUnit : blackUnit;

  return (
    <div style={{ minHeight: "100svh", backgroundColor: bg, transition: "background .4s", paddingTop: "76px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "clamp(1.5rem,4vh,3rem) clamp(1rem,4vw,2rem)" }}>
        <form onSubmit={submit} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
            className="lg:grid-cols-[1fr_380px]">

            {/* ════ LEFT — form + accessories ════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Contact + Delivery */}
              <div style={{ borderRadius: 18, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflow: "hidden" }}>
                <div style={{ padding: "1.75rem 1.75rem 1.5rem" }}>
                  <SectionLabel>CONTACT INFORMATION</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                    className="sm:grid-cols-2 grid-cols-1">
                    <FormField label="Full Name"    Icon={User}  value={fullName} onChange={setFullName} error={errors.fullName} placeholder="Younes"              autoComplete="name" />
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

              {/* Selected Products */}
              <div style={{ borderRadius: 18, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <SectionLabel>SELECTED PRODUCTS</SectionLabel>

                {wcBlack && (
                  <KatanaRow slug="black-dragon" unit={blackUnit} qty={blackQty} onChange={setBlackQty} sectionLine={divider} />
                )}

                {wcBlack && wcWhite && <div style={{ height: 1, backgroundColor: divider }} />}

                {wcWhite && (
                  <KatanaRow slug="white-dragon" unit={whiteUnit} qty={whiteQty} onChange={setWhiteQty} sectionLine={divider} />
                )}

                {/* Bundle banner */}
                <AnimatePresence>
                  {hasBundle && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ borderRadius: 10, border: "1px solid rgba(185,154,91,0.4)", backgroundColor: "rgba(185,154,91,0.08)", padding: "0.8rem 1rem", display: "flex", alignItems: "flex-start", gap: 10, overflow: "hidden" }}
                    >
                      <Gift size={15} strokeWidth={1.5} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: "0.68rem", color: "var(--gold)", lineHeight: 1.55 }}>
                        <strong>Bundle deal!</strong> Black + White Dragon — <span style={{ color: "var(--gold)" }}>Double Display Stand offered FREE.</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errors.blackQty && (
                  <p style={{ fontSize: "0.6rem", color: "#ef4444" }}>{errors.blackQty}</p>
                )}
              </div>

              {/* Accessories */}
              {accessories.length > 0 && (
                <div style={{ borderRadius: 18, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div>
                    <SectionLabel>COMPLETE YOUR SETUP</SectionLabel>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", opacity: 0.68, lineHeight: 1.5, marginTop: -8 }}>
                      Add a display stand or wall mount for your katana.
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    {accessories.map((acc) => (
                      <AccessoryCard
                        key={acc.slug}
                        acc={acc}
                        qty={accessoryQtys[acc.slug] ?? 0}
                        onChange={(qty) => setAccQty(acc.slug, qty)}
                        isBundle={hasBundle && acc.slug === "double-display-stand"}
                        isBlack={isBlack}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div style={{ borderRadius: 18, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "1.5rem 1.75rem" }}>
                {/* Mini total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.72 }}>ORDER TOTAL</span>
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
                  <p style={{ fontSize: "0.7rem", color: "#ef4444", marginBottom: "1rem", padding: "0.6rem 0.9rem", borderRadius: 8, border: "1px solid rgba(239,68,68,0.24)", backgroundColor: "rgba(239,68,68,0.06)" }}>
                    {apiErr}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  style={{
                    width: "100%", height: 54, borderRadius: 12, border: "none",
                    backgroundColor: loading ? "rgba(185,154,91,0.5)" : "var(--gold)",
                    color: "var(--bg)", fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700,
                    cursor: loading ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "filter .25s", fontFamily: "var(--font-inter, sans-serif)",
                    boxShadow: loading ? "none" : "0 4px 24px rgba(185,154,91,0.24)",
                  }}
                  onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
                >
                  {loading ? <><Loader2 size={17} strokeWidth={2} className="animate-spin" /> PLACING ORDER…</> : <>CONFIRM ORDER →</>}
                </button>

                <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                  {([
                    [ShieldCheck, "Secure"],
                    [Truck,       "Free delivery"],
                    [CreditCard,  "Cash on delivery"],
                    [Package,     "Packaged safely"],
                  ] as const).map(([Icon, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon size={11} strokeWidth={1.5} style={{ color: "var(--gold)", opacity: 0.45 }} />
                      <span style={{ fontSize: "0.58rem", color: "var(--text-muted)", opacity: 0.55 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ════ RIGHT — product + summary ════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Product card */}
              <div style={{ borderRadius: 18, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflow: "hidden" }}>
                <div style={{
                  position: "relative", height: 200, overflow: "hidden",
                  background: isBlack
                    ? "linear-gradient(180deg, #0d0d0d 0%, #111108 100%)"
                    : "linear-gradient(180deg, #f0e8d4 0%, #e8dcc8 100%)",
                }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: `url(/images/hero/hero-${isBlack ? "black" : "white"}-desktop.png)`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }} />
                  {primaryImgSrc ? (
                    <img src={primaryImgSrc} alt={primaryNames.en} style={{
                      position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)",
                      height: 190, width: "auto", objectFit: "contain", filter: imgFilter,
                    }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ color: "var(--gold)", opacity: 0.28, fontSize: "0.56rem", letterSpacing: "0.24em" }}>IMAGE</p>
                    </div>
                  )}
                </div>
                <div style={{ padding: "1rem 1.25rem" }}>
                  <p className="arabic-kicker" style={{ fontSize: "1.25rem", marginBottom: 2 }}>{primaryNames.ar}</p>
                  <p style={{ fontSize: "0.52rem", letterSpacing: "0.28em", color: "var(--gold)", opacity: 0.65, marginBottom: 4 }}>{primaryNames.ja}</p>
                  <p className="font-heading" style={{ fontSize: "0.95rem", letterSpacing: "0.08em", color: "var(--text)" }}>{primaryNames.en}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.65rem", marginTop: 3, opacity: 0.6 }}>
                    {fmt(primaryUnit)} DH / unit · Decorative wood · 103 cm
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ borderRadius: 16, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "1.25rem 1.5rem" }}>
                <SectionLabel>ORDER SUMMARY</SectionLabel>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "0.85rem" }}>
                  {/* Katanas */}
                  {blackQty > 0 && (
                    <SummaryRow label={`Black Dragon × ${blackQty}`} value={`${fmt(blackUnit * blackQty)} DH`} />
                  )}
                  {whiteQty > 0 && (
                    <SummaryRow label={`White Dragon × ${whiteQty}`} value={`${fmt(whiteUnit * whiteQty)} DH`} />
                  )}

                  {/* Accessories */}
                  {accessories.map((a) => {
                    const q = accessoryQtys[a.slug] ?? 0;
                    if (q === 0) return null;
                    return <SummaryRow key={a.slug} label={`${a.name} × ${q}`} value={`${fmt(a.price * q)} DH`} />;
                  })}

                  {/* Free gift */}
                  <AnimatePresence>
                    {hasBundle && freeGiftAcc && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>
                            Double Display Stand × 1
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textDecoration: "line-through", opacity: 0.4 }}>99 DH</span>
                            <span style={{ fontSize: "0.52rem", color: "var(--gold)", backgroundColor: "rgba(185,154,91,0.12)", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.06em" }}>FREE</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Delivery */}
                  <SummaryRow label="Delivery" value="FREE" valueStyle={{ color: "var(--gold)", fontWeight: 600 }} />
                  <SummaryRow label="Delivery time" value="24H – 48H" valueStyle={{ color: "var(--text-muted)", opacity: 0.7 }} />
                  <SummaryRow label="Payment" value="Cash on delivery" valueStyle={{ color: "var(--text-muted)", opacity: 0.7 }} />
                </div>

                <div style={{ height: 1, backgroundColor: divider, marginBottom: "0.85rem" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ color: "var(--gold)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>TOTAL</span>
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

              {/* Payment notes */}
              <div style={{ borderRadius: 12, border: `1px solid ${cardBorder}`, backgroundColor: summaryBg, padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {([
                  [Truck,      "Free delivery across Morocco"],
                  [CreditCard, "Cash on delivery — no online payment"],
                  [Package,    "Secure & premium packaging"],
                ] as const).map(([Icon, label]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(185,154,91,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={12} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{label}</span>
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
