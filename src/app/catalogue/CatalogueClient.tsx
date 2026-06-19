"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ArrowRight, ShoppingBag } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PageShell } from "@/components/shared/PageShell";
import type { WCProduct } from "@/lib/woocommerce";
import { stripHtml, formatPrice } from "@/lib/woocommerce";

/* ── Static fallback data ────────────────────────────────── */

const STATIC_DRAGONS = [
  {
    slug:        "black-dragon",
    ar:          "التنين الأسود",
    ja:          "黒い龍",
    title:       "BLACK DRAGON",
    tagline:     "POWER · MYSTERY · SHADOW",
    description: "Dark authority and bold aesthetics for anime lovers, gaming setups, and interiors that refuse to be ordinary.",
    price:       "1,399",
    bg:          "hero-black",
    accent:      "rgba(185,154,91,0.92)" as string,
  },
  {
    slug:        "white-dragon",
    ar:          "التنين الأبيض",
    ja:          "白い龍",
    title:       "WHITE DRAGON",
    tagline:     "PURE · HONOR · LIGHT",
    description: "Refined elegance and sacred aesthetics for collectors, anime lovers, and rooms that speak with grace.",
    price:       "1,399",
    bg:          "hero-white",
    accent:      "rgba(185,154,91,0.95)" as string,
  },
] as const;

const COMPARE = [
  { label: "Material",  value: "Decorative Hardwood" },
  { label: "Length",    value: "103 cm" },
  { label: "Finish",    value: "Lacquered Detail" },
  { label: "Purpose",   value: "Display Only" },
  { label: "Delivery",  value: "Free — All Morocco" },
];

/* ── Merged dragon shape ─────────────────────────────────── */

type DragonData = {
  slug:        string;
  ar:          string;
  ja:          string;
  title:       string;
  tagline:     string;
  description: string;
  price:       string;
  bg:          string;
  accent:      string;
  imageUrl:    string | null;
};

function mergeWithWC(
  staticDragon: (typeof STATIC_DRAGONS)[number],
  wcProducts: WCProduct[]
): DragonData {
  const wc = wcProducts.find((p) => p.slug === staticDragon.slug) ?? null;
  return {
    ...staticDragon,
    title:       wc?.name ? wc.name.toUpperCase() : staticDragon.title,
    description: wc?.shortDescription
      ? stripHtml(wc.shortDescription) || staticDragon.description
      : staticDragon.description,
    price:       formatPrice(wc?.price) ?? staticDragon.price,
    imageUrl:    wc?.image?.sourceUrl ?? null,
  };
}

/* ── DragonCard ──────────────────────────────────────────── */

