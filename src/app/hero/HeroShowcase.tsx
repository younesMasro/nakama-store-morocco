"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";

const GOLD      = "rgba(185,154,91,1)";
const GOLD_DIM  = "rgba(185,154,91,0.72)";
const GOLD_FAINT= "rgba(185,154,91,0.28)";
const MARQUEE   = "NAKAMA · DECORATIVE KATANA · MOROCCO · 1,399 DH · FREE DELIVERY · ";

/* ══════════════════════════════════════════════════════════════════════
   HERO 1 — AURORA
   Holographic shifting gradient aurora behind the silhouette.
   Floating metadata pills, ultra-thin serif headline.
══════════════════════════════════════════════════════════════════════ */
function HeroAurora() {
  const auroraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(auroraRef.current, {
        backgroundPosition: "200% 60%",
        duration: 12,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    });
    return () => ctx.revert();
  }, []);

  const pill = (txt: string) => (
    <span key={txt} style={{
      display: "inline-flex", alignItems: "center", padding: "5px 14px",
      borderRadius: 999, border: `1px solid ${GOLD_FAINT}`,
      backgroundColor: "rgba(0,0,0,0.38)", backdropFilter: "blur(10px)",
      color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em",
      textTransform: "uppercase",
    }}>{txt}</span>
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#02000a" }}>

      {/* Aurora gradient layer */}
      <div ref={auroraRef} aria-hidden style={{
        position: "absolute", inset: "-20%",
        backgroundImage: `
          radial-gradient(ellipse 80% 55% at 20% 40%, rgba(185,154,91,0.18) 0%, transparent 55%),
          radial-gradient(ellipse 60% 45% at 75% 25%, rgba(100,60,180,0.14) 0%, transparent 55%),
          radial-gradient(ellipse 55% 50% at 55% 75%, rgba(30,120,180,0.10) 0%, transparent 55%),
          radial-gradient(ellipse 70% 60% at 45% 50%, rgba(185,154,91,0.06) 0%, transparent 60%)
        `,
        backgroundSize: "400% 400%",
        backgroundPosition: "0% 40%",
        filter: "blur(38px)",
        zIndex: 0,
        opacity: 0.9,
      }} />

      {/* Subtle noise texture */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1, opacity: 0.035,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "180px",
      }} />

      {/* Katana silhouette — right */}
      <motion.div
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{
          position: "absolute", right: "clamp(-4rem,-2%,0rem)", top: "50%",
          transform: "translateY(-50%)", width: "50%", maxWidth: 520,
          zIndex: 2, aspectRatio: "0.66/1",
          backgroundImage: "url(/images/hero/hero-black-desktop.png)",
          backgroundSize: "contain", backgroundPosition: "center right",
          backgroundRepeat: "no-repeat", opacity: 0.6,
        }} />

      {/* Holographic glow behind katana */}
      <div aria-hidden style={{
        position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)",
        width: "38%", aspectRatio: "1/1.4", zIndex: 1,
        background: "radial-gradient(ellipse at center, rgba(185,154,91,0.12) 0%, rgba(100,60,180,0.08) 50%, transparent 75%)",
        filter: "blur(45px)",
      }} />

      {/* Left text */}
      <div style={{
        position: "relative", zIndex: 10, height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 clamp(1.8rem,6vw,5rem)", maxWidth: "58%",
      }}>

        {/* Floating pills row */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "clamp(1.2rem,3vh,2rem)" }}>
          {["Available Now", "1,399 DH", "Free Delivery"].map(pill)}
        </motion.div>

        {/* Headline — ultra thin weight */}
        <div style={{ overflow: "hidden", marginBottom: "clamp(0.4rem,1.2vh,0.8rem)" }}>
          <motion.div initial={{ y: "102%" }} animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}>
            <p style={{ fontFamily: "var(--font-cinzel,serif)", fontWeight: 300, fontSize: "clamp(0.65rem,1.1vw,0.9rem)", letterSpacing: "0.55em", color: GOLD_DIM, textTransform: "uppercase", marginBottom: "0.5rem" }}>
              NAKAMA STORE · MOROCCO
            </p>
          </motion.div>
        </div>

        {["BLACK", "DRAGON"].map((word, i) => (
          <div key={word} style={{ overflow: "hidden" }}>
            <motion.h1 initial={{ y: "105%" }} animate={{ y: 0 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.32 + i * 0.08 }}
              style={{
                fontFamily: "var(--font-cinzel,serif)", fontWeight: 300,
                fontSize: "clamp(3.5rem,9vw,8rem)", lineHeight: 0.86,
                letterSpacing: "-0.01em", color: "#F4F1EA", display: "block",
              }}>
              {word}
            </motion.h1>
          </div>
        ))}

        {/* Thin gold rule + Japanese */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          style={{ transformOrigin: "left", display: "flex", alignItems: "center", gap: 12, margin: "clamp(1rem,2.5vh,1.8rem) 0" }}>
          <div style={{ height: 1, flex: 1, maxWidth: 80, background: `linear-gradient(90deg,${GOLD_DIM},transparent)` }} />
          <span style={{ color: GOLD_FAINT, fontSize: "0.42rem", letterSpacing: "0.32em" }}>黒い龍 · POWER · MYSTERY</span>
        </motion.div>

        {/* Description + CTA */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          style={{ display: "flex", flexDirection: "column", gap: "clamp(0.9rem,2.2vh,1.5rem)" }}>
          <p style={{ color: "rgba(244,241,234,0.5)", fontSize: "clamp(0.75rem,1.1vw,0.88rem)", lineHeight: 1.78, maxWidth: 380 }}>
            Premium decorative wooden katana. Dark aesthetics crafted for collectors, anime lovers, and bold interiors.
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/checkout?product=black-dragon" onClick={e => e.stopPropagation()} style={{ height: 48, padding: "0 26px", borderRadius: 8, background: GOLD, color: "#050505", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              ORDER NOW
            </Link>
            <Link href="/product/black-dragon" onClick={e => e.stopPropagation()} style={{ height: 48, padding: "0 22px", borderRadius: 8, border: `1px solid ${GOLD_FAINT}`, color: GOLD_DIM, fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              VIEW DETAILS
            </Link>
            <span className="font-heading" style={{ fontSize: "clamp(1.2rem,2vw,1.6rem)", color: "#F4F1EA", marginLeft: 4 }}>1,399 <span style={{ fontSize: "0.5rem", color: GOLD_DIM, letterSpacing: "0.15em" }}>DH</span></span>
          </div>
        </motion.div>
      </div>

      {/* Arabic kicker — top right visible area */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.72 }} transition={{ delay: 1.2, duration: 0.8 }}
        className="arabic-kicker"
        style={{ position: "absolute", top: "clamp(1rem,2.5vh,1.8rem)", right: "clamp(1rem,2.5vw,2rem)", fontSize: "clamp(1.2rem,2.5vw,2rem)", zIndex: 15 }}>
        التنين الأسود
      </motion.p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO 2 — BRUTALIST
   Loud black/cream grid. Oversized numbers as decoration. Color-block
   text. Diagonal slashes. Very graphic-design-agency energy.
══════════════════════════════════════════════════════════════════════ */
function HeroBrutalist() {
  const gridRef   = useRef<HTMLDivElement>(null);
  const blockRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".brut-col", {
        y: 60, opacity: 0, duration: 0.7,
        ease: "expo.out", stagger: 0.1, delay: 0.08,
      });
      gsap.from(".brut-slash", {
        scaleX: 0, transformOrigin: "left", duration: 0.65,
        ease: "expo.out", delay: 0.55,
      });
    }, gridRef.current ?? undefined);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      backgroundColor: "#F2EDE0", color: "#0A0A0A",
      display: "grid", gridTemplateColumns: "1fr 1fr",
    }}>

      {/* Left column — cream */}
      <div className="brut-col" style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "clamp(1.5rem,4vw,3.5rem)", borderRight: "2px solid #0A0A0A", overflow: "hidden",
      }}>
        {/* Top badge */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: GOLD }} />
          <span style={{ fontSize: "0.45rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#0A0A0A" }}>NAKAMA STORE — 2025</span>
        </div>

        {/* Giant decorative number */}
        <div style={{ lineHeight: 1 }}>
          <p style={{ fontFamily: "var(--font-cinzel,serif)", fontWeight: 900, fontSize: "clamp(5rem,14vw,12rem)", lineHeight: 0.85, color: "rgba(10,10,10,0.06)", letterSpacing: "-0.04em", userSelect: "none" }}>
            01
          </p>
        </div>

        {/* Bottom: spec tags */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["103 CM LENGTH", "WOODEN BLADE", "CASH ON DELIVERY"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 20, height: 1, backgroundColor: "#0A0A0A" }} />
              <span style={{ fontSize: "0.42rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column — dark */}
      <div className="brut-col" ref={blockRef} style={{
        backgroundColor: "#0A0A0A", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "clamp(1.5rem,4vw,3.5rem)", overflow: "hidden",
      }}>
        {/* Top right */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.28em" }}>FREE DELIVERY · MOROCCO</span>
        </div>

        {/* Center — big block heading */}
        <div>
          {/* Slash divider */}
          <div className="brut-slash" style={{ height: 3, backgroundColor: GOLD, marginBottom: "clamp(0.8rem,2vh,1.5rem)", width: 60 }} />
          <h2 style={{ fontFamily: "var(--font-cinzel,serif)", fontWeight: 900, fontSize: "clamp(2.4rem,6.5vw,5.5rem)", lineHeight: 0.88, letterSpacing: "-0.02em", color: "#F2EDE0", marginBottom: "clamp(0.8rem,2vh,1.5rem)" }}>
            BLACK<br />DRAGON
          </h2>
          <p className="arabic-kicker" style={{ fontSize: "clamp(1.4rem,2.8vw,2.4rem)", marginBottom: "clamp(0.7rem,1.8vh,1.2rem)" }}>
            التنين الأسود
          </p>
          <p style={{ color: "rgba(242,237,224,0.5)", fontSize: "clamp(0.72rem,1.1vw,0.85rem)", lineHeight: 1.72, maxWidth: 300, marginBottom: "clamp(1rem,2.5vh,1.8rem)" }}>
            A limited-edition decorative katana for collectors, anime lovers, and bold room decoration.
          </p>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: "clamp(1rem,2.5vh,1.8rem)" }}>
            <p style={{ fontFamily: "var(--font-cinzel,serif)", fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1, color: GOLD, fontWeight: 700 }}>1,399</p>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", marginBottom: "0.4rem" }}>DH</p>
            <p style={{ color: "rgba(242,237,224,0.32)", fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: "0.4rem", textDecoration: "line-through" }}>1,799 DH</p>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/checkout?product=black-dragon" onClick={e => e.stopPropagation()} style={{ height: 48, padding: "0 24px", backgroundColor: GOLD, color: "#0A0A0A", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 6 }}>
              ORDER NOW
            </Link>
            <Link href="/catalogue" onClick={e => e.stopPropagation()} style={{ height: 48, padding: "0 20px", border: "1px solid rgba(242,237,224,0.2)", color: "rgba(242,237,224,0.65)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 6 }}>
              CATALOGUE
            </Link>
          </div>
        </div>

        {/* Bottom right: katana image faded */}
        <div aria-hidden style={{
          position: "absolute", bottom: 0, right: 0, width: "32%", height: "65%",
          backgroundImage: "url(/images/hero/hero-black-desktop.png)",
          backgroundSize: "contain", backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat", opacity: 0.18, pointerEvents: "none", zIndex: 0,
        }} />
      </div>

      {/* Bottom border accent */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, backgroundColor: GOLD, transformOrigin: "left", zIndex: 20 }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO 3 — CINEMA
   GSAP letterbox bars slide open like a projector starting.
   Scanline texture overlay. Film subtitle text reveals.
   Grain effect. High-contrast processing.
══════════════════════════════════════════════════════════════════════ */
function HeroCinema() {
  const topBarRef    = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const sub1Ref      = useRef<HTMLDivElement>(null);
  const sub2Ref      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      // Bars open first
      tl.to(topBarRef.current,    { height: "0%", duration: 1.05, ease: "expo.inOut" })
        .to(bottomBarRef.current, { height: "0%", duration: 1.05, ease: "expo.inOut" }, "<")
        // Content fades in
        .fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" })
        // Subtitles appear in sequence
        .fromTo(sub1Ref.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, "+=0.1")
        .fromTo(sub2Ref.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, "+=0.6");
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#050505" }}>

      {/* Full bg image — desaturated, high contrast */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url(/images/hero/hero-black-desktop.png)",
        backgroundSize: "cover", backgroundPosition: "center",
        filter: "grayscale(0.85) contrast(1.35) brightness(0.42)",
      }} />

      {/* Scanline overlay */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
        backgroundSize: "100% 3px",
        mixBlendMode: "multiply",
      }} />

      {/* Film grain */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2, opacity: 0.055, pointerEvents: "none",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
        backgroundSize: "120px",
      }} />

      {/* Vignette */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 3, background: "radial-gradient(ellipse 88% 88% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />

      {/* Main content — fades in after bars open */}
      <div ref={contentRef} style={{ position: "absolute", inset: 0, zIndex: 5, opacity: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(1rem,3vh,2.5rem) clamp(1.5rem,5vw,4rem)" }}>

        {/* Top film metadata */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "monospace" }}>NAKAMA STORE</p>
            <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.38rem", letterSpacing: "0.28em", fontFamily: "monospace", marginTop: 4 }}>2025 · MOROCCO · COLLECTOR EDITION</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.38rem", letterSpacing: "0.28em", fontFamily: "monospace" }}>ASPECT 2.35:1</p>
            <p style={{ color: GOLD_FAINT, fontSize: "0.38rem", letterSpacing: "0.22em", fontFamily: "monospace", marginTop: 4 }}>REEL 01</p>
          </div>
        </div>

        {/* Center: film title */}
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.16)", fontSize: "0.42rem", letterSpacing: "0.55em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "1.2rem" }}>— A NAKAMA PICTURE —</p>
          <h1 style={{ fontFamily: "var(--font-cinzel,serif)", fontWeight: 300, fontSize: "clamp(2.8rem,7.5vw,7rem)", lineHeight: 0.88, letterSpacing: "0.08em", color: "#F4F1EA", textTransform: "uppercase", marginBottom: "1.2rem" }}>
            BLACK<br />DRAGON
          </h1>
          <p className="arabic-kicker" style={{ fontSize: "clamp(1.4rem,2.8vw,2.2rem)", opacity: 0.82 }}>التنين الأسود</p>
        </div>

        {/* Bottom: film subtitle style */}
        <div>
          <div ref={sub1Ref} style={{ opacity: 0, textAlign: "center", marginBottom: "0.8rem" }}>
            <p style={{ display: "inline-block", backgroundColor: "rgba(0,0,0,0.62)", backdropFilter: "blur(4px)", padding: "6px 18px", color: "#F4F1EA", fontSize: "clamp(0.7rem,1.2vw,0.9rem)", letterSpacing: "0.08em", fontFamily: "sans-serif" }}>
              Premium decorative wooden katana — crafted for collectors &amp; anime lovers
            </p>
          </div>
          <div ref={sub2Ref} style={{ opacity: 0, display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
            <Link href="/checkout?product=black-dragon" onClick={e => e.stopPropagation()} style={{ height: 44, padding: "0 22px", backgroundColor: GOLD, color: "#050505", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 6 }}>
              ORDER — 1,399 DH
            </Link>
            <Link href="/product/black-dragon" onClick={e => e.stopPropagation()} style={{ height: 44, padding: "0 18px", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.7)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 6 }}>
              VIEW DETAILS
            </Link>
          </div>
        </div>
      </div>

      {/* LETTERBOX BAR — TOP */}
      <div ref={topBarRef} style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "16%", backgroundColor: "#000", zIndex: 20,
      }} />
      {/* LETTERBOX BAR — BOTTOM */}
      <div ref={bottomBarRef} style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "16%", backgroundColor: "#000", zIndex: 20,
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO 4 — MAGNETIC
   Cursor parallax: katana image + text layers move at different speeds.
   Dark bg with subtle dot grid. Interactive depth illusion via GSAP.
