"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Eye, EyeOff, Plus, Minus, Share2,
  Truck, Leaf, Award, Phone,
  LayoutGrid, Info, Star, Shield, Ruler,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */

const CONTENT = {
  "black-dragon": {
    breadcrumb:  "CATALOGUE / BLACK DRAGON",
    ar:          "التنين الأسود",
    ja:          "黒い龍",
    title:       "BLACK\nDRAGON",
    tagline:     "POWER • MYSTERY • SHADOW",
    description: "A decorative wooden katana created for bold interiors, collectors, anime fans, and gaming setups. Dark, mysterious, and made to stand out.",
    cta:         "ORDER BLACK DRAGON",
  },
  "white-dragon": {
    breadcrumb:  "CATALOGUE / WHITE DRAGON",
    ar:          "التنين الأبيض",
    ja:          "白い龍",
    title:       "WHITE\nDRAGON",
    tagline:     "PURE • HONOR • LIGHT",
    description: "A decorative wooden katana designed with a clean, elegant, and premium aesthetic. Made for collectors, anime lovers, and refined room decoration.",
    cta:         "ORDER WHITE DRAGON",
  },
} as const;

const FEATURES = [
  { Icon: Leaf,   label: "MATERIAL", value: "Decorative Wood"  },
  { Icon: Shield, label: "PURPOSE",  value: "Display Only"     },
  { Icon: Ruler,  label: "LENGTH",   value: "103 cm"           },
  { Icon: Star,   label: "FINISH",   value: "Lacquered Detail" },
  { Icon: Award,  label: "EDITION",  value: "Black Dragon"     },
  { Icon: Truck,  label: "DELIVERY", value: "Across Morocco"   },
];

/* ═══════════════════════════════════════════════════════════
   ANIMATION
═══════════════════════════════════════════════════════════ */

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════ */

function PlatformRings({ isBlack }: { isBlack: boolean }) {
  void isBlack;
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "clamp(180px,40vw,320px)",
        height: "clamp(54px,8vw,88px)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute",
          inset: `${i * 14}px ${i * 22}px`,
          borderRadius: "50%",
          border: `1px solid rgba(185,154,91,${.24 - i * .06})`,
          background: i === 0
            ? "radial-gradient(ellipse at center,rgba(185,154,91,.10) 0%,transparent 65%)"
            : "none",
        }} />
      ))}
    </div>
  );
}

function SideControls({
  glassBg, onFocus, onZoomIn, onZoomOut, onShare, isFocusMode,
}: {
  glassBg: string;
  onFocus:     () => void;
  onZoomIn:    () => void;
  onZoomOut:   () => void;
  onShare:     () => void;
  isFocusMode: boolean;
}) {
  const FocusIcon = isFocusMode ? EyeOff : Eye;
  const buttons = [
    { Icon: FocusIcon, label: "Focus view", handler: onFocus,   active: isFocusMode },
    { Icon: Plus,      label: "Zoom in",    handler: onZoomIn,  active: false       },
    { Icon: Minus,     label: "Zoom out",   handler: onZoomOut, active: false       },
    { Icon: Share2,    label: "Share",      handler: onShare,   active: false       },
  ];
  return (
    <>
      {buttons.map(({ Icon, label, handler, active }) => (
        <button
          key={label}
          aria-label={label}
          onClick={handler}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            border: `1px solid ${active ? "var(--gold)" : "rgba(185,154,91,.36)"}`,
            backgroundColor: active ? "rgba(185,154,91,.18)" : glassBg,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "var(--gold)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all .3s ease", flexShrink: 0,
            touchAction: "manipulation", pointerEvents: "auto", position: "relative",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "var(--gold)";
            el.style.backgroundColor = "rgba(185,154,91,.18)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = active ? "var(--gold)" : "rgba(185,154,91,.36)";
            el.style.backgroundColor = active ? "rgba(185,154,91,.18)" : glassBg;
          }}
        >
          <Icon size={14} strokeWidth={1.5} />
        </button>
      ))}
    </>
  );
}


/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */

