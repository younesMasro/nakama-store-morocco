"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Maximize2, Plus, Minus, RotateCcw,
  MessageCircle, ChevronRight,
  Truck, Leaf, CreditCard, Phone,
  LayoutGrid, Info, Star, Shield,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */

const CONTENT = {
  "black-dragon": {
    breadcrumb:  "CATALOGUE / BLACK DRAGON",
    ja:          "黒い龍",
    title:       "BLACK\nDRAGON",
    tagline:     "POWER • MYSTERY • SHADOW",
    description: "A decorative wooden katana for bold interiors, collectors, anime fans, and gaming setups.",
    cta:         "ORDER BLACK DRAGON",
  },
  "white-dragon": {
    breadcrumb:  "CATALOGUE / WHITE DRAGON",
    ja:          "白い龍",
    title:       "WHITE\nDRAGON",
    tagline:     "PURE • HONOR • LIGHT",
    description: "A decorative wooden katana for collectors, anime lovers, and refined room decoration.",
    cta:         "ORDER WHITE DRAGON",
  },
} as const;

const THUMB_LABELS = ["FULL VIEW", "TSUBA", "HANDLE", "ENGRAVING", "KASHIRA"];

const FEATURES = [
  { Icon: Leaf,         label: "MATERIAL",  value: "Decorative Wood"       },
  { Icon: Shield,       label: "PURPOSE",   value: "Decoration Only"       },
  { Icon: Truck,        label: "DELIVERY",  value: "Free Across Morocco"   },
  { Icon: CreditCard,   label: "PAYMENT",   value: "No Online Payment"     },
  { Icon: Phone,        label: "ORDER VIA", value: "WhatsApp / Contact"    },
  { Icon: Star,         label: "MODELS",    value: "Black & White Dragon"  },
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

/**
 * Katana silhouette placeholder.
 * TODO: Replace the inner div with:
 *   <img
 *     src="/images/products/black-dragon/full-view-1.png"  (or white-dragon PNG when available)
 *     style={{ height, width: "auto", objectFit: "contain" }}
 *     alt="..."
 *   />
 */
function KatanaPlaceholder({
  isBlack,
  height = "clamp(300px,50svh,510px)",
}: {
  isBlack: boolean;
  height?: string;
}) {
  const g = (a: number) => `rgba(185,154,91,${a})`;
  return (
    <div style={{ position: "relative", width: 80, height }}>
      {/* Vertical body */}
      <div
        style={{
          position: "absolute",
          left: "50%", transform: "translateX(-50%)",
          top: 0, bottom: 0, width: 42,
          borderRadius: "4px 4px 6px 6px",
          background: isBlack
            ? `linear-gradient(180deg,${g(.56)} 0%,${g(.28)} 30%,${g(.36)} 100%)`
            : `linear-gradient(180deg,${g(.84)} 0%,${g(.50)} 30%,${g(.64)} 100%)`,
          boxShadow: isBlack
            ? `0 20px 64px rgba(0,0,0,.62),0 0 20px ${g(.14)}`
            : `0 20px 48px rgba(120,90,40,.26),0 0 24px ${g(.22)}`,
        }}
      >
        {/* Handle cross-wrap lines (top 23%) */}
        {[6,9,12,15,18,21].map((pct) => (
          <div key={pct} aria-hidden style={{
            position: "absolute",
            top: `${pct}%`, left: 4, right: 4, height: 1,
            background: g(isBlack ? .38 : .55),
            transform: `rotate(${pct % 2 === 0 ? 12 : -12}deg)`,
          }} />
        ))}
        {/* Dragon engraving suggestion */}
        <div aria-hidden style={{
          position: "absolute",
          top: "38%", bottom: "20%",
          left: "18%", right: "18%",
          borderLeft: `1px solid ${g(isBlack ? .44 : .62)}`,
          borderRight: `1px solid ${g(isBlack ? .32 : .48)}`,
          transform: "skewX(-5deg)",
          opacity: .85,
        }} />
        <div aria-hidden style={{
          position: "absolute",
          top: "38%", bottom: "20%",
          left: "35%", right: "35%",
          borderLeft: `1px solid ${g(isBlack ? .34 : .50)}`,
          opacity: .6,
        }} />
      </div>
      {/* Tsuba guard at ~23% from top */}
      <div aria-hidden style={{
        position: "absolute",
        top: "23%", left: "50%",
        transform: "translateX(-50%) translateY(-50%)",
        width: 78, height: 14, borderRadius: 999,
        background: `radial-gradient(ellipse at center,${g(isBlack ? .72 : .94)} 0%,${g(isBlack ? .42 : .64)} 100%)`,
        boxShadow: `0 2px 10px ${g(isBlack ? .32 : .42)}`,
      }} />
    </div>
  );
}

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

function SideControls({ glassBg }: { glassBg: string }) {
  return (
    <>
      {([
        [Maximize2, "Expand view"],
        [Plus,      "Zoom in"   ],
        [Minus,     "Zoom out"  ],
        [RotateCcw, "Rotate"    ],
      ] as const).map(([Icon, label]) => (
        <button
          key={label}
          aria-label={label}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "1px solid rgba(185,154,91,.36)",
            backgroundColor: glassBg,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "var(--gold)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all .3s ease", flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "var(--gold)";
            el.style.backgroundColor = "rgba(185,154,91,.16)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(185,154,91,.36)";
            el.style.backgroundColor = glassBg;
          }}
        >
          <Icon size={14} strokeWidth={1.5} />
        </button>
      ))}
    </>
  );
}

