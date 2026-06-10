"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const badges = [
  "Wooden decorative katana",
  "Free delivery across Morocco",
  "For decoration only",
];

export default function ThemeDemoSection() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
    >

      {/* ─── HERO BACKGROUND IMAGES ─── */}
      {/* Two <picture> elements, one per theme, crossfading with opacity */}

      {/* BLACK DRAGON background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: isBlack ? 1 : 0, transition: "opacity 0.75s ease", zIndex: 0 }}
      >
        <picture style={{ display: "block", position: "absolute", inset: 0 }}>
          <source media="(min-width: 768px)" srcSet="/images/hero/hero-black-desktop.png" />
          <img
            src="/images/hero/hero-black-mobile.png"
            alt=""
            fetchPriority="high"
            className="hero-bg-img"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </picture>
      </div>

      {/* WHITE DRAGON background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: isBlack ? 0 : 1, transition: "opacity 0.75s ease", zIndex: 0 }}
      >
        <picture style={{ display: "block", position: "absolute", inset: 0 }}>
          <source media="(min-width: 768px)" srcSet="/images/hero/hero-white-desktop.png" />
          <img
            src="/images/hero/hero-white-mobile.png"
            alt=""
            fetchPriority="high"
            className="hero-bg-img"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </picture>
      </div>

      {/* ─── OVERLAYS — keep text readable ─── */}

      {/* Black Dragon overlay: dark vignette, heavier at bottom */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          opacity: isBlack ? 1 : 0,
          transition: "opacity 0.75s ease",
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.55) 60%, rgba(5,5,5,0.75) 100%)",
        }}
      />

      {/* White Dragon overlay: soft ivory wash, heavier at bottom */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          opacity: isBlack ? 0 : 1,
          transition: "opacity 0.75s ease",
          background:
            "linear-gradient(to bottom, rgba(251,247,239,0.15) 0%, rgba(247,242,232,0.45) 60%, rgba(251,247,239,0.70) 100%)",
        }}
      />

      {/* Extra center glow to lift content off background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: isBlack
            ? "radial-gradient(ellipse at 50% 60%, rgba(5,5,5,0.40) 0%, transparent 65%)"
            : "radial-gradient(ellipse at 50% 60%, rgba(251,247,239,0.35) 0%, transparent 65%)",
          transition: "background 0.75s ease",
        }}
      />

      {/* ─── CONTENT ─── */}
      <div
        className="relative flex flex-col items-center text-center px-6 gap-8 max-w-2xl mx-auto"
        style={{ zIndex: 10 }}
      >

        {/* Logo: light variant on dark bg, dark variant on light bg */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative h-16 md:h-20"
          style={{ width: 260 }}
        >
          {/* Light logo — shown in Black Dragon mode */}
          <Image
            src="/images/logo/logo-light.png"
            alt="Nakama Store Morocco"
            fill
            className="object-contain object-center"
            priority
            style={{ opacity: isBlack ? 1 : 0, transition: "opacity 0.55s ease" }}
          />
          {/* Dark logo — shown in White Dragon mode */}
          <Image
            src="/images/logo/logo-dark.png"
            alt=""
            fill
            className="object-contain object-center"
            priority
            style={{ opacity: isBlack ? 0 : 1, transition: "opacity 0.55s ease" }}
          />
        </motion.div>

        {/* Kanji */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ color: "var(--gold)", letterSpacing: "0.5em", fontSize: "1.1rem" }}
        >
          仲間
        </motion.p>

        {/* Store name + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          <h1
            className="font-heading text-3xl md:text-5xl font-medium tracking-[0.12em] uppercase"
            style={{
              color: "var(--text)",
              textShadow: isBlack
                ? "0 2px 20px rgba(0,0,0,0.8)"
                : "0 2px 12px rgba(251,247,239,0.7)",
            }}
          >
            Nakama Store Morocco
          </h1>
          <p
            className="text-sm md:text-base font-light leading-relaxed max-w-md"
            style={{
              color: "var(--text-muted)",
              textShadow: isBlack
                ? "0 1px 8px rgba(0,0,0,0.6)"
                : "0 1px 6px rgba(251,247,239,0.6)",
            }}
          >
            Decorative wooden katanas inspired by Japanese legends.
          </p>
        </motion.div>

        {/* Active theme badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <span
            className="text-xs tracking-widest uppercase px-4 py-1.5"
            style={{
              border: "1px solid var(--gold)",
              color: "var(--gold)",
              backgroundColor: isBlack
                ? "rgba(5,5,5,0.55)"
                : "rgba(251,247,239,0.55)",
              backdropFilter: "blur(4px)",
            }}
          >
            {isBlack ? "黒い龍 · Black Dragon" : "白い龍 · White Dragon"}
          </span>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {badges.map((b) => (
            <span
              key={b}
              className="text-xs px-3 py-1.5 tracking-wide"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                backgroundColor: isBlack
                  ? "rgba(5,5,5,0.50)"
                  : "rgba(251,247,239,0.55)",
                backdropFilter: "blur(4px)",
              }}
            >
              {b}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="#catalogue" className="btn-gold">
            Explore Catalogue
          </Link>
          <Link
            href="#contact"
            className="btn-outline"
            style={{
              backdropFilter: "blur(4px)",
              backgroundColor: isBlack
                ? "rgba(5,5,5,0.30)"
                : "rgba(251,247,239,0.35)",
            }}
          >
            Contact Us
          </Link>
        </motion.div>

        {/* Theme toggle in-hero (demo) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-col items-center gap-2 mt-2"
        >
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--text-muted)", opacity: 0.7 }}
          >
            Switch Theme
          </p>
          <ThemeToggle />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <div
          className="w-px h-10"
          style={{
            background: `linear-gradient(to bottom, transparent, var(--gold))`,
          }}
        />
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: "var(--gold)", opacity: 0.5 }}
        >
          Scroll
        </p>
      </motion.div>
    </section>
  );
}
