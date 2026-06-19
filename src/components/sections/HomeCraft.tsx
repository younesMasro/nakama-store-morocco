"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Leaf, Shield, Truck, Star, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const WHY = [
  { Icon: Leaf,   title: "Decorative Wood",         body: "Shaped and lacquered for visual impact. Each piece is designed to look premium on display." },
  { Icon: Shield, title: "For Collectors",           body: "Not a toy. Not a replica. A display piece made for people who care about aesthetics and atmosphere." },
  { Icon: Truck,  title: "Free Delivery in Morocco", body: "We deliver across Morocco at no extra cost." },
  { Icon: Star,   title: "Two Signature Models",    body: "The Black Dragon and the White Dragon. Two personalities, one collection, made for your space." },
];

export default function HomeCraft() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const glassBg = isBlack ? "rgba(14,14,14,0.72)" : "rgba(248,243,233,0.72)";

  return (
    <>
      {/* Final CTA — Claim Your Dragon */}
      <section
        id="contact"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)",
          textAlign: "center",
          borderTop: "1px solid rgba(185,154,91,0.12)",
        }}
      >
        {/* Subtle bg */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(/images/hero/hero-${isBlack ? "black" : "white"}-desktop.png)`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08,
          transition: "opacity 0.6s ease",
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: "var(--bg)", opacity: 0.85 }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
          >
            <p className="arabic-kicker" style={{ fontSize: "clamp(1.2rem,2.5vw,1.8rem)", marginBottom: "0.4rem" }}>
              اطلب الآن
            </p>
            <p style={{ color: "var(--gold)", opacity: 0.68, fontSize: "0.72rem", letterSpacing: "0.38em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
              ご注文
            </p>
            <h2 className="font-heading uppercase" style={{ fontSize: "clamp(2.2rem,5vw,4.5rem)", lineHeight: 0.92, letterSpacing: "0.04em", color: "var(--text)", marginBottom: "1rem" }}>
              CLAIM YOUR DRAGON
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.88rem,1.5vw,1rem)", lineHeight: 1.65, maxWidth: 500, margin: "0 auto 2rem" }}>
              Free delivery across Morocco. Your dragon will arrive safely packaged within 24–48 hours.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 transition-all duration-300"
                style={{
                  height: 52, padding: "0 28px", borderRadius: 8,
                  backgroundColor: "var(--gold)", color: "var(--bg)",
                  fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
              >
                ORDER NOW
              </Link>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 transition-all duration-300"
                style={{
                  height: 52, padding: "0 28px", borderRadius: 8,
                  border: "1px solid rgba(185,154,91,0.4)", color: "var(--gold)",
                  fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase",
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "var(--gold)"; el.style.color = "var(--bg)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "transparent"; el.style.color = "var(--gold)"; }}
              >
                VIEW COLLECTION <ChevronRight size={13} strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why collectors choose it */}
      <section
        id="quality"
        style={{
          backgroundColor: "var(--bg)",
          borderTop: "1px solid rgba(185,154,91,0.12)",
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vw,3.5rem)" }}
        >
          <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.78, marginBottom: "0.5rem" }}>
            WHY CHOOSE US
          </p>
          <h2 className="font-heading uppercase" style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", lineHeight: 0.95, letterSpacing: "0.04em", color: "var(--text)" }}>
            MADE TO BE SEEN
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(0.85rem,2vw,1.4rem)",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {WHY.map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: i * 0.09 }}
              style={{
                background: glassBg,
                border: "1px solid rgba(185,154,91,0.18)",
                borderRadius: 12,
                padding: "1.5rem",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                transition: "border-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(185,154,91,0.5)"; el.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(185,154,91,0.18)"; el.style.transform = ""; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(185,154,91,0.26)", backgroundColor: "rgba(185,154,91,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Icon size={15} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
              </div>
              <h3 style={{ color: "var(--text)", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.5rem", letterSpacing: "0.04em" }}>{title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.80rem", lineHeight: 1.65 }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
