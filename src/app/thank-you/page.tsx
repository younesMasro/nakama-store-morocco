"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, MessageCircle, LayoutGrid, Phone, Gift } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { site } from "@/data/site";
import InstagramPopup from "@/components/ui/InstagramPopup";

function fmtAmt(n: number): string { return n.toLocaleString("en-US"); }

interface StoredOrder {
  orderId:     string | number;
  name:        string;
  blackQty:    number;
  whiteQty:    number;
  blackUnit:   number;
  whiteUnit:   number;
  accessories: { name: string; quantity: number; price: number }[];
  hasBundle:   boolean;
  grandTotal:  number;
}

function ThankYouContent() {
  const params     = useSearchParams();
  const { theme }  = useTheme();
  const isBlack    = theme === "black-dragon";

  const orderId = params.get("orderId") ?? `NK-${Date.now()}`;
  const name    = params.get("name")    ?? "Customer";

  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("nakama-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  /* Build WhatsApp message */
  const waMsg = encodeURIComponent(
    `🗡️ *Order Confirmation — Nakama Store Morocco*\n\nOrder ID: ${orderId}\nName: ${name}` +
    (order
      ? `\nTotal: ${fmtAmt(order.grandTotal)} DH\n\nPlease confirm my order. شكراً!`
      : `\n\nPlease confirm my order. شكراً!`)
  );
  const waHref = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${waMsg}`;

  const glassBg  = isBlack ? "rgba(14,14,14,0.80)" : "rgba(247,242,232,0.88)";
  const bgKey    = theme === "white-dragon" ? "white" : "black";

  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const item:    Variants = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };

  /* Build order lines for display */
  const lines: { label: string; value: string; green?: boolean; gift?: boolean }[] = [];
  if (order) {
    if (order.blackQty > 0) lines.push({ label: `Black Dragon × ${order.blackQty}`, value: `${fmtAmt(order.blackUnit * order.blackQty)} DH` });
    if (order.whiteQty > 0) lines.push({ label: `White Dragon × ${order.whiteQty}`, value: `${fmtAmt(order.whiteUnit * order.whiteQty)} DH` });
    for (const a of order.accessories) {
      lines.push({ label: `${a.name} × ${a.quantity}`, value: `${fmtAmt(a.price * a.quantity)} DH` });
    }
    if (order.hasBundle) lines.push({ label: "Double Display Stand × 1", value: "FREE GIFT", green: true, gift: true });
    lines.push({ label: "Delivery", value: "FREE", green: true });
  }

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img src={`/images/hero/hero-${bgKey}-desktop.png`} alt="" aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: isBlack ? "rgba(0,0,0,0.72)" : "rgba(248,243,235,0.82)" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(5rem,8vw,6rem) clamp(1.25rem,5vw,3rem) clamp(2rem,4vw,4rem)" }}>
        <motion.div variants={stagger} initial="hidden" animate="visible"
          style={{ maxWidth: 620, width: "100%", display: "flex", flexDirection: "column", gap: "1.75rem" }}
        >
          {/* Check icon */}
          <motion.div variants={item} style={{ display: "flex", justifyContent: "center" }}>
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid var(--gold)", background: "radial-gradient(circle at center, rgba(185,154,91,0.18) 0%, transparent 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <CheckCircle2 size={36} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={item} style={{ textAlign: "center" }}>
            <p className="arabic-kicker" style={{ fontSize: "clamp(1.4rem,3.5vw,1.8rem)", marginBottom: 6 }}>شكراً لطلبك</p>
            <h1 className="font-heading uppercase" style={{ fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "0.06em", lineHeight: 1, color: "var(--text)", marginBottom: 10 }}>
              ORDER CONFIRMED
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.65 }}>
              Merci, <strong style={{ color: "var(--text)" }}>{name}</strong>. Votre commande a été reçue.
              Notre équipe va vous appeler bientôt pour confirmer les détails.
            </p>
          </motion.div>

          {/* Order card */}
          <motion.div variants={item}
            style={{ borderRadius: 16, border: "1px solid rgba(185,154,91,0.22)", backgroundColor: glassBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            <p style={{ fontSize: "0.46rem", letterSpacing: "0.36em", color: "var(--gold)", opacity: 0.65, textTransform: "uppercase" }}>
              ORDER DETAILS
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", letterSpacing: "0.08em", flexShrink: 0 }}>Order ID</span>
              <span style={{ color: "var(--text)", fontSize: "0.82rem", textAlign: "right" }}>{String(orderId)}</span>
            </div>

            {/* Product lines */}
            {lines.map(({ label, value, green, gift }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", letterSpacing: "0.08em", flexShrink: 0, display: "flex", alignItems: "center", gap: 5 }}>
                  {gift && <Gift size={11} strokeWidth={1.5} style={{ color: "var(--gold)" }} />}
                  {label}
                </span>
                <span style={{ color: green ? "var(--gold)" : "var(--text)", fontSize: "0.82rem", textAlign: "right", fontWeight: green ? 700 : 400 }}>{value}</span>
              </div>
            ))}

            {/* Grand total */}
            {order && (
              <>
                <div style={{ height: 1, backgroundColor: "rgba(185,154,91,0.16)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
                  <span style={{ color: "var(--gold)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>Total</span>
                  <span className="font-heading" style={{ color: "var(--text)", fontSize: "1.4rem", lineHeight: 1 }}>
                    {fmtAmt(order.grandTotal)} <span style={{ fontSize: "0.6rem", color: "var(--gold)", letterSpacing: "0.18em" }}>DH</span>
                  </span>
                </div>
              </>
            )}

            <div style={{ height: 1, backgroundColor: "rgba(185,154,91,0.16)" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", lineHeight: 1.6 }}>
                🚚 <strong style={{ color: "var(--text)" }}>Livraison gratuite</strong> partout au Maroc · Délai: <strong style={{ color: "var(--text)" }}>24H – 48H</strong>
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", lineHeight: 1.6 }}>
                💳 <strong style={{ color: "var(--text)" }}>Paiement à la livraison</strong> — aucun paiement en ligne requis.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.68rem", lineHeight: 1.6, opacity: 0.75, marginTop: 2 }}>
                Notre équipe va vous appeler dans les <strong style={{ color: "var(--text)" }}>24 heures</strong> pour confirmer votre commande.
              </p>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, height: 52, borderRadius: 12, backgroundColor: "var(--gold)", color: "var(--bg)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none" }}
            >
              <MessageCircle size={16} strokeWidth={1.8} />
              FOLLOW UP ON WHATSAPP
            </a>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <Link href="/catalogue"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, height: 46, borderRadius: 10, border: "1px solid rgba(185,154,91,0.36)", color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", backgroundColor: "rgba(185,154,91,0.08)", backdropFilter: "blur(6px)", textDecoration: "none" }}>
                <LayoutGrid size={13} strokeWidth={1.5} /> CATALOGUE
              </Link>
              <Link href="/contact"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, height: 46, borderRadius: 10, border: "1px solid rgba(185,154,91,0.36)", color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", backgroundColor: "rgba(185,154,91,0.08)", backdropFilter: "blur(6px)", textDecoration: "none" }}>
                <Phone size={13} strokeWidth={1.5} /> CONTACT US
              </Link>
            </div>
          </motion.div>

          <motion.p variants={item} style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.6rem", opacity: 0.45, letterSpacing: "0.1em" }}>
            NAKAMA STORE MOROCCO · FOR DECORATION ONLY · نكاما ستور المغرب
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100svh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.3em", opacity: 0.5 }}>LOADING…</p>
      </div>
    }>
      <ThankYouContent />
      <InstagramPopup delayMs={2000} />
    </Suspense>
  );
}
