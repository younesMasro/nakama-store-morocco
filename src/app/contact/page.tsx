"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle, ExternalLink, ChevronRight, Send } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PageShell } from "@/components/shared/PageShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { site } from "@/data/site";

type Model = "black-dragon" | "white-dragon";

interface FormState {
  name: string;
  phone: string;
  city: string;
  model: Model;
  message: string;
}

export default function ContactPage() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const glassBg = isBlack ? "rgba(14,14,14,0.78)" : "rgba(248,243,233,0.82)";
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "", phone: "", city: "", model: "black-dragon", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim()) {
      setError("Please fill in your name, phone, and city.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name,
          phone: form.phone,
          city: form.city,
          address: form.city,
          model: form.model,
          qty: 1,
          notes: form.message,
        }),
      });
      router.push(`/thank-you?name=${encodeURIComponent(form.name)}&model=${form.model}&qty=1`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    padding: "0 14px",
    borderRadius: 8,
    border: "1px solid rgba(185,154,91,0.28)",
    backgroundColor: isBlack ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    color: "var(--text)",
    fontSize: "0.88rem",
    outline: "none",
    transition: "border-color 0.2s ease",
    fontFamily: "var(--font-inter, sans-serif)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "var(--gold)",
    fontSize: "0.58rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    marginBottom: "0.45rem",
    opacity: 0.85,
  };

  return (
    <PageShell>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "44svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(3rem,8vw,7rem) clamp(1.5rem,5vw,4rem)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(/images/hero/hero-${isBlack ? "black" : "white"}-desktop.png)`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.14,
          transition: "opacity 0.6s ease",
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: "var(--bg)", opacity: 0.76 }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            ar="اطلب الآن"
            ja="連絡"
            en="ORDER YOUR DRAGON"
            sub="Orders are confirmed directly. Reach us by WhatsApp, fill the form below, or follow us on Instagram."
            size="lg"
          />
        </div>
      </section>

      <section style={{ padding: "0 clamp(1.5rem,5vw,4rem) clamp(3rem,6vw,5rem)", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(1.5rem,3vw,2.5rem)" }}>

          {/* Contact options */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "1.5rem", opacity: 0.82 }}>
              REACH US
            </p>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 transition-all duration-300"
              style={{
                background: glassBg,
                border: "1px solid rgba(185,154,91,0.22)",
                borderRadius: 12,
                padding: "1.25rem 1.5rem",
                marginBottom: "1rem",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.55)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.22)"; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: "rgba(185,154,91,0.12)", border: "1px solid rgba(185,154,91,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MessageCircle size={18} style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <p style={{ color: "var(--text)", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.2rem" }}>WhatsApp</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Fastest way to order</p>
              </div>
              <ChevronRight size={14} style={{ color: "var(--gold)", marginLeft: "auto", opacity: 0.6 }} />
            </a>

            {/* Instagram */}
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 transition-all duration-300"
              style={{
                background: glassBg,
                border: "1px solid rgba(185,154,91,0.22)",
                borderRadius: 12,
                padding: "1.25rem 1.5rem",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.55)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.22)"; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: "rgba(185,154,91,0.12)", border: "1px solid rgba(185,154,91,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ExternalLink size={18} style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <p style={{ color: "var(--text)", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.2rem" }}>Instagram</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>@nakama_store_morocco</p>
              </div>
              <ChevronRight size={14} style={{ color: "var(--gold)", marginLeft: "auto", opacity: 0.6 }} />
            </a>

            {/* Email */}
            <a
              href="mailto:contact@nakamastore.ma"
              className="flex items-center gap-4 transition-all duration-300"
              style={{
                background: glassBg,
                border: "1px solid rgba(185,154,91,0.22)",
                borderRadius: 12,
                padding: "1.25rem 1.5rem",
                marginTop: "1rem",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.55)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.22)"; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: "rgba(185,154,91,0.12)", border: "1px solid rgba(185,154,91,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Send size={18} style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <p style={{ color: "var(--text)", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.2rem" }}>Email</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>contact@nakamastore.ma</p>
              </div>
              <ChevronRight size={14} style={{ color: "var(--gold)", marginLeft: "auto", opacity: 0.6 }} />
            </a>

            {/* Info note */}
            <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: 8, border: "1px solid rgba(185,154,91,0.14)", backgroundColor: isBlack ? "rgba(185,154,91,0.04)" : "rgba(185,154,91,0.06)" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.65 }}>
                Our NAKAMA STORE team will get back to you as soon as possible.
              </p>
            </div>
          </motion.div>

          {/* Order form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "1.5rem", opacity: 0.82 }}>
              ORDER FORM
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                background: glassBg,
                border: "1px solid rgba(185,154,91,0.22)",
                borderRadius: 12,
                padding: "1.5rem",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
              }}
            >
              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" style={inputStyle} />
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Phone / WhatsApp</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+212 6XX XXX XXX" style={inputStyle} />
              </div>

              {/* City */}
              <div>
                <label style={labelStyle}>City</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="Your city in Morocco" style={inputStyle} />
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Message (optional)</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any special notes for your order"
                  rows={3}
                  style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "none" }}
                />
              </div>

              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.72rem" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  height: 50, borderRadius: 8, border: "none", cursor: loading ? "default" : "pointer",
                  backgroundColor: "var(--gold)", color: "var(--bg)",
                  fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500,
                  marginTop: "0.25rem", opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
              >
                <Send size={13} />
                {loading ? "SENDING..." : "PLACE ORDER"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
