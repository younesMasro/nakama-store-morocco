"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Eye, EyeOff, Plus, Minus, Share2,
  ChevronLeft, ChevronRight,
  Phone, LayoutGrid, Info, Star,
  Shield, Ruler, Package, Truck, ShoppingCart, Check,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCart } from "@/components/providers/CartProvider";
import { PageShell } from "@/components/shared/PageShell";
import type { WCProduct } from "@/lib/woocommerce";
import { stripHtml, formatPrice } from "@/lib/woocommerce";

/* ─── animation ────────────────────────────────────────── */
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

/* ─── static copy ──────────────────────────────────────── */
const STATIC = {
  "black-dragon": {
    breadcrumb:  "CATALOGUE / BLACK DRAGON",
    ar:          "التنين الأسود",
    ja:          "黒い龍",
    title:       "BLACK\nDRAGON",
    tagline:     "POWER • MYSTERY • SHADOW",
    description: "A decorative wooden katana created for bold interiors, collectors, anime fans, and gaming setups. Dark, mysterious, and made to stand out.",
    bgKey:       "black" as const,
  },
  "white-dragon": {
    breadcrumb:  "CATALOGUE / WHITE DRAGON",
    ar:          "التنين الأبيض",
    ja:          "白い龍",
    title:       "WHITE\nDRAGON",
    tagline:     "PURE • HONOR • LIGHT",
    description: "A decorative wooden katana designed with a clean, elegant, and premium aesthetic. Made for collectors, anime lovers, and refined room decoration.",
    bgKey:       "white" as const,
  },
} as const;
type ValidSlug = keyof typeof STATIC;

/* ─── thumbnail labels ─────────────────────────────────── */
const THUMB_LABELS = ["FULL VIEW", "HANDLE", "SCABBARD (SAYA)", "ENGRAVING", "KASHIRA"];

/* ─── specifications ───────────────────────────────────── */
const SPECS = [
  { Icon: Shield,  label: "PURPOSE",   value: "Display Only"     },
  { Icon: Ruler,   label: "LENGTH",    value: "103 cm"           },
  { Icon: Star,    label: "FINISH",    value: "Lacquered Detail" },
  { Icon: Package, label: "PACKAGING", value: "Secure & Premium" },
  { Icon: Truck,   label: "DELIVERY",  value: "Across Morocco"   },
];

/* ─── PlatformRings ────────────────────────────────────── */
function PlatformRings() {
  return (
    <div aria-hidden style={{ position: "relative", width: "clamp(180px,36vw,300px)", height: "clamp(50px,7vw,82px)", display: "none" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute",
          inset: `${i * 13}px ${i * 20}px`,
          borderRadius: "50%",
          border: `1px solid rgba(185,154,91,${.24 - i * .06})`,
          background: i === 0 ? "radial-gradient(ellipse at center,rgba(185,154,91,.10) 0%,transparent 65%)" : "none",
        }} />
      ))}
    </div>
  );
}

/* ─── ControlBtn ───────────────────────────────────────── */
function ControlBtn({
  Icon, label, handler, active, glassBg,
}: {
  Icon: React.ElementType; label: string; handler: () => void; active: boolean; glassBg: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={handler}
      style={{
        width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
        border: `1px solid ${active ? "var(--gold)" : "rgba(185,154,91,.36)"}`,
        backgroundColor: active ? "rgba(185,154,91,.18)" : glassBg,
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all .3s ease",
        touchAction: "manipulation", pointerEvents: "auto", position: "relative",
      }}
      onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.backgroundColor = "rgba(185,154,91,.18)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = active ? "var(--gold)" : "rgba(185,154,91,.36)"; el.style.backgroundColor = active ? "rgba(185,154,91,.18)" : glassBg; }}
    >
      <Icon size={14} strokeWidth={1.5} />
    </button>
  );
}

/* ─── Component ────────────────────────────────────────── */
interface Props { slug: string; wcProduct: WCProduct | null; }

