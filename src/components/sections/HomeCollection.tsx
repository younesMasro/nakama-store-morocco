"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useRouter } from "next/navigation";

const DRAGONS = [
  {
    slug:    "black-dragon",
    ar:      "التنين الأسود",
    ja:      "黒い龍",
    title:   "BLACK DRAGON",
    tagline: "POWER · MYSTERY · SHADOW",
    desc:    "Dark authority and bold aesthetics for anime lovers, gaming setups, and interiors that refuse to be ordinary.",
    bgKey:   "black",
    accent:  "rgba(185,154,91,0.92)" as string,
  },
  {
    slug:    "white-dragon",
    ar:      "التنين الأبيض",
    ja:      "白い龍",
    title:   "WHITE DRAGON",
    tagline: "PURE · HONOR · LIGHT",
    desc:    "Refined elegance and sacred aesthetics for collectors, anime lovers, and rooms that speak with grace.",
    bgKey:   "white",
    accent:  "rgba(185,154,91,0.95)" as string,
  },
] as const;

/* ── HomeCard — mirrors DragonCard from catalogue ───────── */

function HomeCard({ dragon, imageUrl, price }: { dragon: typeof DRAGONS[number]; imageUrl: string | null; price: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { accent } = dragon;

  function onEnter() {
    if (!ref.current) return;
    const bg = ref.current.querySelector<HTMLElement>(".hc-bg-layer");
    if (bg) { bg.style.transform = "scale(1.06)"; bg.style.opacity = "0.85"; }
    ref.current.style.transform = "translateY(-8px)";
    ref.current.style.boxShadow = `0 32px 80px rgba(0,0,0,0.38), 0 0 0 1.5px ${accent}`;
  }

  function onLeave() {
    if (!ref.current) return;
    const bg = ref.current.querySelector<HTMLElement>(".hc-bg-layer");
    if (bg) { bg.style.transform = "scale(1)"; bg.style.opacity = "0.72"; }
    ref.current.style.transform = "translateY(0)";
    ref.current.style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)";
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
        border: "1px solid rgba(185,154,91,0.22)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        transition: "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.45s ease",
        cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
    >
      {/* Background layer — atmospheric card-bg image */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(/images/${dragon.slug}-card-bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Product image — the actual katana photo, centred with contain */}
      <div
        className="hc-bg-layer"
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: `url(${imageUrl ?? `/images/hero/hero-${dragon.bgKey}-desktop.png`})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.92,
          transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease",
        }}
      />
      {/* Gradient overlay — darkens bottom for text legibility */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.72) 100%)",
      }} />

      {/* Top: Arabic label + AVAILABLE badge */}
      <div style={{ position: "absolute", top: 24, left: 24, right: 24, zIndex: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p className="arabic-kicker" style={{ fontSize: "clamp(1.1rem,2.2vw,1.5rem)", textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}>
          {dragon.ar}
        </p>
        <span style={{
          padding: "4px 14px", borderRadius: 999,
          border: `1px solid ${accent}`, color: accent,
          fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase",
          backgroundColor: "rgba(0,0,0,0.28)", backdropFilter: "blur(6px)",
        }}>
          AVAILABLE
        </span>
      </div>

      {/* Bottom content */}
      <div style={{ position: "relative", zIndex: 4, padding: "clamp(1.5rem,3vw,2rem)" }}>
        <p style={{ color: accent, fontSize: "0.68rem", letterSpacing: "0.36em", textTransform: "uppercase", marginBottom: "0.35rem", opacity: 0.82 }}>
          {dragon.ja}
        </p>
        <h2 className="font-heading" style={{
          fontSize: "clamp(2rem,4.5vw,3.2rem)", lineHeight: 0.9, letterSpacing: "0.03em",
          color: "#ffffff", textShadow: "0 2px 24px rgba(0,0,0,0.5)",
          marginBottom: "0.6rem",
        }}>
          {dragon.title}
        </h2>
        <p style={{ color: accent, fontSize: "0.55rem", letterSpacing: "0.24em", marginBottom: "0.85rem" }}>
          {dragon.tagline}
        </p>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: 400 }}>
          {dragon.desc}
        </p>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: "1.25rem" }}>
          <span className="font-heading" style={{ fontSize: "2rem", color: "#ffffff", letterSpacing: "0.02em" }}>
            {price}
          </span>
          <span style={{ color: accent, fontSize: "0.58rem", letterSpacing: "0.22em" }}>DH</span>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href={`/product/${dragon.slug}`}
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              height: 46, padding: "0 22px", borderRadius: 8,
              backgroundColor: accent, color: "#0a0a0a",
              fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600,
              textDecoration: "none",
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
              border: `1px solid ${accent}`, color: "#ffffff",
              fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase",
              backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(6px)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = accent; el.style.color = "#0a0a0a"; }}
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

/* ── Main section ────────────────────────────────────────── */

interface Props {
  images?:   { "black-dragon"?: string | null; "white-dragon"?: string | null };
  prices?:   { "black-dragon"?: string | null; "white-dragon"?: string | null };
  showHero?: boolean;
}

export default function HomeCollection({ images = {}, prices = {}, showHero = false }: Props) {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";

  const [clientImages, setClientImages] = useState<typeof images>({});
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    fetch("https://admin.nakamastore.ma/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ black: product(id:"black-dragon",idType:SLUG){image{sourceUrl}} white: product(id:"white-dragon",idType:SLUG){image{sourceUrl}} }`,
      }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((d) => {
        clearTimeout(timer);
        setClientImages({
          "black-dragon": d?.data?.black?.image?.sourceUrl ?? null,
          "white-dragon": d?.data?.white?.image?.sourceUrl ?? null,
        });
      })
      .catch(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);

  return (
    <section
      id="catalogue"
      style={{
        position: "relative",
        backgroundColor: "var(--bg)",
        padding: showHero
          ? "clamp(5.5rem,10vw,9rem) clamp(1.25rem,4vw,3.5rem) clamp(4rem,8vw,7rem)"
          : "clamp(4rem,8vw,7rem) clamp(1.25rem,4vw,3.5rem)",
      }}
    >
      {/* ── Atmospheric background ── */}
      {showHero && (
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: isBlack
              ? "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(185,154,91,0.10) 0%, transparent 65%)"
              : "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(185,154,91,0.15) 0%, transparent 65%)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
            background: isBlack
              ? "linear-gradient(180deg, transparent, rgba(5,5,5,0.75))"
              : "linear-gradient(180deg, transparent, rgba(247,242,232,0.75))",
          }} />
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "28%",
            background: isBlack
              ? "linear-gradient(90deg, rgba(5,5,5,0.55), transparent)"
              : "linear-gradient(90deg, rgba(247,242,232,0.40), transparent)",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "28%",
            background: isBlack
              ? "linear-gradient(270deg, rgba(5,5,5,0.55), transparent)"
              : "linear-gradient(270deg, rgba(247,242,232,0.40), transparent)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: isBlack
              ? "radial-gradient(ellipse 55% 38% at 20% 65%, rgba(185,154,91,0.035) 0%, transparent 70%), radial-gradient(ellipse 45% 32% at 80% 38%, rgba(120,90,40,0.05) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 50% 50%, rgba(185,154,91,0.025) 0%, transparent 70%)"
              : "radial-gradient(ellipse 55% 38% at 20% 65%, rgba(185,154,91,0.07) 0%, transparent 70%), radial-gradient(ellipse 45% 32% at 80% 38%, rgba(185,154,91,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 50% 50%, rgba(185,154,91,0.05) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
            opacity: isBlack ? 0.045 : 0.03,
            mixBlendMode: "overlay",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: isBlack
              ? "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(5,5,5,0.55) 100%)"
              : "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(247,242,232,0.45) 100%)",
          }} />
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "clamp(2rem,4.5vw,3.5rem)" }}
        >
          {showHero && (
            <p className="arabic-kicker" style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)", marginBottom: "0.4rem" }}>
              مجموعة التنانين
            </p>
          )}
          <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.78, marginBottom: "0.5rem" }}>
            {showHero ? "龍コレクション" : "THE COLLECTION"}
          </p>
          <h2 className="font-heading uppercase" style={{ fontSize: showHero ? "clamp(2.5rem,6vw,5rem)" : "clamp(2rem,4.5vw,3.8rem)", lineHeight: 0.92, letterSpacing: "0.04em", color: "var(--text)" }}>
            {showHero ? "DRAGON\nCOLLECTION" : "TWO DRAGONS"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: "1.2rem" }}>
            <div style={{ height: 1, width: 36, backgroundColor: "var(--gold)", opacity: 0.28 }} />
            <span style={{ color: "var(--gold)", fontSize: "0.45rem", opacity: 0.45 }}>◆</span>
            <div style={{ height: 1, width: 36, backgroundColor: "var(--gold)", opacity: 0.28 }} />
          </div>
          {showHero && (
            <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.8rem,1.4vw,0.92rem)", lineHeight: 1.65, maxWidth: 520, margin: "1.2rem auto 0" }}>
              Premium decorative wooden katanas. Free delivery across Morocco. Cash on delivery.
            </p>
          )}
        </motion.div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))",
          gap: "clamp(1.25rem,2.5vw,2rem)",
          maxWidth: 1160,
          margin: "0 auto",
        }}>
          {DRAGONS.map((dragon, i) => {
            const imageUrl = images[dragon.slug] ?? clientImages[dragon.slug] ?? null;
            const price = prices[dragon.slug] ?? "1,399";
            return (
              <motion.div
                key={dragon.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, ease: "easeOut", delay: i * 0.14 }}
              >
                <HomeCard dragon={dragon} imageUrl={imageUrl} price={price} />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ textAlign: "center", marginTop: "clamp(2.5rem,5vw,3.5rem)" }}
        >
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 transition-all duration-300"
            style={{
              height: 48, padding: "0 28px", borderRadius: 8,
              border: "1px solid rgba(185,154,91,0.4)", color: "var(--gold)",
              fontSize: "0.66rem", letterSpacing: "0.18em", textTransform: "uppercase",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "var(--gold)"; el.style.color = "var(--bg)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "transparent"; el.style.color = "var(--gold)"; }}
          >
            VIEW FULL CATALOGUE <ChevronRight size={12} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