function DragonCard({ dragon, priority }: { dragon: DragonData; priority: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function onEnter() {
    if (!ref.current) return;
    const bg = ref.current.querySelector<HTMLElement>(".card-bg-layer");
    if (bg) { bg.style.transform = "scale(1.06)"; bg.style.opacity = "0.85"; }
    ref.current.style.transform = "translateY(-8px)";
    ref.current.style.boxShadow = `0 32px 80px rgba(0,0,0,0.38), 0 0 0 1.5px ${dragon.accent}`;
  }

  function onLeave() {
    if (!ref.current) return;
    const bg = ref.current.querySelector<HTMLElement>(".card-bg-layer");
    if (bg) { bg.style.transform = "scale(1)"; bg.style.opacity = "0.72"; }
    ref.current.style.transform = "translateY(0)";
    ref.current.style.boxShadow = priority
      ? `0 12px 48px rgba(0,0,0,0.24), 0 0 0 1px ${dragon.accent}`
      : "0 8px 32px rgba(0,0,0,0.18)";
  }

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={() => router.push(`/product/${dragon.slug}`)}
      style={{
        position: "relative", overflow: "hidden", borderRadius: 20,
        minHeight: "clamp(440px,55vh,600px)",
        border: priority
          ? `1px solid ${dragon.accent}`
          : "1px solid rgba(185,154,91,0.22)",
        boxShadow: priority
          ? `0 12px 48px rgba(0,0,0,0.24), 0 0 0 1px ${dragon.accent}`
          : "0 8px 32px rgba(0,0,0,0.18)",
        transition: "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.45s ease",
        cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
    >
      {/* Background */}
      <div
        className="card-bg-layer"
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${dragon.imageUrl ?? `/images/hero/${dragon.bg}-desktop.png`})`,
          backgroundSize: dragon.imageUrl ? "contain" : "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.72,
          transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease",
        }}
      />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.72) 100%)",
      }} />

      {/* Top badges */}
      <div style={{ position: "absolute", top: 24, left: 24, right: 24, zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p className="arabic-kicker" style={{ fontSize: "clamp(1.1rem,2.2vw,1.5rem)", textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}>
          {dragon.ar}
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          {priority && (
            <span style={{
              padding: "3px 12px", borderRadius: 999,
              backgroundColor: dragon.accent, color: "#0a0a0a",
              fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
            }}>
              SELECTED
            </span>
          )}
          <span style={{
            padding: "4px 14px", borderRadius: 999,
            border: `1px solid ${dragon.accent}`, color: dragon.accent,
            fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase",
            backgroundColor: "rgba(0,0,0,0.28)", backdropFilter: "blur(6px)",
          }}>
            AVAILABLE
          </span>
        </div>
      </div>

      {/* Bottom content */}
      <div style={{ position: "relative", zIndex: 2, padding: "clamp(1.5rem,3vw,2rem)" }}>
        <p style={{ color: dragon.accent, fontSize: "0.68rem", letterSpacing: "0.36em", textTransform: "uppercase", marginBottom: "0.35rem", opacity: 0.82 }}>
          {dragon.ja}
        </p>
        <h2 className="font-heading" style={{
          fontSize: "clamp(2rem,4.5vw,3.2rem)", lineHeight: 0.9, letterSpacing: "0.03em",
          color: "#ffffff", textShadow: "0 2px 24px rgba(0,0,0,0.5)",
          marginBottom: "0.6rem", whiteSpace: "nowrap",
        }}>
          {dragon.title}
        </h2>
        <p style={{ color: dragon.accent, fontSize: "0.55rem", letterSpacing: "0.24em", marginBottom: "0.85rem" }}>
          {dragon.tagline}
        </p>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: 400 }}>
          {dragon.description}
        </p>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: "1.25rem" }}>
          <span className="font-heading" style={{ fontSize: "2rem", color: "#ffffff", letterSpacing: "0.02em" }}>
            {dragon.price}
          </span>
          <span style={{ color: dragon.accent, fontSize: "0.58rem", letterSpacing: "0.22em" }}>DH</span>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href={`/product/${dragon.slug}`}
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              height: 46, padding: "0 22px", borderRadius: 8,
              backgroundColor: dragon.accent, color: "#0a0a0a",
              fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
            onClick={(e) => e.stopPropagation()}
          >
            VIEW DETAILS <ArrowRight size={12} strokeWidth={2} />
          </Link>
          <Link
            href={`/checkout?product=${dragon.slug}`}
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              height: 46, padding: "0 18px", borderRadius: 8,
              border: `1px solid ${dragon.accent}`, color: "#ffffff",
              fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase",
              backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(6px)",
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = dragon.accent; el.style.color = "#0a0a0a"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "rgba(255,255,255,0.08)"; el.style.color = "#ffffff"; }}
            onClick={(e) => e.stopPropagation()}
          >
            <ShoppingBag size={12} /> ORDER NOW
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */

export default function CatalogueClient({ wcProducts }: { wcProducts: WCProduct[] }) {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";

  const dragons = STATIC_DRAGONS.map((d) => mergeWithWC(d, wcProducts));

  // Active theme dragon appears first
  const sorted = isBlack
    ? [dragons[0], dragons[1]]
    : [dragons[1], dragons[0]];

  return (
    <PageShell>

      {/* Hero heading */}
      <section style={{
        padding: "clamp(3.5rem,8vw,7rem) clamp(1.5rem,5vw,4rem) clamp(1.5rem,3vw,2.5rem)",
        textAlign: "center", maxWidth: 900, margin: "0 auto",
      }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="arabic-kicker"
          style={{ fontSize: "clamp(1.4rem,3vw,2rem)", marginBottom: "0.2rem" }}
        >
          اختر تنينك
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          style={{ color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.38em", textTransform: "uppercase", opacity: 0.68, marginBottom: "1rem" }}
        >
          龍の選択
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.18 }}
          className="font-heading uppercase"
          style={{ fontSize: "clamp(2.4rem,6vw,4.8rem)", lineHeight: 0.9, letterSpacing: "0.04em", color: "var(--text)", marginBottom: "1.2rem" }}
        >
          THE COLLECTION
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          style={{ color: "var(--text-muted)", fontSize: "clamp(0.82rem,1.5vw,0.95rem)", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}
        >
          Decorative wooden katanas that embody the spirit of the Samurai legacy, honor and discipline. Your gate to Japanese tradition, designed for collectors and premium room decoration.
        </motion.p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: "2rem" }}>
          <div style={{ height: 1, width: 56, backgroundColor: "var(--gold)", opacity: 0.28 }} />
          <span style={{ color: "var(--gold)", fontSize: "0.5rem", opacity: 0.5 }}>◆</span>
          <div style={{ height: 1, width: 56, backgroundColor: "var(--gold)", opacity: 0.28 }} />
        </div>
      </section>

      {/* Dragon cards — active theme first */}
      <section style={{ padding: "0 clamp(1.25rem,4vw,3.5rem) clamp(2.5rem,5vw,4rem)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))",
          gap: "clamp(1.25rem,2.5vw,2rem)",
          maxWidth: 1160, margin: "0 auto",
        }}>
          {sorted.map((dragon, i) => (
            <motion.div
              key={dragon.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: "easeOut", delay: i * 0.14 }}
            >
              <DragonCard dragon={dragon} priority={i === 0} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison strip */}
      <section style={{
        padding: "clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)",
        borderTop: "1px solid rgba(185,154,91,0.13)",
        borderBottom: "1px solid rgba(185,154,91,0.13)",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ color: "var(--gold)", fontSize: "0.55rem", letterSpacing: "0.32em", textTransform: "uppercase", textAlign: "center", marginBottom: "1.75rem", opacity: 0.72 }}
        >
          BOTH MODELS — SAME SPECS
        </motion.p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "clamp(0.75rem,2vw,1.5rem)" }}>
          {COMPARE.map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{
                padding: "1rem 1.25rem", borderRadius: 12, textAlign: "center",
                border: "1px solid rgba(185,154,91,0.16)",
                backgroundColor: isBlack ? "rgba(17,17,17,0.6)" : "rgba(240,234,220,0.65)",
              }}
            >
              <p style={{ color: "var(--gold)", fontSize: "0.5rem", letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.72, marginBottom: "0.45rem" }}>
                {label}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.3 }}>
                {value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Order CTA */}
      <section style={{ padding: "clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading uppercase"
          style={{ fontSize: "clamp(1.3rem,3vw,2rem)", letterSpacing: "0.04em", color: "var(--text)", marginBottom: "0.5rem" }}
        >
          READY TO ORDER?
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}
        >
          Your dragon awaits. Add it to your cart and make it yours.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}
        >
          <Link
            href={`/checkout?product=${isBlack ? "black-dragon" : "white-dragon"}`}
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              height: 50, padding: "0 28px", borderRadius: 8,
              backgroundColor: "var(--gold)", color: "var(--bg)",
              fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
          >
            ORDER NOW
          </Link>
          <Link
            href={`/product/${isBlack ? "black-dragon" : "white-dragon"}`}
            className="flex items-center gap-1.5 transition-all duration-300"
            style={{
              height: 50, padding: "0 24px", borderRadius: 8,
              border: "1px solid rgba(185,154,91,0.42)", color: "var(--gold)",
              fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase",
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "var(--gold)"; el.style.color = "var(--bg)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "transparent"; el.style.color = "var(--gold)"; }}
          >
            VIEW DETAILS <ChevronRight size={12} />
          </Link>
        </motion.div>
      </section>

    </PageShell>
  );
}