export default function ProductPageClient({ slug, wcProduct }: Props) {
  const { setTheme } = useTheme();
  const { addToCart } = useCart();
  const st = STATIC[slug as ValidSlug] ?? STATIC["black-dragon"];
  const isBlack = st.bgKey === "black";

  const [activeThumb, setActiveThumb]     = useState(-1);
  const [zoom, setZoom]                   = useState(1.0);
  const [isFocusMode, setIsFocusMode]     = useState(false);
  const [cartAdded, setCartAdded]         = useState(false);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const thumbScrollRef = useRef<HTMLDivElement>(null);

  const checkThumbScroll = useCallback(() => {
    const el = thumbScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollThumbs = (dir: "left" | "right") => {
    thumbScrollRef.current?.scrollBy({ left: dir === "right" ? 110 : -110, behavior: "smooth" });
  };

  /* Thumbnail click: select image + hide description + scroll hero into view */
  function handleThumbnailClick(index: number) {
    setActiveThumb(index);
    setIsFocusMode(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleAddToCart() {
    const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 1399;
    addToCart({
      slug,
      name:    productName,
      nameAr:  st.ar,
      nameJa:  st.ja,
      price:   priceNum,
      image:   wcProduct?.image?.sourceUrl ?? null,
    });
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  }

  const zoomIn      = () => setZoom((z) => Math.min(+(z + 0.15).toFixed(2), 1.7));
  const zoomOut     = () => setZoom((z) => Math.max(+(z - 0.15).toFixed(2), 0.65));
  const toggleFocus = () => setIsFocusMode((f) => !f);
  const onShare     = async () => {
    const url = `${window.location.origin}/product/${slug}`;
    try {
      if (navigator.share) await navigator.share({ title: "Nakama Store Morocco", url });
      else await navigator.clipboard.writeText(url);
    } catch { /* cancelled */ }
  };

  /* deduplicate WooCommerce images */
  const rawUrls: string[] = [
    ...(wcProduct?.image?.sourceUrl ? [wcProduct.image.sourceUrl] : []),
    ...(wcProduct?.galleryImages?.nodes?.map((n) => n.sourceUrl) ?? []),
  ];
  const allImages = Array.from(new Set(rawUrls));

  /* reorder images: FULL VIEW(0), HANDLE(1), SCABBARD(2), ENGRAVING(4→3), KASHIRA(3→4) */
  const IMAGE_ORDER = [0, 1, 2, 4, 3];
  const displayImages = IMAGE_ORDER.map((i) => allImages[i]).filter((u): u is string => Boolean(u));

  const mobileActiveImage  = activeThumb >= 0 ? (displayImages[activeThumb] ?? null) : null;
  const desktopActiveImage = displayImages[Math.max(0, activeThumb)] ?? null;
  const activeImage = mobileActiveImage; // kept for any shared references

  useEffect(() => {
    setTheme(slug === "white-dragon" ? "white-dragon" : "black-dragon");
  }, [slug, setTheme]);

  useEffect(() => {
    const el = thumbScrollRef.current;
    if (!el) return;
    checkThumbScroll();
    el.addEventListener("scroll", checkThumbScroll, { passive: true });
    window.addEventListener("resize", checkThumbScroll);
    return () => {
      el.removeEventListener("scroll", checkThumbScroll);
      window.removeEventListener("resize", checkThumbScroll);
    };
  }, [displayImages, checkThumbScroll]);

  const productName = wcProduct?.name ?? st.title.replace("\n", " ");
  const description = wcProduct?.shortDescription
    ? stripHtml(wcProduct.shortDescription) || st.description
    : st.description;
  const priceStr = formatPrice(wcProduct?.price) ?? "1,399";

  const glassBg    = isBlack ? "rgba(5,5,5,.52)"             : "rgba(247,242,232,.62)";
  const textShadow = isBlack ? "0 2px 20px rgba(0,0,0,.85)" : "0 1px 12px rgba(247,242,232,.6)";
  const imgFilter  = isBlack
    ? "drop-shadow(0 40px 80px rgba(0,0,0,.72)) drop-shadow(0 0 28px rgba(185,154,91,.14))"
    : "drop-shadow(0 28px 60px rgba(95,65,30,.28)) drop-shadow(0 0 24px rgba(185,154,91,.18))";

  const mobileOverlay = isBlack
    ? "linear-gradient(180deg,rgba(8,8,8,.14) 0%,rgba(8,8,8,.38) 50%,rgba(8,8,8,.82) 100%)"
    : "linear-gradient(180deg,rgba(248,243,235,.12) 0%,rgba(248,243,235,.32) 50%,rgba(248,243,235,.80) 100%)";
  const desktopOverlay = isBlack
    ? "linear-gradient(90deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.28) 42%,rgba(0,0,0,.18) 100%)"
    : "linear-gradient(90deg,rgba(248,243,235,.72) 0%,rgba(248,243,235,.36) 38%,rgba(248,243,235,.06) 100%)";

  const FocusIcon = isFocusMode ? EyeOff : Eye;
  const ctrlBtns = [
    { Icon: FocusIcon, label: "Focus",    handler: toggleFocus, active: isFocusMode },
    { Icon: Plus,      label: "Zoom in",  handler: zoomIn,      active: false       },
    { Icon: Minus,     label: "Zoom out", handler: zoomOut,     active: false       },
    { Icon: Share2,    label: "Share",    handler: onShare,     active: false       },
  ] as const;

  return (
    <PageShell>
      <div style={{ backgroundColor: "var(--bg)" }}>

        {/* ══════════════════════════════════════════════
            HERO — full-viewport.  No thumbnails inside.
        ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: "100svh" }}>

          {/* Responsive background */}
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <picture style={{ display: "block", position: "absolute", inset: 0 }}>
              <source
                media="(min-width:768px)"
                srcSet={`/images/hero/hero-${st.bgKey}-desktop.png`}
              />
              <source
                srcSet={`/images/hero/hero-${st.bgKey}-mobile.png`}
              />
              <img
                src={`/images/hero/hero-${st.bgKey}-mobile.png`}
                alt=""
                fetchPriority="high"
                className="hero-bg-img"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", imageRendering: "auto" }}
              />
            </picture>
          </div>

          {/* Overlays */}
          <div aria-hidden className="absolute inset-0 pointer-events-none md:hidden"
            style={{ zIndex: 1, background: mobileOverlay }} />
          <div aria-hidden className="absolute inset-0 pointer-events-none hidden md:block"
            style={{ zIndex: 1, background: desktopOverlay }} />

          {/* Content */}
          <div className="relative" style={{ zIndex: 10, minHeight: "100svh", paddingTop: "76px" }}>

            {/* Breadcrumb spacer — content hidden, height kept for layout calc */}
            <div style={{ height: 36 }} />

            {/* ── MOBILE ── */}
            <div className="relative md:hidden" style={{ height: "calc(100svh - 76px - 36px)" }}>

              {/* Text — absolute upper-left, mirrors HeroSection exactly */}
              <motion.div
                key={`m-copy-${slug}`}
                variants={stagger} initial="hidden" animate="visible"
                className="absolute z-20"
                style={{ top: 10, left: 20, maxWidth: "min(54vw, 228px)", textAlign: "left", opacity: isFocusMode ? 0 : 1, pointerEvents: isFocusMode ? "none" : "auto", transition: "opacity 0.4s ease" }}
              >
                <motion.p variants={fadeUp} className="arabic-kicker"
                  style={{ fontSize: "clamp(1.15rem,5vw,1.55rem)", marginBottom: "0.25rem", textShadow }}>
                  {st.ar}
                </motion.p>
                <motion.p variants={fadeUp} className="text-[.72rem] tracking-[.32em] mb-1"
                  style={{ color: "var(--gold)", opacity: .72, textShadow }}>
                  {st.ja}
                </motion.p>
                <motion.h1 variants={fadeUp} className="font-heading uppercase whitespace-pre-line mb-2"
                  style={{ fontSize: "clamp(2.6rem,12vw,4rem)", lineHeight: .91, letterSpacing: ".02em", color: "var(--text)", textShadow }}>
                  {st.title}
                </motion.h1>
                <motion.div variants={fadeUp}>
                  <div className="w-7 h-px mb-2" style={{ backgroundColor: "var(--gold)", opacity: .55 }} />
                </motion.div>
                <motion.p variants={fadeUp} className="text-[.56rem] tracking-[.2em] uppercase mb-2"
                  style={{ color: "var(--gold)" }}>
                  {st.tagline}
                </motion.p>
                <motion.p variants={fadeUp} className="text-[.74rem] leading-snug"
                  style={{ color: "var(--text-muted)", textShadow }}>
                  {description}
                </motion.p>
              </motion.div>

              {/* Image — absolute centered, pointer-events-none so controls receive touches */}
              <div className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ paddingBottom: 68, pointerEvents: "none" }}>
                <motion.div
                  key={`m-stage-${slug}`}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: activeThumb > 0 ? 72 : 0 }}
                  transition={{ duration: activeThumb > 0 ? 0.45 : 1.2, ease: "easeOut", delay: activeThumb > 0 ? 0 : .3 }}
                  className="flex flex-col items-center"
                >
                  {activeImage ? (
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={productName}
                      fetchPriority="high"
                      animate={{ scale: zoom }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{
                        height: activeThumb > 0
                          ? "clamp(300px, 50svh, 500px)"
                          : "clamp(460px, 65svh, 700px)",
                        width: "auto",
                        maxWidth: activeThumb > 0 ? "min(88vw, 480px)" : "min(70vw, 380px)",
                        objectFit: "contain",
                        display: "block",
                        transformOrigin: "center bottom",
                        objectPosition: activeThumb > 0 ? "center bottom" : "center center",
                        filter: imgFilter,
                      }}
                    />
                  ) : (
                    <div style={{ height: "clamp(460px,65svh,700px)" }} />
                  )}
                  <div style={{ marginTop: activeImage ? -10 : 0 }}>
                    <PlatformRings />
                  </div>
                </motion.div>
              </div>

              {/* Controls — absolute right */}
              <div className="absolute flex flex-col gap-3"
                style={{ right: 14, top: "50%", transform: "translateY(-50%)", zIndex: 50, isolation: "isolate" }}>
                {ctrlBtns.map(({ Icon, label, handler, active }) => (
                  <ControlBtn key={label} Icon={Icon as React.ElementType} label={label} handler={handler} active={active} glassBg={glassBg} />
                ))}
              </div>
            </div>

            {/* ── DESKTOP ── */}
            <div
              className="hidden md:grid"
              style={{
                /*
                 * Center column is DOMINANT (1.25fr).
                 * Left and right are narrower so the sword can be large.
                 * Same total min-width as HeroSection (≈940px) so behaviour matches.
                 */
                gridTemplateColumns: "minmax(280px, 0.78fr) minmax(380px, 1.25fr) minmax(220px, 0.58fr)",
                height: "calc(100svh - 76px - 36px)",
                alignItems: "center",
              }}
            >
              {/* LEFT copy */}
              <motion.div
                key={`d-copy-${slug}`}
                variants={stagger} initial="hidden" animate="visible"
                className="flex flex-col gap-4"
                style={{
                  paddingLeft: "clamp(40px,6vw,88px)", paddingRight: 20,
                  alignSelf: "center",
                  opacity: isFocusMode ? 0 : 1,
                  pointerEvents: isFocusMode ? "none" : "auto",
                  transition: "opacity 0.4s ease",
                }}
              >
                <motion.p variants={fadeUp} className="arabic-kicker"
                  style={{ fontSize: "clamp(1.25rem,2vw,1.9rem)", marginBottom: "-0.5rem", textShadow }}>
                  {st.ar}
                </motion.p>
                <motion.p variants={fadeUp} className="text-[.78rem] tracking-[.38em]"
                  style={{ color: "var(--gold)", opacity: .68, textShadow }}>
                  {st.ja}
                </motion.p>
                <motion.h1 variants={fadeUp} className="font-heading uppercase whitespace-pre-line"
                  style={{ fontSize: "clamp(3.2rem,6vw,6.5rem)", lineHeight: .91, letterSpacing: ".02em", color: "var(--text)", textShadow }}>
                  {st.title}
                </motion.h1>
                <motion.div variants={fadeUp}>
                  <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)", opacity: .55 }} />
                </motion.div>
                <motion.p variants={fadeUp} className="text-[.62rem] tracking-[.22em] uppercase"
                  style={{ color: "var(--gold)" }}>
                  {st.tagline}
                </motion.p>
                <motion.div variants={fadeUp} className="flex items-center gap-2">
                  <div className="h-px w-5" style={{ backgroundColor: "var(--gold)", opacity: .35 }} />
                  <span style={{ fontSize: ".4rem", color: "var(--gold)", opacity: .6 }}>◆</span>
                  <div className="h-px w-5" style={{ backgroundColor: "var(--gold)", opacity: .35 }} />
                </motion.div>
                <motion.p variants={fadeUp} className="text-sm leading-relaxed max-w-[360px]"
                  style={{ color: "var(--text-muted)", textShadow }}>
                  {description}
                </motion.p>
                <motion.p variants={fadeUp} className="text-[.58rem] tracking-[.14em] uppercase"
                  style={{ color: "var(--text-muted)", opacity: .5 }}>
                  MADE OF WOOD · FOR DECORATION ONLY
                </motion.p>
              </motion.div>

              {/* CENTER sword stage — overflow visible so large images don't clip */}
              <div
                className="flex flex-col items-center justify-center lg:-translate-x-8 lg:-translate-y-6"
                style={{ alignSelf: "stretch", position: "relative", overflow: "visible" }}
              >
                <motion.div
                  key={`d-stage-${slug}`}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: .35 }}
                  className="flex flex-col items-center"
                  style={{ overflow: "visible" }}
                >
                  {desktopActiveImage ? (
                    <motion.img
                      key={desktopActiveImage}
                      src={desktopActiveImage}
                      alt={productName}
                      fetchPriority="high"
                      animate={{ scale: zoom }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{
                        /*
                         * Significantly taller than home hero (74vh → 82svh).
                         * No maxWidth — width is determined by the image aspect ratio.
                         * overflow:visible on the parent means no clipping.
                         */
                        height: "clamp(560px, 82svh, 920px)",
                        width: "auto",
                        objectFit: "contain",
                        display: "block",
                        transformOrigin: "center bottom",
                        filter: imgFilter,
                      }}
                    />
                  ) : (
                    <div style={{ height: "clamp(560px,82svh,920px)" }} />
                  )}
                  <div style={{ marginTop: desktopActiveImage ? -14 : 0 }}>
                    <PlatformRings />
                  </div>
                </motion.div>
              </div>

              {/* RIGHT slim panel — controls + price + CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75, delay: 0.4 }}
                style={{
                  paddingLeft: 20, paddingRight: "clamp(20px,3.5vw,48px)",
                  display: "flex", flexDirection: "column", gap: "1.25rem",
                  alignSelf: "center",
                }}
              >
                {/* VIEW CONTROLS — always visible even in focus mode */}
                <div>
                  <p style={{ color: "var(--gold)", fontSize: "0.44rem", letterSpacing: "0.32em", textTransform: "uppercase", opacity: .6, marginBottom: "0.7rem" }}>
                    VIEW CONTROLS
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {ctrlBtns.map(({ Icon, label, handler, active }) => (
                      <ControlBtn key={label} Icon={Icon as React.ElementType} label={label} handler={handler} active={active} glassBg={glassBg} />
                    ))}
                  </div>
                </div>

                {/* Price block — fades in focus mode */}
                <div style={{
                  opacity: isFocusMode ? 0 : 1,
                  pointerEvents: isFocusMode ? "none" : "auto",
                  transition: "opacity 0.4s ease",
                  display: "flex", flexDirection: "column", gap: "1.1rem",
                }}>
                  <div style={{ height: 1, backgroundColor: "rgba(185,154,91,0.18)" }} />

                  <div>
                    <p style={{ color: "var(--gold)", fontSize: "0.44rem", letterSpacing: "0.26em", textTransform: "uppercase", opacity: .62, marginBottom: "0.3rem" }}>
                      STARTING FROM
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                      <span className="font-heading" style={{ fontSize: "2.2rem", color: "var(--text)", lineHeight: 1 }}>{priceStr}</span>
                      <span style={{ color: "var(--gold)", fontSize: "0.56rem", letterSpacing: "0.22em" }}>DH</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {["103 cm · Decorative Wood", "Free delivery · All Morocco", "Cash on delivery"].map((s) => (
                      <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "var(--gold)", opacity: .55, flexShrink: 0 }} />
                        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", lineHeight: 1.4 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            THUMBNAILS — own section, clean, below hero
        ══════════════════════════════════════════════ */}
        <section style={{
          backgroundColor: isBlack ? "rgba(5,5,5,0.95)" : "rgba(248,243,235,0.96)",
          borderBottom: "1px solid rgba(185,154,91,0.14)",
          position: "relative",
        }}>
          {/* Mobile-only left arrow */}
          {canScrollLeft && (
            <button
              aria-label="Scroll thumbnails left"
              onClick={() => scrollThumbs("left")}
              className="md:hidden"
              style={{
                position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)",
                zIndex: 20, width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                border: "1px solid rgba(185,154,91,0.35)",
                backgroundColor: isBlack ? "rgba(10,10,8,0.72)" : "rgba(255,250,240,0.82)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.28)",
                transition: "opacity 0.25s ease",
              }}
            >
              <ChevronLeft size={15} strokeWidth={1.5} />
            </button>
          )}

          {/* Mobile-only right arrow */}
          {canScrollRight && (
            <button
              aria-label="Scroll thumbnails right"
              onClick={() => scrollThumbs("right")}
              className="md:hidden"
              style={{
                position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                zIndex: 20, width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                border: "1px solid rgba(185,154,91,0.35)",
                backgroundColor: isBlack ? "rgba(10,10,8,0.72)" : "rgba(255,250,240,0.82)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.28)",
                transition: "opacity 0.25s ease",
              }}
            >
              <ChevronRight size={15} strokeWidth={1.5} />
            </button>
          )}

          <div
            ref={thumbScrollRef}
            style={{ padding: "0.9rem clamp(1.5rem,5vw,4rem)", overflowX: "auto", scrollbarWidth: "none" }}
          >
            <div style={{ display: "flex", gap: "0.9rem", width: "max-content", minWidth: "100%" }}>
              {displayImages.length > 0
                ? displayImages.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      onClick={() => handleThumbnailClick(i)}
                      style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <div style={{
                        width: 78, height: 100, borderRadius: 8, overflow: "hidden",
                        border: activeThumb === i ? "1.5px solid var(--gold)" : "1px solid rgba(185,154,91,0.22)",
                        backgroundColor: isBlack ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                        transition: "border-color 0.3s ease",
                      }}>
                        <img src={src} alt={`View ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
                      </div>
                      <span style={{ color: activeThumb === i ? "var(--gold)" : "var(--text-muted)", fontSize: "0.46rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "color 0.3s", whiteSpace: "nowrap" }}>
                        {THUMB_LABELS[i] ?? `VIEW ${i + 1}`}
                      </span>
                    </button>
                  ))
                : THUMB_LABELS.map((label, i) => (
                    <button
                      key={label}
                      onClick={() => handleThumbnailClick(i)}
                      style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <div style={{
                        width: 78, height: 100, borderRadius: 8,
                        border: activeThumb === i ? "1.5px solid var(--gold)" : "1px solid rgba(185,154,91,0.22)",
                        backgroundColor: isBlack ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}>
                        <div style={{ width: 16, height: 54, borderRadius: 3, background: `rgba(185,154,91,${activeThumb === i ? 0.5 : 0.18})`, transition: "background 0.3s" }} />
                      </div>
                      <span style={{ color: activeThumb === i ? "var(--gold)" : "var(--text-muted)", fontSize: "0.46rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "color 0.3s" }}>
                        {label}
                      </span>
                    </button>
                  ))
              }
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            MOBILE-ONLY ACTION BUTTONS — directly after thumbnails
        ══════════════════════════════════════════════ */}
        <section className="md:hidden" style={{
          backgroundColor: "var(--bg)",
          padding: "1.25rem clamp(1rem,4vw,2rem) 1.5rem",
          borderBottom: "1px solid rgba(185,154,91,0.10)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", alignItems: "stretch" }}>
            <Link
              href={`/checkout?product=${slug}`}
              className="flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                height: 54, borderRadius: 12,
                backgroundColor: "var(--gold)", color: "var(--bg)",
                fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
            >
              ORDER NOW
            </Link>
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                height: 50, borderRadius: 12,
                border: `1px solid ${cartAdded ? "rgba(34,197,94,0.6)" : "rgba(185,154,91,0.45)"}`,
                color: cartAdded ? "#22c55e" : "var(--gold)",
                fontSize: "0.64rem", letterSpacing: "0.18em", textTransform: "uppercase",
                backgroundColor: cartAdded ? "rgba(34,197,94,0.08)" : "rgba(185,154,91,0.06)",
                cursor: "pointer", transition: "all .25s",
              }}
            >
              {cartAdded ? <Check size={14} strokeWidth={2} /> : <ShoppingCart size={14} strokeWidth={1.5} />}
              {cartAdded ? "ADDED ✓" : "ADD TO CART"}
            </button>
            <Link
              href="/catalogue"
              className="flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                height: 46, borderRadius: 12,
                border: "1px solid rgba(185,154,91,0.32)", color: "var(--text-muted)",
                fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(185,154,91,0.65)"; el.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(185,154,91,0.32)"; el.style.color = "var(--text-muted)"; }}
            >
              <LayoutGrid size={14} strokeWidth={1.5} />
              CATALOGUE
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SPECIFICATIONS STRIP
        ══════════════════════════════════════════════ */}
        <section style={{ backgroundColor: "var(--bg)" }}>
          <div style={{ height: 1, backgroundColor: "rgba(185,154,91,0.18)" }} />
          <div className="px-5 md:px-10 pt-7 pb-8">
            <p className="text-center text-[.48rem] tracking-[.42em] uppercase mb-8"
              style={{ color: "var(--gold)", opacity: .58 }}>
              SPECIFICATIONS
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5" style={{ gap: 0 }}>
              {SPECS.map(({ Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center text-center"
                  style={{ padding: "clamp(1rem,2vw,1.4rem) clamp(0.5rem,1.5vw,1rem)", borderRight: "1px solid rgba(185,154,91,0.11)", borderBottom: "1px solid rgba(185,154,91,0.11)" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    border: "1px solid rgba(185,154,91,0.28)",
                    background: isBlack
                      ? "radial-gradient(circle at center, rgba(185,154,91,0.10) 0%, transparent 70%)"
                      : "radial-gradient(circle at center, rgba(185,154,91,0.16) 0%, transparent 70%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "0.65rem", flexShrink: 0,
                  }}>
                    <Icon size={14} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                  </div>
                  <p style={{ color: "var(--gold)", fontSize: "0.46rem", letterSpacing: "0.3em", textTransform: "uppercase", opacity: .72, marginBottom: "0.3rem", lineHeight: 1 }}>{label}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.25 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: "rgba(185,154,91,0.12)" }} />
          <p className="text-center text-[.46rem] tracking-[.18em] uppercase mt-4 mb-4"
            style={{ color: "var(--text-muted)", opacity: .38 }}>
            MADE OF WOOD · FOR DECORATION ONLY
          </p>
        </section>

        {/* ══════════════════════════════════════════════
            ACTION BUTTONS — desktop only (mobile version is above specs)
        ══════════════════════════════════════════════ */}
        <section className="hidden md:block" style={{
          backgroundColor: "var(--bg)",
          padding: "1.5rem clamp(1.5rem,5vw,4rem) clamp(2rem,4vw,3rem)",
          borderBottom: "1px solid rgba(185,154,91,0.10)",
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", justifyContent: "center" }}>
            <Link
              href={`/checkout?product=${slug}`}
              className="flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                height: 50, padding: "0 28px", borderRadius: 10,
                backgroundColor: "var(--gold)", color: "var(--bg)",
                fontSize: "0.64rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
            >
              ORDER NOW
            </Link>
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                height: 50, padding: "0 22px", borderRadius: 10,
                border: `1px solid ${cartAdded ? "rgba(34,197,94,0.6)" : "rgba(185,154,91,0.45)"}`,
                color: cartAdded ? "#22c55e" : "var(--gold)",
                fontSize: "0.64rem", letterSpacing: "0.18em", textTransform: "uppercase",
                backgroundColor: cartAdded ? "rgba(34,197,94,0.08)" : "rgba(185,154,91,0.06)",
                cursor: "pointer", transition: "all .25s", flexShrink: 0,
              }}
            >
              {cartAdded ? <Check size={14} strokeWidth={2} /> : <ShoppingCart size={14} strokeWidth={1.5} />}
              {cartAdded ? "ADDED ✓" : "ADD TO CART"}
            </button>
            <Link
              href="/catalogue"
              className="flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                height: 50, padding: "0 22px", borderRadius: 10,
                border: "1px solid rgba(185,154,91,0.35)", color: "var(--text-muted)",
                fontSize: "0.64rem", letterSpacing: "0.18em", textTransform: "uppercase",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(185,154,91,0.65)"; el.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(185,154,91,0.35)"; el.style.color = "var(--text-muted)"; }}
            >
              <LayoutGrid size={14} strokeWidth={1.5} />
              CATALOGUE
            </Link>
          </div>
        </section>

        {/* Fixed mobile bottom nav */}
        <nav aria-label="Bottom navigation" className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          style={{
            backgroundColor: isBlack ? "rgba(5,5,5,.92)" : "rgba(247,242,232,.94)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
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
              <Link key={label} href={href}
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
    </PageShell>
  );
}