══════════════════════════════════════════════════════════════════════ */
function HeroMagnetic() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const layer0Ref  = useRef<HTMLDivElement>(null); // slowest — bg glow
  const layer1Ref  = useRef<HTMLDivElement>(null); // katana image
  const layer2Ref  = useRef<HTMLDivElement>(null); // text
  const layer3Ref  = useRef<HTMLDivElement>(null); // fast — floating pills

  const onMove = useCallback((e: MouseEvent) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const nx = (e.clientX - r.left)  / r.width  - 0.5;
    const ny = (e.clientY - r.top)   / r.height - 0.5;

    gsap.to(layer0Ref.current, { x: nx * 18, y: ny * 10, duration: 1.8, ease: "power2.out" });
    gsap.to(layer1Ref.current, { x: nx * 34, y: ny * 22, duration: 1.2, ease: "power3.out" });
    gsap.to(layer2Ref.current, { x: nx * -12, y: ny * -8, duration: 1.0, ease: "power3.out" });
    gsap.to(layer3Ref.current, { x: nx * 48, y: ny * 30, duration: 0.9, ease: "power3.out" });
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.addEventListener("mousemove", onMove);
    return () => wrap.removeEventListener("mousemove", onMove);
  }, [onMove]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mag-text-line", {
        opacity: 0, y: 30, duration: 0.85,
        ease: "expo.out", stagger: 0.08, delay: 0.15,
      });
      gsap.from(layer1Ref.current, { opacity: 0, scale: 1.08, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.from(layer3Ref.current, { opacity: 0, y: 20, duration: 0.7, ease: "power2.out", delay: 0.55 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#040404", cursor: "crosshair" }}>

      {/* Dot grid bg */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(circle, rgba(185,154,91,0.14) 1px, transparent 1px)",
        backgroundSize: "32px 32px", opacity: 0.55,
      }} />

      {/* Layer 0 — ambient glow (slowest parallax) */}
      <div ref={layer0Ref} aria-hidden style={{
        position: "absolute", right: "10%", top: "20%",
        width: "55%", height: "65%",
        background: "radial-gradient(ellipse at center, rgba(185,154,91,0.1) 0%, rgba(100,60,180,0.05) 50%, transparent 75%)",
        filter: "blur(60px)", zIndex: 1, pointerEvents: "none",
      }} />

      {/* Layer 1 — katana image (medium parallax) */}
      <div ref={layer1Ref} style={{
        position: "absolute", right: "clamp(-3rem,2%,3rem)", top: "50%",
        transform: "translateY(-50%)", width: "48%", maxWidth: 500, zIndex: 2,
        aspectRatio: "0.66/1",
        backgroundImage: "url(/images/hero/hero-black-desktop.png)",
        backgroundSize: "contain", backgroundPosition: "center",
        backgroundRepeat: "no-repeat", opacity: 0.72,
        willChange: "transform",
      }} />

      {/* Layer 3 — floating metadata pills (fastest parallax) */}
      <div ref={layer3Ref} style={{
        position: "absolute", right: "clamp(2rem,6%,5rem)", top: "clamp(1.5rem,5%,3rem)",
        display: "flex", flexDirection: "column", gap: 8, zIndex: 8, willChange: "transform",
      }}>
        {[["103 CM", "LENGTH"], ["1,399 DH", "PRICE"], ["FREE", "DELIVERY"]].map(([v, l]) => (
          <div key={l} style={{
            padding: "8px 14px", borderRadius: 10,
            border: `1px solid ${GOLD_FAINT}`,
            backgroundColor: "rgba(4,4,4,0.7)", backdropFilter: "blur(12px)",
          }}>
            <p style={{ fontFamily: "var(--font-cinzel,serif)", fontSize: "clamp(0.8rem,1.4vw,1.1rem)", color: "#F4F1EA", lineHeight: 1 }}>{v}</p>
            <p style={{ fontSize: "0.35rem", letterSpacing: "0.26em", color: GOLD_DIM, marginTop: 3 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Layer 2 — text (counter-parallax, moves opposite) */}
      <div ref={layer2Ref} style={{
        position: "relative", zIndex: 10, height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 clamp(1.8rem,6vw,5rem)", maxWidth: "56%", willChange: "transform",
      }}>
        <p className="mag-text-line" style={{ color: GOLD_DIM, fontSize: "0.45rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "clamp(0.6rem,1.5vh,1rem)" }}>
          NAKAMA STORE · MOROCCO
        </p>
        <p className="mag-text-line arabic-kicker" style={{ fontSize: "clamp(1.4rem,2.8vw,2.2rem)", marginBottom: "clamp(0.4rem,1vh,0.7rem)" }}>
          التنين الأسود
        </p>
        <h1 className="mag-text-line" style={{ fontFamily: "var(--font-cinzel,serif)", fontSize: "clamp(3rem,8vw,7.2rem)", lineHeight: 0.86, fontWeight: 400, letterSpacing: "-0.01em", color: "#F4F1EA", marginBottom: "clamp(0.6rem,1.5vh,1rem)" }}>
          BLACK<br />DRAGON
        </h1>
        <div className="mag-text-line" style={{ height: 1, width: 64, background: `linear-gradient(90deg,${GOLD},transparent)`, margin: "clamp(0.8rem,2vh,1.4rem) 0" }} />
        <p className="mag-text-line" style={{ color: "rgba(244,241,234,0.48)", fontSize: "clamp(0.73rem,1.1vw,0.86rem)", lineHeight: 1.78, maxWidth: 360, marginBottom: "clamp(1rem,2.5vh,1.8rem)" }}>
          Move your cursor to feel the depth. A premium decorative katana for collectors and bold interiors.
        </p>
        <div className="mag-text-line" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/checkout?product=black-dragon" onClick={e => e.stopPropagation()} style={{ height: 48, padding: "0 26px", background: GOLD, color: "#040404", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
            ORDER NOW
          </Link>
          <Link href="/product/black-dragon" onClick={e => e.stopPropagation()} style={{ height: 48, padding: "0 20px", border: `1px solid ${GOLD_FAINT}`, color: GOLD_DIM, fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
            VIEW DETAILS
          </Link>
        </div>

        {/* Bottom hint */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.38 }} transition={{ delay: 1.8, duration: 1 }}
          style={{ position: "absolute", bottom: "clamp(1rem,2.5vh,2rem)", left: "clamp(1.8rem,6vw,5rem)", fontSize: "0.38rem", letterSpacing: "0.28em", color: GOLD_DIM, textTransform: "uppercase" }}>
          MOVE CURSOR ↗ FOR PARALLAX DEPTH
        </motion.p>
      </div>

      {/* Scrolling bottom marquee */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 32, borderTop: `1px solid ${GOLD_FAINT}`, overflow: "hidden", zIndex: 20, display: "flex", alignItems: "center" }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          style={{ display: "flex", whiteSpace: "nowrap" }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ color: "rgba(185,154,91,0.3)", fontSize: "0.38rem", letterSpacing: "0.32em", textTransform: "uppercase", paddingRight: "2rem" }}>
              {MARQUEE}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SHOWCASE WRAPPER
══════════════════════════════════════════════════════════════════════ */
const HEROES = [
  { id: 0, name: "AURORA",    tag: "01", desc: "Holographic gradient · Thin serif",  Component: HeroAurora    },
  { id: 1, name: "BRUTALIST", tag: "02", desc: "Grid layout · Bold graphic energy",  Component: HeroBrutalist },
  { id: 2, name: "CINEMA",    tag: "03", desc: "Letterbox open · Scanlines · Grain", Component: HeroCinema    },
  { id: 3, name: "MAGNETIC",  tag: "04", desc: "Cursor parallax · Dot grid · Depth", Component: HeroMagnetic  },
];

const slideVariants: Variants = {
  enter:  (d: number) => ({ x: d > 0 ?  "100%" : "-100%", opacity: 0 }),
  center:               ({ x: 0, opacity: 1 }),
  exit:   (d: number) => ({ x: d > 0 ? "-100%" :  "100%", opacity: 0 }),
};

export default function HeroShowcase() {
  const [active,    setActive]    = useState(0);
  const [direction, setDirection] = useState(1);

  function go(next: number) {
    if (next === active) return;
    setDirection(next > active ? 1 : -1);
    setActive(next);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setActive(a => {
          const n = Math.min(a + 1, HEROES.length - 1);
          setDirection(n > a ? 1 : -1);
          return n;
        });
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActive(a => {
          const n = Math.max(a - 1, 0);
          setDirection(n < a ? -1 : 1);
          return n;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hero = HEROES[active];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", backgroundColor: "#050505" }}>

      {/* ── Hero display ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <hero.Component />
          </motion.div>
        </AnimatePresence>

        {/* Side arrows */}
        {[{ dir: -1, side: "left" as const, label: "←", disabled: active === 0 },
          { dir:  1, side: "right" as const, label: "→", disabled: active === HEROES.length - 1 }].map(({ dir, side, label, disabled }) => (
          <button key={side} onClick={() => go(active + dir)} disabled={disabled}
            style={{
              position: "absolute", [side]: 14, top: "50%", transform: "translateY(-50%)",
              zIndex: 30, width: 42, height: 42, borderRadius: "50%",
              border: `1px solid ${GOLD_FAINT}`, backgroundColor: "rgba(5,5,5,0.55)",
              backdropFilter: "blur(8px)", color: disabled ? "rgba(185,154,91,0.18)" : GOLD_DIM,
              fontSize: "1rem", cursor: disabled ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
            }}>
            {label}
          </button>
        ))}

        {/* Hero name badge — top right */}
        <div style={{ position: "absolute", top: 14, right: 14, zIndex: 30, display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(5,5,5,0.58)", backdropFilter: "blur(10px)", border: `1px solid ${GOLD_FAINT}`, borderRadius: 24, padding: "6px 14px" }}>
          <span style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.28em" }}>{hero.tag} — {hero.name}</span>
        </div>

        {/* Keyboard hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2.2, duration: 0.8 }}
          style={{ position: "absolute", top: 14, left: 14, zIndex: 30, color: "rgba(185,154,91,0.45)", fontSize: "0.37rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          ← → NAVIGATE
        </motion.div>
      </div>

      {/* ── Bottom navigation bar ── */}
      <div style={{
        height: 66, backgroundColor: "#080808",
        borderTop: `1px solid ${GOLD_FAINT}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1rem,3vw,2rem)", flexShrink: 0, zIndex: 50, gap: 12,
      }}>

        {/* Left: current hero description */}
        <div style={{ minWidth: 140 }}>
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.22 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.26em", textTransform: "uppercase" }}>{hero.tag} — {hero.name}</p>
              <p style={{ color: "rgba(185,154,91,0.35)", fontSize: "0.36rem", letterSpacing: "0.15em", marginTop: 2 }}>{hero.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center: pill indicators */}
        <div style={{ display: "flex", gap: "clamp(0.5rem,2vw,1.2rem)", alignItems: "center" }}>
          {HEROES.map((h, i) => (
            <button key={h.id} onClick={() => go(i)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: "4px 6px",
              opacity: i === active ? 1 : 0.35, transition: "opacity .25s",
            }}>
              <div style={{ width: i === active ? 30 : 18, height: 2, borderRadius: 1, backgroundColor: i === active ? GOLD : "rgba(185,154,91,0.5)", transition: "all .3s" }} />
              <span style={{ fontSize: "0.37rem", letterSpacing: "0.2em", textTransform: "uppercase", color: i === active ? GOLD_DIM : "rgba(185,154,91,0.4)" }}>{h.name}</span>
            </button>
          ))}
        </div>

        {/* Right: back + selected */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", height: 34, padding: "0 14px", borderRadius: 6, border: `1px solid ${GOLD_FAINT}`, color: "rgba(185,154,91,0.45)", fontSize: "0.4rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }}>
            ← BACK
          </Link>
          <div style={{ display: "inline-flex", alignItems: "center", height: 34, padding: "0 14px", borderRadius: 6, backgroundColor: GOLD, color: "#050505", fontSize: "0.4rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap" }}>
            ✓ {hero.name}
          </div>
        </div>
      </div>
    </div>
  );
}