function DragPill({ glassBg }: { glassBg: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      height: 44, padding: "0 20px", borderRadius: 999,
      border: "1px solid rgba(185,154,91,.40)",
      backgroundColor: glassBg,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: "var(--text-muted)",
      fontSize: ".6rem", letterSpacing: ".22em",
      textTransform: "uppercase" as const,
      whiteSpace: "nowrap" as const,
      cursor: "default",
    }}>
      <span style={{ fontSize: "1rem", lineHeight: 1 }}>☞</span>
      DRAG TO ROTATE
    </div>
  );
}

function InteractiveLabel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <p style={{ fontSize: ".8rem", letterSpacing: ".06em", color: "var(--gold)", opacity: .82, lineHeight: 1 }}>
        360°
      </p>
      <p style={{ fontSize: ".5rem", letterSpacing: ".28em", textTransform: "uppercase", color: "var(--text-muted)", opacity: .62, lineHeight: 1 }}>
        INTERACTIVE VIEW
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */

export default function HeroSection() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const c = CONTENT[theme];
  const [activeThumb, setActiveThumb] = useState(0);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212XXXXXXXXX";
  const whatsappHref   = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

  const glassBg  = isBlack ? "rgba(5,5,5,.52)"         : "rgba(247,242,232,.62)";
  const textShadow = isBlack ? "0 2px 20px rgba(0,0,0,.85)" : "0 1px 12px rgba(247,242,232,.6)";

  const mobileOverlay = isBlack
    ? "linear-gradient(180deg,rgba(5,5,5,.20) 0%,rgba(5,5,5,.55) 45%,rgba(5,5,5,.96) 100%)"
    : "linear-gradient(180deg,rgba(247,242,232,.15) 0%,rgba(247,242,232,.35) 42%,rgba(247,242,232,.90) 100%)";

  const desktopOverlay = isBlack
    ? "linear-gradient(90deg,rgba(5,5,5,.92) 0%,rgba(5,5,5,.62) 32%,rgba(5,5,5,.20) 68%,rgba(5,5,5,.05) 100%)"
    : "linear-gradient(90deg,rgba(247,242,232,.88) 0%,rgba(247,242,232,.52) 32%,rgba(247,242,232,.10) 68%,rgba(247,242,232,.00) 100%)";

  const featureBg = isBlack ? "rgba(17,17,17,.82)" : "rgba(239,230,215,.65)";

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
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
          </picture>
        </div>
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ opacity: isBlack ? 0 : 1, transition: "opacity .75s ease", zIndex: 0 }}>
          <picture style={{ display: "block", position: "absolute", inset: 0 }}>
            <source media="(min-width:768px)" srcSet="/images/hero/hero-white-desktop.png" />
            <img src="/images/hero/hero-white-mobile.png" alt="" fetchPriority="high"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
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
              style={{ top: 12, left: 20, maxWidth: "clamp(180px,60vw,240px)" }}
            >
              <motion.p variants={fadeUp}
                className="text-[.88rem] tracking-[.45em] mb-1"
                style={{ color: "var(--gold)", textShadow }}
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
            </motion.div>

            {/* Product zone — centered, leaves room at bottom for pill/label */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ paddingBottom: 108 }}
            >
              <motion.div
                key={`mob-prod-${theme}`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: .3 }}
                className="flex flex-col items-center"
              >
                <KatanaPlaceholder isBlack={isBlack} />
                <div style={{ marginTop: -12 }}>
                  <PlatformRings isBlack={isBlack} />
                </div>
              </motion.div>
            </div>

            {/* Side controls — absolute right, vertically centered */}
            <div
              className="absolute z-30 flex flex-col gap-3"
              style={{ right: 14, top: "50%", transform: "translateY(-50%)" }}
            >
              <SideControls glassBg={glassBg} />
            </div>

            {/* Drag-to-rotate pill */}
            <div
              className="absolute z-30"
              style={{ bottom: 58, left: "50%", transform: "translateX(-50%)" }}
            >
              <DragPill glassBg={glassBg} />
            </div>

            {/* 360° label */}
            <div
              className="absolute z-30"
              style={{ bottom: 14, left: "50%", transform: "translateX(-50%)" }}
            >
              <InteractiveLabel />
            </div>

          </div>

          {/* ─────────────────────────────────────────
              DESKTOP LAYOUT  (hidden below md)
          ───────────────────────────────────────── */}
          <div
            className="hidden md:grid"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr",
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
              }}
            >
              <motion.p variants={fadeUp}
                className="text-[.9rem] tracking-[.45em]"
                style={{ color: "var(--gold)", textShadow }}
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
              <motion.p variants={fadeUp}
                className="text-[.58rem] tracking-[.14em] uppercase"
                style={{ color: "var(--text-muted)", opacity: .5 }}
              >
                MADE OF WOOD · FOR DECORATION ONLY
              </motion.p>
            </motion.div>

            {/* Center: Product stage — full column height for absolute positioning */}
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
                <KatanaPlaceholder isBlack={isBlack} height="clamp(400px,68vh,700px)" />
                <div style={{ marginTop: -12 }}>
                  <PlatformRings isBlack={isBlack} />
                </div>
              </motion.div>

              {/* Drag pill + label inline below product */}
              <div style={{ height: 28 }} />
              <DragPill glassBg={glassBg} />
              <div style={{ height: 10 }} />
              <InteractiveLabel />
            </div>

            {/* Right: Side controls */}
            <div
              className="flex flex-col gap-4"
              style={{ paddingLeft: 32, alignSelf: "center" }}
            >
              <SideControls glassBg={glassBg} />
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THUMBNAIL CAROUSEL
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="thumbnails"
        className="relative z-10 px-5 md:px-10 pt-6 pb-4"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div
          className="flex gap-3 overflow-x-auto pb-1 scrollbar-none md:gap-4"
        >
          {THUMB_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveThumb(i)}
              className="flex-shrink-0 flex flex-col items-center gap-2 transition-all duration-300"
            >
              {/* Thumbnail placeholder box
                  TODO: Replace inner div with:
                  <img src={`/images/products/black-dragon/${label.toLowerCase().replace(" ","-")}.png`}
                       style={{ width:80, height:106, objectFit:"cover", borderRadius:10 }} />
              */}
              <div style={{
                width: 80, height: 106, borderRadius: 10,
                border: activeThumb === i
                  ? "1.5px solid var(--gold)"
                  : "1px solid rgba(185,154,91,.22)",
                backgroundColor: isBlack ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .3s ease",
              }}>
                <div style={{
                  width: 26, height: 70, borderRadius: 3,
                  background: `rgba(185,154,91,${activeThumb === i
                    ? (isBlack ? .55 : .78)
                    : (isBlack ? .22 : .38)})`,
                  transition: "background .3s",
                }} />
              </div>
              <span
                className="text-[.52rem] tracking-[.22em] uppercase"
                style={{
                  color: activeThumb === i ? "var(--gold)" : "var(--text-muted)",
                  transition: "color .3s",
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES CARD + ORDER BUTTONS
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="features"
        className="relative z-10 px-5 md:px-10 pb-32 md:pb-16"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div
          className="rounded-2xl p-5 md:p-8"
          style={{
            border: "1px solid rgba(185,154,91,.22)",
            backgroundColor: featureBg,
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Heading */}
          <p
            className="text-center text-[.62rem] tracking-[.3em] uppercase mb-5"
            style={{ color: "var(--gold)" }}
          >
            FEATURES
          </p>

          {/* 2-col on mobile, 3-col on desktop */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3">
            {FEATURES.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div style={{
                  width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                  border: "1px solid rgba(185,154,91,.28)",
                  backgroundColor: isBlack ? "rgba(185,154,91,.08)" : "rgba(185,154,91,.14)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 2,
                }}>
                  <Icon size={13} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p className="text-[.58rem] tracking-[.18em] uppercase font-medium"
                    style={{ color: "var(--gold)", opacity: .88 }}>
                    {label}
                  </p>
                  <p className="text-[.78rem] leading-snug mt-0.5"
                    style={{ color: "var(--text-muted)" }}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-5 h-px" style={{ backgroundColor: "rgba(185,154,91,.18)" }} />

          {/* Safety note */}
          <p className="text-center text-[.56rem] tracking-[.14em] uppercase mb-4"
            style={{ color: "var(--text-muted)", opacity: .5 }}>
            MADE OF WOOD · FOR DECORATION ONLY · NOT FOR COMBAT USE
          </p>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-1.5 mb-5">
            <span className="font-heading" style={{
              fontSize: "2.1rem", letterSpacing: ".02em", color: "var(--text)",
            }}>
              1,399
            </span>
            <span className="text-[.6rem] tracking-[.2em] uppercase" style={{ color: "var(--gold)" }}>
              DH
            </span>
          </div>

          {/* Order buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="#order"
              className="flex flex-1 items-center justify-center gap-1.5 uppercase tracking-[.16em] text-[.68rem] font-medium transition-all duration-300"
              style={{
                height: 52, borderRadius: 6,
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--gold)";
                el.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "transparent";
                el.style.color = "var(--gold)";
              }}
            >
              {c.cta}
              <ChevronRight size={13} strokeWidth={1.5} />
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 uppercase tracking-[.16em] text-[.68rem] transition-all duration-300"
              style={{
                height: 52, borderRadius: 6,
                backgroundColor: "var(--gold)",
                color: "var(--bg)",
                border: "1px solid var(--gold)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
            >
              <MessageCircle size={13} />
              ORDER ON WHATSAPP
            </a>
          </div>

          {/* Theme toggle */}
          <div className="flex flex-col items-center gap-1.5 mt-5">
            <p className="text-[.52rem] tracking-[.28em] uppercase"
              style={{ color: "var(--text-muted)", opacity: .45 }}>
              SWITCH THEME
            </p>
            <ThemeToggle />
          </div>

        </div>
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
            [LayoutGrid, "Catalogue", "#catalogue"],
            [Info,       "About",     "#about"    ],
            [Star,       "Quality",   "#quality"  ],
            [Phone,      "Contact",   "#contact"  ],
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
