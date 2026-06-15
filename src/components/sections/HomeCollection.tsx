"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const DRAGONS = [
  {
    slug:    "black-dragon",
    ar:      "التنين الأسود",
    ja:      "黒い龍",
    title:   "BLACK DRAGON",
    tagline: "POWER • MYSTERY • SHADOW",
    desc:    "For bold interiors, collectors, anime fans, and gaming setups.",
    bg:      "black",
  },
  {
    slug:    "white-dragon",
    ar:      "التنين الأبيض",
    ja:      "白い龍",
    title:   "WHITE DRAGON",
    tagline: "PURE • HONOR • LIGHT",
    desc:    "For collectors, anime lovers, and refined room decoration.",
    bg:      "white",
  },
] as const;

interface Props {
  images?:   { "black-dragon"?: string | null; "white-dragon"?: string | null };
  showHero?: boolean;
}

export default function HomeCollection({ images = {}, showHero = false }: Props) {
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
          ? "clamp(5.5rem,10vw,9rem) clamp(1.5rem,5vw,4rem) clamp(4rem,8vw,7rem)"
          : "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)",
      }}
    >
      {/* Atmospheric background — only on homepage */}
      {showHero && (
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: isBlack
              ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(185,154,91,0.07) 0%, transparent 70%)"
              : "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(185,154,91,0.10) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
            background: isBlack
              ? "linear-gradient(180deg, transparent, rgba(5,5,5,0.6))"
              : "linear-gradient(180deg, transparent, rgba(247,242,232,0.6))",
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
          style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vw,4rem)" }}
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(1rem,2.5vw,2rem)",
            maxWidth: 980,
            margin: "0 auto",
          }}
        >
          {DRAGONS.map(({ slug, ar, ja, title, tagline, desc, bg }, i) => {
            const imgSrc = images[slug] ?? clientImages[slug] ?? null;
            return (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.65, delay: i * 0.12 }}
            >
              <Link
                href={`/product/${slug}`}
                style={{
                  display: "block",
                  position: "relative",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(185,154,91,0.2)",
                  transition: "border-color 0.35s ease, transform 0.35s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(185,154,91,0.6)";
                  el.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(185,154,91,0.2)";
                  el.style.transform = "";
                }}
              >
                {/* BG */}
                <div style={{
                  position: "absolute", inset: 0, zIndex: 0,
                  backgroundImage: `url(/images/hero/hero-${bg}-desktop.png)`,
                  backgroundSize: "cover", backgroundPosition: "center",
                }} />
                <div style={{
                  position: "absolute", inset: 0, zIndex: 1,
                  backgroundColor: isBlack ? "rgba(4,4,4,0.72)" : "rgba(248,243,233,0.76)",
                }} />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 2, padding: "clamp(1.5rem,3vw,2.2rem)" }}>
                  <p className="arabic-kicker" style={{ fontSize: "clamp(1.1rem,2vw,1.5rem)", marginBottom: "0.2rem" }}>{ar}</p>
                  <p style={{ color: "var(--gold)", opacity: 0.65, fontSize: "0.68rem", letterSpacing: "0.34em", textTransform: "uppercase", marginBottom: "1.2rem" }}>{ja}</p>

                  {/* Product image */}
                  <div style={{ height: "clamp(160px,18vw,220px)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.2rem" }}>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={title}
                        style={{ maxHeight: "100%", maxWidth: "60%", objectFit: "contain", filter: bg === "black" ? "drop-shadow(0 8px 24px rgba(0,0,0,0.6))" : "drop-shadow(0 8px 24px rgba(95,65,30,0.22))" }}
                      />
                    ) : (
                      <div style={{ width: 2, height: "75%", borderRadius: 1, background: `rgba(185,154,91,${isBlack ? 0.07 : 0.11})` }} />
                    )}
                  </div>

                  <h3 className="font-heading" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", lineHeight: 0.92, color: "var(--text)", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>{title}</h3>
                  <p style={{ color: "var(--gold)", fontSize: "0.55rem", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>{tagline}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>{desc}</p>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--gold)", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    VIEW DETAILS <ChevronRight size={12} strokeWidth={1.5} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
          })}
        </div>

        {/* CTA */}
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