export default function HeroSection({
  heroImageUrl = null,
  heroWhiteImageUrl = null,
}: {
  heroImageUrl?: string | null;
  heroWhiteImageUrl?: string | null;
}) {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const c = CONTENT[theme];

  // Client-side fallback: fetch images directly from the browser so Hostinger's
  // server-to-server block on admin.nakamastore.ma doesn't prevent images from loading.
  const [clientImages, setClientImages] = useState<{ black: string | null; white: string | null }>({ black: null, white: null });
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
          black: d?.data?.black?.image?.sourceUrl ?? null,
          white: d?.data?.white?.image?.sourceUrl ?? null,
        });
      })
      .catch(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);

  const currentImageUrl = isBlack
    ? (heroImageUrl ?? clientImages.black)
    : (heroWhiteImageUrl ?? clientImages.white);
  const [zoom, setZoom]               = useState(1.0);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const zoomIn      = () => setZoom((z) => Math.min(+(z + 0.15).toFixed(2), 1.6));
  const zoomOut     = () => setZoom((z) => Math.max(+(z - 0.15).toFixed(2), 0.7));
  const toggleFocus = () => setIsFocusMode((f) => !f);
  const onShare     = async () => {
    const url = `${window.location.origin}/product/${theme}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Nakama Store Morocco", text: c.title.replace("\n", " "), url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch { /* user cancelled */ }
  };

  const glassBg  = isBlack ? "rgba(5,5,5,.52)"         : "rgba(247,242,232,.62)";
  const textShadow = isBlack ? "0 2px 20px rgba(0,0,0,.85)" : "0 1px 12px rgba(247,242,232,.6)";

  const mobileOverlay = isBlack
    ? "linear-gradient(180deg,rgba(8,8,8,.14) 0%,rgba(8,8,8,.38) 50%,rgba(8,8,8,.82) 100%)"
    : "linear-gradient(180deg,rgba(248,243,235,.12) 0%,rgba(248,243,235,.32) 50%,rgba(248,243,235,.80) 100%)";

  const desktopOverlay = isBlack
    ? "linear-gradient(90deg,rgba(8,8,8,.82) 0%,rgba(8,8,8,.46) 38%,rgba(8,8,8,.12) 100%)"
    : "linear-gradient(90deg,rgba(248,243,235,.72) 0%,rgba(248,243,235,.36) 38%,rgba(248,243,235,.06) 100%)";

  return (
    <div style={{ backgroundColor: "var(--bg)" }}>

      {/* ═══════════════════════════════════════════════════════════
          HERO STAGE
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="hero-stage"
        className="relative overflow-hidden"
        style={{ minHeight: "100svh" }}
      >

        {/* Background images */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ opacity: isBlack ? 1 : 0, transition: "opacity .75s ease", zIndex: 0 }}>
          <picture style={{ display: "block", position: "absolute", inset: 0 }}>
            <source media="(min-width:768px)" srcSet="/images/hero/hero-black-desktop.png" />
            <img src="/images/hero/hero-black-mobile.png" alt="" fetchPriority="high"
              className="hero-bg-img"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </picture>
        </div>
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ opacity: isBlack ? 0 : 1, transition: "opacity .75s ease", zIndex: 0 }}>
          <picture style={{ display: "block", position: "absolute", inset: 0 }}>
            <source media="(min-width:768px)" srcSet="/images/hero/hero-white-desktop.png" />
            <img src="/images/hero/hero-white-mobile.png" alt="" fetchPriority="high"
              className="hero-bg-img"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </picture>
        </div>

        {/* Overlays */}
        <div aria-hidden className="absolute inset-0 pointer-events-none md:hidden"
          style={{ zIndex: 1, background: mobileOverlay, transition: "background .6s ease" }} />
        <div aria-hidden className="absolute inset-0 pointer-events-none hidden md:block"
          style={{ zIndex: 1, background: desktopOverlay, transition: "background .6s ease" }} />

        {/* Content layer */}
        <div className="relative" style={{ zIndex: 10, minHeight: "100svh", paddingTop: "76px" }}>

          {/* Breadcrumb */}
          <div className="px-5 md:px-10 pt-3" style={{ height: 36 }}>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: .6, delay: .1 }}
              className="text-[.58rem] tracking-[.28em] uppercase"
              style={{ color: "var(--gold)", opacity: .78 }}
            >
              {c.breadcrumb}
            </motion.p>
          </div>

          {/* ─────────────────────────────────────────
              MOBILE LAYOUT  (hidden on md+)
          ───────────────────────────────────────── */}
          <div
            className="relative md:hidden"
            style={{ height: "calc(100svh - 76px - 36px)" }}
          >

            {/* Intro copy — absolute upper-left, overlaps product */}
            <motion.div
              key={`mob-intro-${theme}`}
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="absolute z-20"
              style={{ top: 12, left: 20, maxWidth: "min(52vw, 220px)", textAlign: "left", opacity: isFocusMode ? 0 : 1, pointerEvents: isFocusMode ? "none" : "auto", transition: "opacity 0.4s ease" }}
            >
              {/* Arabic decorative label */}
              <motion.p variants={fadeUp}
                className="arabic-kicker"
                style={{ fontSize: "clamp(1.15rem,5vw,1.55rem)", marginBottom: "0.25rem", textShadow }}
              >
                {c.ar}
              </motion.p>
              {/* Japanese label */}
              <motion.p variants={fadeUp}
                className="text-[.72rem] tracking-[.32em] mb-1"
                style={{ color: "var(--gold)", opacity: 0.72, textShadow }}
              >
                {c.ja}
              </motion.p>
              <motion.h1 variants={fadeUp}
                className="font-heading uppercase whitespace-pre-line mb-2"
                style={{
                  fontSize: "clamp(2.6rem,12vw,4rem)",
                  lineHeight: .91, letterSpacing: ".02em",
                  color: "var(--text)", textShadow,
                }}
              >
                {c.title}
              </motion.h1>
              <motion.div variants={fadeUp}>
                <div className="w-7 h-px mb-2" style={{ backgroundColor: "var(--gold)", opacity: .55 }} />
              </motion.div>
              <motion.p variants={fadeUp}
                className="text-[.56rem] tracking-[.2em] uppercase mb-2"
                style={{ color: "var(--gold)" }}
              >
                {c.tagline}
              </motion.p>
              <motion.p variants={fadeUp}
                className="text-[.74rem] leading-snug"
                style={{ color: "var(--text-muted)", textShadow }}
              >
                {c.description}
              </motion.p>
              <motion.div variants={fadeUp} style={{ marginTop: "0.75rem" }}>
                <Link
                  href={`/product/${theme}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "7px 14px", borderRadius: 6,
                    border: "1px solid rgba(185,154,91,0.50)",
                    color: "var(--gold)",
                    fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase",
                    backgroundColor: "rgba(185,154,91,0.08)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  GET YOURS →
                </Link>
              </motion.div>
            </motion.div>

            {/* Product zone — centered, pointer-events-none so controls receive touches */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ paddingBottom: 64, pointerEvents: "none" }}
            >
              <motion.div
                key={`mob-prod-${theme}`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: .3 }}
                className="flex flex-col items-center"
              >
                {currentImageUrl && (
                  <motion.img
                    key={`mob-img-${theme}`}
                    src={currentImageUrl}
                    alt={`${c.title.replace("\n", " ")} Katana`}
                    fetchPriority="high"
                    animate={{ scale: zoom }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{
                      height: "clamp(360px, 58svh, 620px)",
                      width: "auto",
                      maxWidth: "min(62vw, 320px)",
                      objectFit: "contain",
                      display: "block",
                      filter: isBlack
                        ? "drop-shadow(0 28px 64px rgba(0,0,0,0.68)) drop-shadow(0 0 22px rgba(185,154,91,0.12))"
                        : "drop-shadow(0 28px 60px rgba(95,65,30,0.24)) drop-shadow(0 0 26px rgba(185,154,91,0.18))",
                    }}
                  />
                )}
                <div style={{ marginTop: currentImageUrl ? -12 : 0 }}>
                  <PlatformRings isBlack={isBlack} />
                </div>
              </motion.div>
            </div>

            {/* Side controls — absolute right, vertically centered */}
            <div
              className="absolute flex flex-col gap-3"
              style={{ right: 14, top: "50%", transform: "translateY(-50%)", zIndex: 50, isolation: "isolate" }}
            >
              <SideControls
                glassBg={glassBg}
                onFocus={toggleFocus}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onShare={onShare}
                isFocusMode={isFocusMode}
              />
            </div>

          </div>

          {/* ─────────────────────────────────────────
              DESKTOP LAYOUT  (hidden below md)
          ───────────────────────────────────────── */}
          <div
            className="hidden md:grid"
            style={{
              gridTemplateColumns: "minmax(280px,0.85fr) minmax(360px,1fr) minmax(300px,0.9fr)",
              height: "calc(100svh - 76px - 36px)",
              alignItems: "center",
            }}
          >

            {/* Left: Intro copy */}
            <motion.div
              key={`desk-intro-${theme}`}
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4"
              style={{
                paddingLeft: "clamp(40px,6vw,88px)",
                paddingRight: 24,
                alignSelf: "center",
                opacity: isFocusMode ? 0 : 1,
                pointerEvents: isFocusMode ? "none" : "auto",
                transition: "opacity 0.4s ease",
              }}
            >
              {/* Arabic decorative label */}
              <motion.p variants={fadeUp}
                className="arabic-kicker"
                style={{ fontSize: "clamp(1.25rem,2vw,1.9rem)", marginBottom: "-0.5rem", textShadow }}
              >
                {c.ar}
              </motion.p>
              {/* Japanese label */}
              <motion.p variants={fadeUp}
                className="text-[.78rem] tracking-[.38em]"
                style={{ color: "var(--gold)", opacity: 0.68, textShadow }}
              >
                {c.ja}
              </motion.p>
              <motion.h1 variants={fadeUp}
                className="font-heading uppercase whitespace-pre-line"
                style={{
                  fontSize: "clamp(3.2rem,6vw,6.5rem)",
                  lineHeight: .91, letterSpacing: ".02em",
                  color: "var(--text)", textShadow,
                }}
              >
                {c.title}
              </motion.h1>
              <motion.div variants={fadeUp}>
                <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)", opacity: .55 }} />
              </motion.div>
              <motion.p variants={fadeUp}
                className="text-[.62rem] tracking-[.22em] uppercase"
                style={{ color: "var(--gold)" }}
              >
                {c.tagline}
              </motion.p>
              <motion.div variants={fadeUp} className="flex items-center gap-2">
                <div className="h-px w-5" style={{ backgroundColor: "var(--gold)", opacity: .35 }} />
                <span style={{ fontSize: ".4rem", color: "var(--gold)", opacity: .6 }}>◆</span>
                <div className="h-px w-5" style={{ backgroundColor: "var(--gold)", opacity: .35 }} />
              </motion.div>
              <motion.p variants={fadeUp}
                className="text-sm leading-relaxed max-w-[360px]"
                style={{ color: "var(--text-muted)", textShadow }}
              >
                {c.description}
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  href={`/product/${theme}`}
                  className="inline-flex items-center gap-2 transition-all duration-300"
                  style={{
                    height: 44, padding: "0 24px", borderRadius: 8,
                    border: "1px solid rgba(185,154,91,0.50)",
                    color: "var(--gold)",
                    fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase",
                    backgroundColor: "rgba(185,154,91,0.08)",
                    backdropFilter: "blur(6px)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = "rgba(185,154,91,0.20)";
                    el.style.borderColor = "rgba(185,154,91,0.80)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = "rgba(185,154,91,0.08)";
                    el.style.borderColor = "rgba(185,154,91,0.50)";
                  }}
                >
                  GET YOURS →
                </Link>
              </motion.div>
              <motion.p variants={fadeUp}
                className="text-[.58rem] tracking-[.14em] uppercase"
                style={{ color: "var(--text-muted)", opacity: .5 }}
              >
                MADE OF WOOD · FOR DECORATION ONLY
              </motion.p>
            </motion.div>

            {/* Center: Product stage */}
            <div
              className="flex flex-col items-center justify-center"
              style={{ alignSelf: "stretch", position: "relative" }}
            >
              <motion.div
                key={`desk-prod-${theme}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: .35 }}
                className="flex flex-col items-center"
              >
                {currentImageUrl && (
                  <motion.img
                    key={`desk-img-${theme}`}
                    src={currentImageUrl}
                    alt={`${c.title.replace("\n", " ")} Katana`}
                    fetchPriority="high"
                    animate={{ scale: zoom }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{
                      height: "clamp(480px, 74vh, 820px)",
                      width: "auto",
                      maxWidth: "min(44vw, 560px)",
                      objectFit: "contain",
                      display: "block",
                      transformOrigin: "center center",
                      filter: isBlack
                        ? "drop-shadow(0 36px 80px rgba(0,0,0,0.68)) drop-shadow(0 0 32px rgba(185,154,91,0.13))"
                        : "drop-shadow(0 28px 60px rgba(95,65,30,0.24)) drop-shadow(0 0 26px rgba(185,154,91,0.18))",
                    }}
                  />
                )}
                <div style={{ marginTop: currentImageUrl ? -12 : 0 }}>
                  <PlatformRings isBlack={isBlack} />
                </div>
              </motion.div>
            </div>

            {/* Right: Interactive discovery panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.4 }}
              style={{
                paddingLeft: 24,
                paddingRight: "clamp(24px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "1.4rem",
                alignSelf: "center",
              }}
            >
              {/* View controls — always visible */}
              <div>
                <p style={{ color: "var(--gold)", fontSize: "0.46rem", letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.75rem" }}>
                  VIEW CONTROLS
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <SideControls
                    glassBg={glassBg}
                    onFocus={toggleFocus}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onShare={onShare}
                    isFocusMode={isFocusMode}
                  />
                </div>
              </div>

              {/* Everything below fades out in focus mode */}
              <div style={{
                opacity: isFocusMode ? 0 : 1,
                pointerEvents: isFocusMode ? "none" : "auto",
                transition: "opacity 0.4s ease",
                display: "flex",
                flexDirection: "column",
                gap: "1.4rem",
              }}>
                {/* Divider */}
                <div style={{ height: 1, backgroundColor: "rgba(185,154,91,0.16)" }} />

                {/* Price */}
                <div>
                  <p style={{ color: "var(--gold)", fontSize: "0.46rem", letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.65, marginBottom: "0.35rem" }}>
                    STARTING FROM
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span className="font-heading" style={{ fontSize: "2.4rem", color: "var(--text)", lineHeight: 1 }}>1,399</span>
                    <span style={{ color: "var(--gold)", fontSize: "0.58rem", letterSpacing: "0.22em" }}>DH</span>
                  </div>
                </div>

                {/* Key specs bullets */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "103 cm · Decorative Wood",
                    "Free delivery · All Morocco",
                    "Cash on delivery",
                  ].map((spec) => (
                    <div key={spec} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "var(--gold)", opacity: 0.55, flexShrink: 0 }} />
                      <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", lineHeight: 1.4 }}>{spec}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/product/${theme}`}
                  className="inline-flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    height: 44, padding: "0 20px", borderRadius: 8,
                    backgroundColor: "var(--gold)", color: "var(--bg)",
                    fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
                >
                  GET YOURS →
                </Link>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SPECIFICATIONS STRIP
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="features"
        className="relative z-10 pb-24 md:pb-12"
        style={{ backgroundColor: "var(--bg)" }}
      >
        {/* Top rule */}
        <div style={{ height: 1, backgroundColor: "rgba(185,154,91,0.18)" }} />

        <div className="px-5 md:px-10 pt-7 pb-8">
          {/* Section label */}
          <p
            className="text-center text-[.48rem] tracking-[.42em] uppercase mb-8"
            style={{ color: "var(--gold)", opacity: 0.58, letterSpacing: "0.42em" }}
          >
            SPECIFICATIONS
          </p>

          {/* Feature grid — 2 col mobile → 3 col md → 6 col lg */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
            style={{ gap: 0 }}
          >
            {FEATURES.map(({ Icon, label, value }, i) => (
              <div
                key={label}
                className="flex flex-col items-center text-center"
                style={{
                  padding: "clamp(1rem,2vw,1.4rem) clamp(0.5rem,1.5vw,1rem)",
                  borderRight: "1px solid rgba(185,154,91,0.11)",
                  borderBottom: "1px solid rgba(185,154,91,0.11)",
                }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: 40, height: 40, borderRadius: "50%",
                    border: "1px solid rgba(185,154,91,0.28)",
                    background: isBlack
                      ? "radial-gradient(circle at center, rgba(185,154,91,0.10) 0%, transparent 70%)"
                      : "radial-gradient(circle at center, rgba(185,154,91,0.16) 0%, transparent 70%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "0.65rem",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                </div>

                {/* Label */}
                <p style={{
                  color: "var(--gold)",
                  fontSize: "0.46rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  opacity: 0.72,
                  marginBottom: "0.3rem",
                  lineHeight: 1,
                }}>
                  {label}
                </p>

                {/* Value */}
                <p style={{
                  color: "var(--text-muted)",
                  fontSize: "0.78rem",
                  lineHeight: 1.25,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom rule + footnote */}
        <div style={{ height: 1, backgroundColor: "rgba(185,154,91,0.12)" }} />
        <p
          className="text-center text-[.46rem] tracking-[.18em] uppercase mt-4"
          style={{ color: "var(--text-muted)", opacity: 0.38 }}
        >
          MADE OF WOOD · FOR DECORATION ONLY
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FIXED BOTTOM NAVIGATION  (mobile only)
      ═══════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          backgroundColor: isBlack ? "rgba(5,5,5,.90)" : "rgba(247,242,232,.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(185,154,91,.18)",
          paddingBottom: "env(safe-area-inset-bottom,0px)",
          transition: "background-color .4s ease",
        }}
      >
        <div className="flex">
          {([
            [LayoutGrid, "Catalogue", "/catalogue"],
            [Info,       "About",     "/about"    ],
            [Star,       "Quality",   "/quality"  ],
            [Phone,      "Contact",   "/contact"  ],
          ] as const).map(([Icon, label, href]) => (
            <Link
              key={label}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-300"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <Icon size={17} strokeWidth={1.5} />
              <span className="text-[.48rem] tracking-[.18em] uppercase">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

    </div>
  );
}
