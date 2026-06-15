"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { site } from "@/data/site";

const SESSION_KEY = "nakama-ig-popup-dismissed";

export default function InstagramPopup({ delayMs = 2000 }: { delayMs?: number }) {
  const { theme } = useTheme();
  const isBlack   = theme === "black-dragon";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  }

  const glassBg = isBlack
    ? "rgba(8,8,8,0.92)"
    : "rgba(248,243,233,0.94)";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0, scale: 0.96 }}
          animate={{ y: 0,   opacity: 1, scale: 1    }}
          exit={{   y: 120, opacity: 0, scale: 0.96  }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          style={{
            position: "fixed",
            bottom: "clamp(1.25rem, 3vw, 2rem)",
            right:  "clamp(1rem, 3vw, 2rem)",
            zIndex: 9999,
            width: "min(320px, calc(100vw - 2rem))",
            borderRadius: 18,
            border: "1px solid rgba(185,154,91,0.35)",
            backgroundColor: glassBg,
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.42), 0 0 0 1px rgba(185,154,91,0.08)",
            overflow: "hidden",
          }}
        >
          {/* Gold top bar */}
          <div style={{ height: 3, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />

          {/* Dismiss */}
          <button
            onClick={dismiss}
            aria-label="Close"
            style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(185,154,91,0.12)",
              border: "1px solid rgba(185,154,91,0.2)",
              borderRadius: 6,
              width: 26, height: 26,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-muted)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "rgba(185,154,91,0.22)"; el.style.color = "var(--gold)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "rgba(185,154,91,0.12)"; el.style.color = "var(--text-muted)"; }}
          >
            <X size={13} strokeWidth={2} />
          </button>

          <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>
            {/* Icon + kicker */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              {/* Gradient Instagram ring */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(238,42,123,0.3)",
              }}>
                {/* Simple camera icon via SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="#fff" stroke="none" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "0.48rem", letterSpacing: "0.32em", color: "var(--gold)", textTransform: "uppercase", opacity: 0.75, marginBottom: 2 }}>
                  フォロー · FOLLOW US
                </p>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", letterSpacing: "0.03em" }}>
                  Instagram
                </p>
              </div>
            </div>

            {/* Handle */}
            <p style={{
              fontFamily: "var(--font-cinzel, serif)",
              fontSize: "1rem",
              letterSpacing: "0.08em",
              color: "var(--gold)",
              marginBottom: "0.35rem",
              lineHeight: 1.2,
            }}>
              @nakama_store_morocco
            </p>

            {/* Sub */}
            <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Katanas · Culture · Lifestyle — join our community and never miss a drop.
            </p>

            {/* Decorative rule */}
            <div style={{ height: 1, background: "linear-gradient(90deg, var(--gold), transparent)", opacity: 0.2, marginBottom: "1.25rem" }} />

            {/* CTA */}
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                height: 44, borderRadius: 10,
                background: "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)",
                color: "#fff",
                fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(238,42,123,0.28)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
              </svg>
              FOLLOW ON INSTAGRAM
            </a>

            {/* Maybe later */}
            <button
              onClick={dismiss}
              style={{
                width: "100%", marginTop: "0.6rem",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", fontSize: "0.58rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                opacity: 0.45, transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.45"; }}
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
