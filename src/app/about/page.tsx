"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PageShell } from "@/components/shared/PageShell";
import { SectionHeader } from "@/components/shared/SectionHeader";

const PHILOSOPHY = [
  {
    ja: "デザイン",
    en: "DESIGN",
    body: "Each model carries a distinct visual identity — the White Dragon for clean elegance, the Black Dragon for bold presence. Every curve, detail, and finish is chosen to create a piece worth displaying.",
  },
  {
    ja: "細部",
    en: "DETAIL",
    body: "Lacquered finishes, precision-shaped guards, and wrapped handles give each katana a premium, collector-level appearance. The details are what make the difference.",
  },
  {
    ja: "雰囲気",
    en: "ATMOSPHERE",
    body: "A decorative katana transforms a space. Whether displayed on a wall, shelf, or stand, it brings a cinematic Japanese atmosphere into any room.",
  },
];

export default function AboutPage() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const glassBg = isBlack ? "rgba(14,14,14,0.72)" : "rgba(248,243,233,0.72)";

  return (
    <PageShell>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "55svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(3rem,8vw,7rem) clamp(1.5rem,5vw,4rem)",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Subtle background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(/images/hero/hero-${isBlack ? "black" : "white"}-desktop.png)`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.18,
          transition: "opacity 0.6s ease",
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: "var(--bg)", opacity: 0.72 }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            ar="قصة المجموعة"
            ja="物語"
            en={"STORY OF\nDRAGON COLLECTION"}
            sub="Nakama brings Japanese-inspired decorative katanas to collectors, anime lovers, and anyone who wants to elevate their space with a piece of visual art."
            size="lg"
          />
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)", maxWidth: 780, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.5rem" }}>
            <div style={{ height: 1, flex: 1, backgroundColor: "var(--gold)", opacity: 0.22 }} />
            <span style={{ color: "var(--gold)", fontSize: "0.5rem", opacity: 0.5 }}>◆</span>
            <div style={{ height: 1, flex: 1, backgroundColor: "var(--gold)", opacity: 0.22 }} />
          </div>

          {[
            "NAKAMA STORE brought these Souls to life. From shadow and light, the Black and White Dragons were born.",
            "For centuries, in a world ruled by chaos and despair, the Black Dragon awakened. A force born from darkness… feared across every realm. A blade for Dark Souls, shadow warriors, and broken heroes who walk alone through destiny.",
            "Then, one day… came the light. From the highest realms of purity, the White Dragon was forged. A symbol of honor, clarity, and divine discipline. Chosen by guardians… protectors of balance… warriors of destiny.",
            "Two Dragons. Two Purposes. One World. This is not just a collection. This is a legacy of warriors.",
          ].map((para, i) => (
            <p key={i} style={{ color: "var(--text-muted)", fontSize: "clamp(0.9rem,1.5vw,1.05rem)", lineHeight: 1.75 }}>
              {para}
            </p>
          ))}
        </motion.div>
      </section>

      {/* Philosophy cards */}
      <section style={{ padding: "0 clamp(1.5rem,5vw,4rem) clamp(3rem,6vw,5rem)" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(2rem,4vw,3rem)" }}>
          <p style={{ color: "var(--gold)", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.75 }}>
            OUR PHILOSOPHY
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "clamp(1rem,2.5vw,1.8rem)",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {PHILOSOPHY.map(({ ja, en, body }, i) => (
            <motion.div
              key={en}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.12 }}
              style={{
                background: glassBg,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(185,154,91,0.2)",
                borderRadius: 14,
                padding: "clamp(1.5rem,3vw,2.2rem)",
                transition: "border-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.55)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.2)";
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              <p style={{ color: "var(--gold)", opacity: 0.68, fontSize: "0.82rem", letterSpacing: "0.3em", marginBottom: "0.5rem" }}>
                {ja}
              </p>
              <h3 className="font-heading" style={{ fontSize: "clamp(1.4rem,2.5vw,1.8rem)", letterSpacing: "0.06em", color: "var(--text)", marginBottom: "1rem", lineHeight: 1 }}>
                {en}
              </h3>
              <div style={{ width: 28, height: 1, backgroundColor: "var(--gold)", opacity: 0.35, marginBottom: "1rem" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.7 }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)",
          borderTop: "1px solid rgba(185,154,91,0.14)",
        }}
      >
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1.5rem" }}>
            Two dragons. One collection.
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 transition-all duration-300"
            style={{
              height: 52, padding: "0 32px", borderRadius: 8,
              backgroundColor: "var(--gold)", color: "var(--bg)",
              fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
          >
            EXPLORE THE COLLECTION <ChevronRight size={13} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </section>
    </PageShell>
  );
}
