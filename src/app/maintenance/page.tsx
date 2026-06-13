"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, ChevronRight, Loader2 } from "lucide-react";

export default function MaintenancePage() {
  const router  = useRouter();
  const [pw, setPw]       = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/maintenance", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.replace("/");
        router.refresh();
      } else {
        setError("Incorrect password.");
        setPw("");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100svh",
      backgroundColor: "#0a0a0a",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(185,154,91,0.07) 0%, transparent 65%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "var(--font-inter, sans-serif)",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: "2.5rem" }}>
        <Image
          src="/images/logo/logo-light.png"
          alt="Nakama Store Morocco"
          width={160}
          height={48}
          style={{ height: 40, width: "auto", objectFit: "contain", opacity: 0.9 }}
          priority
        />
      </div>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 380,
        borderRadius: 18,
        border: "1px solid rgba(185,154,91,0.25)",
        backgroundColor: "rgba(14,14,14,0.95)",
        backdropFilter: "blur(20px)",
        padding: "2.25rem 2rem",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(185,154,91,0.06)",
      }}>
        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            border: "1px solid rgba(185,154,91,0.3)",
            background: "radial-gradient(circle, rgba(185,154,91,0.12) 0%, transparent 70%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={20} strokeWidth={1.5} style={{ color: "#B99A5B" }} />
          </div>
        </div>

        {/* Heading */}
        <p style={{ textAlign: "center", fontSize: "0.44rem", letterSpacing: "0.42em", color: "#B99A5B", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.5rem" }}>
          تحت الإنشاء
        </p>
        <h1 style={{ textAlign: "center", fontFamily: "var(--font-cinzel, serif)", fontSize: "1.3rem", letterSpacing: "0.18em", color: "#F4F1EA", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          COMING SOON
        </h1>
        <p style={{ textAlign: "center", color: "rgba(244,241,234,0.38)", fontSize: "0.72rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          We're putting the final touches on something special.
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(185,154,91,0.25), transparent)", marginBottom: "1.75rem" }} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter access password"
              required
              style={{
                width: "100%",
                height: 48,
                borderRadius: 10,
                border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(185,154,91,0.25)"}`,
                backgroundColor: "rgba(255,255,255,0.04)",
                color: "#F4F1EA",
                fontSize: "0.82rem",
                padding: "0 44px 0 16px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(185,154,91,0.6)"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(185,154,91,0.25)"; }}
            />
          </div>

          {error && (
            <p style={{ color: "rgba(239,68,68,0.85)", fontSize: "0.68rem", letterSpacing: "0.04em", margin: "-0.2rem 0 0 2px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !pw}
            style={{
              height: 48, borderRadius: 10, border: "none",
              backgroundColor: pw && !loading ? "#B99A5B" : "rgba(185,154,91,0.25)",
              color: pw && !loading ? "#0a0a0a" : "rgba(185,154,91,0.4)",
              fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700,
              cursor: pw && !loading ? "pointer" : "not-allowed",
              transition: "all 0.25s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            {loading
              ? <Loader2 size={14} strokeWidth={2} style={{ animation: "spin 1s linear infinite" }} />
              : <><span>ENTER</span><ChevronRight size={13} strokeWidth={2} /></>
            }
          </button>
        </form>
      </div>

      {/* Footer */}
      <p style={{ marginTop: "2rem", color: "rgba(185,154,91,0.3)", fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>
        NAKAMA STORE MOROCCO
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
