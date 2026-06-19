"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";

const GOLD      = "rgba(185,154,91,1)";
const GOLD_DIM  = "rgba(185,154,91,0.72)";
const GOLD_FAINT= "rgba(185,154,91,0.22)";

/* ════════════════════════════════════════════════════════════════
   HERO 1 — MASKED
   The katana image shows ONLY through the giant letter shapes.
   Completely black background. Letter shapes are transparent
   windows into the product photo. Ultra-minimal and high-impact.
════════════════════════════════════════════════════════════════ */
function HeroMasked() {
  return (
    <div style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      backgroundColor: "#010101",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>

      {/* Product image — sits behind but is only revealed through the text clip */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url(/images/hero/hero-black-desktop.png)",
        backgroundSize: "cover", backgroundPosition: "center 30%",
        filter: "brightness(1.1) contrast(1.12) saturate(0.88)",
      }} />

      {/* Dark overlay — makes it black except where text exposes */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: "rgba(1,1,1,0.96)" }} />

      {/* CLIPPED TEXT BLOCK — image shows through letters */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative", zIndex: 10, textAlign: "center", lineHeight: 0.78, userSelect: "none" }}>

        <div style={{
          fontFamily: "var(--font-cinzel,serif)", fontWeight: 900,
          fontSize: "clamp(5rem,16vw,15rem)",
          letterSpacing: "-0.03em", lineHeight: 0.82,
          /* The magic: image as text fill, color transparent */
          backgroundImage: "url(/images/hero/hero-black-desktop.png)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "brightness(1.15) contrast(1.1)",
        }}>
          BLACK<br />DRAGON
        </div>
      </motion.div>

      {/* Arabic — below the big text */}
      <motion.p
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65 }}
        className="arabic-kicker"
        style={{ position: "relative", zIndex: 10, fontSize: "clamp(1.4rem,3vw,2.4rem)", marginTop: "clamp(0.8rem,2vh,1.4rem)", opacity: 0.82 }}>
        التنين الأسود
      </motion.p>

      {/* Subtitle row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.85 }}
        style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: "clamp(0.8rem,2vw,1.5rem)", marginTop: "clamp(1.2rem,3vh,2rem)", flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ color: "rgba(185,154,91,0.45)", fontSize: "0.44rem", letterSpacing: "0.36em", textTransform: "uppercase" }}>1,399 DH</span>
        <div style={{ width: 1, height: 14, backgroundColor: GOLD_FAINT }} />
        <span style={{ color: "rgba(185,154,91,0.45)", fontSize: "0.44rem", letterSpacing: "0.36em", textTransform: "uppercase" }}>FREE DELIVERY</span>
        <div style={{ width: 1, height: 14, backgroundColor: GOLD_FAINT }} />
        <span style={{ color: "rgba(185,154,91,0.45)", fontSize: "0.44rem", letterSpacing: "0.36em", textTransform: "uppercase" }}>MOROCCO</span>
      </motion.div>

      {/* CTA row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 1.05 }}
        style={{ position: "relative", zIndex: 10, display: "flex", gap: 10, marginTop: "clamp(1.5rem,3.5vh,2.5rem)" }}>
        <Link href="/checkout?product=black-dragon" onClick={e => e.stopPropagation()}
          style={{ height: 48, padding: "0 26px", background: GOLD, color: "#010101", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
          ORDER NOW
        </Link>
        <Link href="/product/black-dragon" onClick={e => e.stopPropagation()}
          style={{ height: 48, padding: "0 22px", border: `1px solid ${GOLD_FAINT}`, color: GOLD_DIM, fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
          VIEW DETAILS
        </Link>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO 2 — TILT
   The entire hero is a card in 3D space. Mouse moves rotate it
   (GSAP rotateX/Y). A glossy highlight follows the cursor like
   light catching a physical surface. Premium / game-like feel.
════════════════════════════════════════════════════════════════ */
function HeroTilt() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);
  const glossRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const r = sceneRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left)  / r.width  - 0.5;
    const y = (e.clientY - r.top)   / r.height - 0.5;
    gsap.to(cardRef.current, {
      rotateY:  x * 22,
      rotateX: -y * 14,
      duration: 0.9,
      ease: "power3.out",
      transformPerspective: 900,
    });
    if (glossRef.current) {
      const gx = 50 + x * 90;
      const gy = 50 + y * 90;
      glossRef.current.style.background = `radial-gradient(ellipse 52% 38% at ${gx}% ${gy}%, rgba(255,255,255,0.075) 0%, rgba(185,154,91,0.025) 40%, transparent 72%)`;
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 1.1, ease: "expo.out" });
    if (glossRef.current) glossRef.current.style.background = "none";
  }, []);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    el.addEventListener("mousemove", onMouseMove as EventListener);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove as EventListener);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, { opacity: 0, y: 40, scale: 0.97, duration: 1.1, ease: "expo.out", delay: 0.08 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sceneRef} style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      backgroundColor: "#080808", display: "flex", alignItems: "center", justifyContent: "center",
      perspective: "1200px", cursor: "none",
    }}>

      {/* Radial bg glow */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(185,154,91,0.055) 0%, transparent 70%)" }} />

      {/* The tilting card */}
      <div ref={cardRef} style={{
        position: "relative", width: "min(88%, 860px)", height: "min(82%, 520px)",
        borderRadius: 18, overflow: "hidden",
        border: `1px solid ${GOLD_FAINT}`,
        transformStyle: "preserve-3d",
        willChange: "transform",
        boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(185,154,91,0.08)",
      }}>
        {/* Card background — katana image */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "url(/images/hero/hero-black-desktop.png)",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.38) saturate(0.75)",
        }} />

        {/* Dark overlay gradient */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(135deg, rgba(5,5,5,0.72) 0%, rgba(5,5,5,0.22) 60%, rgba(5,5,5,0.62) 100%)" }} />

        {/* Gloss highlight — follows cursor */}
        <div ref={glossRef} aria-hidden style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", transition: "background 0.1s ease", borderRadius: 18 }} />

        {/* Card content */}
        <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(1.5rem,4vw,2.8rem)" }}>
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "0.44rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>NAKAMA STORE</p>
              <p style={{ color: "rgba(185,154,91,0.38)", fontSize: "0.36rem", letterSpacing: "0.26em", marginTop: 4 }}>MOROCCO · 2025</p>
            </div>
            <div style={{ padding: "5px 12px", borderRadius: 999, border: `1px solid ${GOLD_FAINT}`, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>
              <span style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.22em" }}>AVAILABLE</span>
            </div>
          </div>

          {/* Center: heading */}
          <div>
            <p className="arabic-kicker" style={{ fontSize: "clamp(1.4rem,2.8vw,2.2rem)", marginBottom: "0.5rem" }}>التنين الأسود</p>
            <h1 style={{ fontFamily: "var(--font-cinzel,serif)", fontWeight: 300, fontSize: "clamp(2.8rem,7vw,6rem)", lineHeight: 0.86, letterSpacing: "0.02em", color: "#F4F1EA" }}>
              BLACK<br />DRAGON
            </h1>
          </div>

          {/* Bottom row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link href="/checkout?product=black-dragon" onClick={e => e.stopPropagation()}
                style={{ height: 44, padding: "0 22px", background: GOLD, color: "#050505", fontSize: "0.56rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
                ORDER NOW
              </Link>
              <Link href="/product/black-dragon" onClick={e => e.stopPropagation()}
                style={{ height: 44, padding: "0 18px", border: `1px solid rgba(185,154,91,0.35)`, color: GOLD_DIM, fontSize: "0.56rem", letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
                VIEW DETAILS
              </Link>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-cinzel,serif)", fontSize: "clamp(1.4rem,2.4vw,1.9rem)", color: GOLD, lineHeight: 1 }}>1,399 <span style={{ fontSize: "0.48rem", color: GOLD_DIM }}>DH</span></p>
              <p style={{ color: "rgba(185,154,91,0.38)", fontSize: "0.36rem", letterSpacing: "0.22em", marginTop: 3 }}>FREE DELIVERY</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.42 }} transition={{ delay: 1.6, duration: 0.9 }}
        style={{ position: "absolute", bottom: "clamp(0.8rem,2vh,1.4rem)", left: "50%", transform: "translateX(-50%)", color: GOLD_DIM, fontSize: "0.37rem", letterSpacing: "0.28em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        MOVE CURSOR TO TILT THE CARD
      </motion.p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO 3 — STRIPS
   Three horizontal bands moving at different speeds in alternating
   directions. Product image is a fixed window between the strips.
   Pure motion-design energy.
════════════════════════════════════════════════════════════════ */
function HeroStrips() {
  const STRIP_1 = "BLACK DRAGON · NAKAMA STORE · MOROCCO · 1,399 DH · ";
  const STRIP_2 = "التنين الأسود · FREE DELIVERY · ORDER NOW · ";
  const STRIP_3 = "DECORATIVE KATANA · 103 CM · WOODEN BLADE · COLLECTOR EDITION · ";

  const strip = (text: string, dir: "left" | "right", speed: number, style?: React.CSSProperties) => (
    <div style={{ overflow: "hidden", position: "relative", ...style }}>
      <motion.div
        animate={{ x: dir === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        style={{ display: "flex", whiteSpace: "nowrap" }}>
        {[...Array(6)].map((_, i) => (
          <span key={i} style={{ paddingRight: "2.5rem", fontSize: "clamp(0.65rem,1.2vw,0.9rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(185,154,91,0.85)" }}>
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      backgroundColor: "#030303",
      display: "grid",
      gridTemplateRows: "1fr auto 1fr auto 1fr",
    }}>

      {/* Strip row 1 — moves left */}
      <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "clamp(0.5rem,1.5vh,1rem)" }}>
        {strip(STRIP_1, "left", 18, {})}
      </div>

      {/* Horizontal rule 1 */}
      <div style={{ height: 1, backgroundColor: GOLD_FAINT, margin: "0 clamp(1.5rem,5vw,4rem)" }} />

      {/* CENTER — fixed product image + main text */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(0.8rem,2vh,1.4rem) clamp(1.5rem,5vw,4rem)", gap: "clamp(1.5rem,4vw,3.5rem)", overflow: "hidden" }}>

        {/* Left text block */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22,1,0.36,1], delay: 0.15 }}
          style={{ flex: "0 0 auto", maxWidth: 340 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.4em", marginBottom: "0.7rem" }}>NAKAMA · MOROCCO</p>
          <p className="arabic-kicker" style={{ fontSize: "clamp(1.2rem,2.4vw,2rem)", marginBottom: "0.5rem" }}>التنين الأسود</p>
          <h1 style={{ fontFamily: "var(--font-cinzel,serif)", fontWeight: 900, fontSize: "clamp(2.2rem,5.5vw,4.8rem)", lineHeight: 0.86, color: "#F4F1EA", marginBottom: "clamp(0.8rem,2vh,1.4rem)" }}>
            BLACK<br />DRAGON
          </h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/checkout?product=black-dragon" onClick={e => e.stopPropagation()}
              style={{ height: 44, padding: "0 20px", background: GOLD, color: "#030303", fontSize: "0.54rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
              ORDER — 1,399 DH
            </Link>
            <Link href="/product/black-dragon" onClick={e => e.stopPropagation()}
              style={{ height: 44, padding: "0 16px", border: `1px solid ${GOLD_FAINT}`, color: GOLD_DIM, fontSize: "0.54rem", letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
              VIEW
            </Link>
          </div>
        </motion.div>

        {/* Center image — fixed, strips flow past it */}
        <motion.div initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: [0.22,1,0.36,1], delay: 0.08 }}
          style={{
            flex: "0 0 auto",
            width: "clamp(120px,22vw,260px)", aspectRatio: "0.52/1",
            backgroundImage: "url(/images/hero/hero-black-desktop.png)",
            backgroundSize: "contain", backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "drop-shadow(0 0 40px rgba(185,154,91,0.22))",
          }} />

        {/* Right stats */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22,1,0.36,1], delay: 0.22 }}
          style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: "clamp(0.8rem,2vh,1.5rem)" }}>
          {[["103 CM", "LENGTH"], ["1,399 DH", "PRICE"], ["24–48H", "DELIVERY"]].map(([v, l]) => (
            <div key={l} style={{ borderLeft: `2px solid ${GOLD_FAINT}`, paddingLeft: 14 }}>
              <p style={{ fontFamily: "var(--font-cinzel,serif)", fontSize: "clamp(1rem,1.8vw,1.4rem)", color: "#F4F1EA", lineHeight: 1 }}>{v}</p>
              <p style={{ fontSize: "0.36rem", letterSpacing: "0.24em", color: "rgba(185,154,91,0.42)", marginTop: 4 }}>{l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Horizontal rule 2 */}
      <div style={{ height: 1, backgroundColor: GOLD_FAINT, margin: "0 clamp(1.5rem,5vw,4rem)" }} />

      {/* Strip row 2 — alternating */}
      <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", paddingTop: "clamp(0.5rem,1.5vh,1rem)" }}>
        {strip(STRIP_2, "right", 14, { marginBottom: "clamp(0.4rem,1.2vh,0.8rem)" })}
        {strip(STRIP_3, "left", 22, {})}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO 4 — SPOTLIGHT
   Completely dark screen. The cursor IS the only light source.
   Moving the mouse reveals the katana photo underneath via a
   radial-gradient mask that follows the pointer position.
   Text is always visible. The product only exists in the light.
════════════════════════════════════════════════════════════════ */
function HeroSpotlight() {
  const maskRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  const onMove = useCallback((e: MouseEvent) => {
    if (!maskRef.current || !wrapRef.current) return;
    setEntered(true);
    const r = wrapRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    maskRef.current.style.maskImage        = `radial-gradient(circle 240px at ${x}% ${y}%, black 0%, rgba(0,0,0,0.55) 45%, transparent 100%)`;
    maskRef.current.style.webkitMaskImage  = `radial-gradient(circle 240px at ${x}% ${y}%, black 0%, rgba(0,0,0,0.55) 45%, transparent 100%)`;
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("mousemove", onMove as EventListener);
    return () => el.removeEventListener("mousemove", onMove as EventListener);
  }, [onMove]);

  return (
    <div ref={wrapRef} style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      backgroundColor: "#000", cursor: "crosshair",
    }}>

      {/* Katana image layer — masked to cursor */}
      <div ref={maskRef} aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1,
        backgroundImage: "url(/images/hero/hero-black-desktop.png)",
        backgroundSize: "cover", backgroundPosition: "center 30%",
        filter: "brightness(0.95) contrast(1.1)",
        maskImage: "radial-gradient(circle 240px at 50% 50%, black 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(circle 240px at 50% 50%, black 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
        transition: "mask-image 0.04s linear",
      }} />

      {/* Subtle background shadow so text is readable */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)" }} />

      {/* Always-visible text content — no masking */}
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(1.5rem,4vw,3rem)" }}>

        {/* Top */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>NAKAMA STORE</p>
            <p style={{ color: "rgba(185,154,91,0.38)", fontSize: "0.36rem", letterSpacing: "0.24em", marginTop: 4 }}>MOROCCO · 2025</p>
          </div>
          {!entered && (
            <motion.p animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2.2, repeat: Infinity }}
              style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>
              MOVE CURSOR TO REVEAL ↗
            </motion.p>
          )}
        </motion.div>

        {/* Center left — main heading */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22,1,0.36,1], delay: 0.18 }}>
          <p className="arabic-kicker" style={{ fontSize: "clamp(1.4rem,2.8vw,2.2rem)", marginBottom: "0.6rem" }}>التنين الأسود</p>
          <h1 style={{ fontFamily: "var(--font-cinzel,serif)", fontWeight: 300, fontSize: "clamp(3rem,8vw,7rem)", lineHeight: 0.84, letterSpacing: "0.02em", color: "#F4F1EA", mixBlendMode: "screen" }}>
            BLACK<br />DRAGON
          </h1>
        </motion.div>

        {/* Bottom */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/checkout?product=black-dragon" onClick={e => e.stopPropagation()}
              style={{ height: 48, padding: "0 24px", background: GOLD, color: "#000", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
              ORDER — 1,399 DH
            </Link>
            <Link href="/product/black-dragon" onClick={e => e.stopPropagation()}
              style={{ height: 48, padding: "0 20px", border: `1px solid ${GOLD_FAINT}`, color: GOLD_DIM, fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", borderRadius: 8 }}>
              VIEW DETAILS
            </Link>
          </div>
          <div style={{ display: "flex", gap: "clamp(0.8rem,2vw,1.8rem)" }}>
            {[["103 CM", "LENGTH"], ["FREE", "DELIVERY"], ["CASH", "ON DELIVERY"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-cinzel,serif)", fontSize: "clamp(0.85rem,1.4vw,1.1rem)", color: "#F4F1EA" }}>{v}</p>
                <p style={{ fontSize: "0.34rem", letterSpacing: "0.2em", color: "rgba(185,154,91,0.4)", marginTop: 2 }}>{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SHOWCASE WRAPPER
════════════════════════════════════════════════════════════════ */
const HEROES = [
  { id: 0, name: "MASKED",    tag: "01", desc: "Image through text · CSS clip",     Component: HeroMasked    },
  { id: 1, name: "TILT",      tag: "02", desc: "3D mouse tilt · Gloss highlight",   Component: HeroTilt      },
  { id: 2, name: "STRIPS",    tag: "03", desc: "Moving marquee strips · Fixed image",Component: HeroStrips    },
  { id: 3, name: "SPOTLIGHT", tag: "04", desc: "Dark reveal · Cursor as light",     Component: HeroSpotlight },
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
        setActive(a => { const n = Math.min(a + 1, HEROES.length - 1); setDirection(n > a ? 1 : -1); return n; });
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActive(a => { const n = Math.max(a - 1, 0); setDirection(n < a ? -1 : 1); return n; });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hero = HEROES[active];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", backgroundColor: "#050505" }}>

      {/* Hero display */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
              backdropFilter: "blur(8px)", color: disabled ? "rgba(185,154,91,0.15)" : GOLD_DIM,
              fontSize: "1rem", cursor: disabled ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
            }}>
            {label}
          </button>
        ))}

        {/* Badge — top right */}
        <div style={{ position: "absolute", top: 14, right: 14, zIndex: 30, backgroundColor: "rgba(5,5,5,0.58)", backdropFilter: "blur(10px)", border: `1px solid ${GOLD_FAINT}`, borderRadius: 24, padding: "6px 14px" }}>
          <span style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.28em" }}>{hero.tag} — {hero.name}</span>
        </div>

        {/* Keyboard hint */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ delay: 2.5, duration: 0.8 }}
          style={{ position: "absolute", top: 14, left: 14, zIndex: 30, color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          ← → NAVIGATE
        </motion.p>
      </div>

      {/* Bottom navigation bar */}
      <div style={{
        height: 64, backgroundColor: "#080808",
        borderTop: `1px solid ${GOLD_FAINT}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1rem,3vw,2rem)", flexShrink: 0, zIndex: 50, gap: 12,
      }}>
        {/* Left: current info */}
        <div style={{ minWidth: 130 }}>
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.46rem", letterSpacing: "0.24em", textTransform: "uppercase" }}>{hero.tag} — {hero.name}</p>
              <p style={{ color: "rgba(185,154,91,0.32)", fontSize: "0.34rem", letterSpacing: "0.14em", marginTop: 2 }}>{hero.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center: selectors */}
        <div style={{ display: "flex", gap: "clamp(0.5rem,2vw,1.2rem)", alignItems: "center" }}>
          {HEROES.map((h, i) => (
            <button key={h.id} onClick={() => go(i)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", opacity: i === active ? 1 : 0.32, transition: "opacity .25s" }}>
              <div style={{ width: i === active ? 28 : 16, height: 2, borderRadius: 1, backgroundColor: i === active ? GOLD : "rgba(185,154,91,0.5)", transition: "all .3s" }} />
              <span style={{ fontSize: "0.35rem", letterSpacing: "0.2em", textTransform: "uppercase", color: i === active ? GOLD_DIM : "rgba(185,154,91,0.38)" }}>{h.name}</span>
            </button>
          ))}
        </div>

        {/* Right: back + selected */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/" style={{ height: 34, padding: "0 14px", borderRadius: 6, border: `1px solid ${GOLD_FAINT}`, color: "rgba(185,154,91,0.42)", fontSize: "0.38rem", letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
            ← BACK
          </Link>
          <div style={{ height: 34, padding: "0 14px", borderRadius: 6, backgroundColor: GOLD, color: "#050505", fontSize: "0.38rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
            ✓ {hero.name}
          </div>
        </div>
      </div>
    </div>
  );
}
