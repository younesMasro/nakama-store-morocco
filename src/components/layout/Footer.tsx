"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ExternalLink, Mail } from "lucide-react";
import { site } from "@/data/site";
import { useTheme } from "@/components/providers/ThemeProvider";

const NAV = [
  { label: "Catalogue",      href: "/catalogue" },
  { label: "About",          href: "/about"     },
  { label: "Quality",        href: "/quality"   },
  { label: "Contact",        href: "/contact"   },
  { label: "Privacy Policy", href: "/privacy"   },
];

export default function Footer() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const whatsappHref = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;

  return (
    <footer
      style={{
        backgroundColor: isBlack ? "rgba(5,5,5,0.98)" : "rgba(245,239,228,0.98)",
        borderTop: "1px solid rgba(185,154,91,0.18)",
        transition: "background-color 0.5s ease",
      }}
    >
      {/* Main footer */}
      <div
        className="max-w-screen-xl mx-auto px-6 py-12"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem" }}
      >
        {/* Brand */}
        <div>
          <Link href="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
            <Image
              src={isBlack ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png"}
              alt="Nakama Store Morocco"
              width={140}
              height={42}
              style={{ height: 36, width: "auto", objectFit: "contain" }}
            />
          </Link>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.65, maxWidth: "240px" }}>
            Decorative wooden katanas that embody the spirit of the Samurai legacy, honor and discipline. Your gate to Japanese tradition, designed for collectors and premium room decoration.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.68rem", opacity: 0.5, marginTop: "0.75rem" }}>
            For decoration only. Not a real weapon.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "1.2rem", opacity: 0.82 }}>
            NAVIGATION
          </p>
          <nav className="flex flex-col gap-3">
            {NAV.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ color: "var(--text-muted)", fontSize: "0.82rem", letterSpacing: "0.06em", opacity: 0.75, transition: "opacity 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Collection */}
        <div>
          <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "1.2rem", opacity: 0.82 }}>
            COLLECTION
          </p>
          <nav className="flex flex-col gap-3">
            {[
              { label: "Black Dragon", href: "/product/black-dragon" },
              { label: "White Dragon", href: "/product/white-dragon" },
              { label: "Get Yours",    href: "/product/black-dragon" },
              { label: "Cart",         href: "/cart"                 },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ color: "var(--text-muted)", fontSize: "0.82rem", letterSpacing: "0.06em", opacity: 0.75, transition: "opacity 0.2s" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.color = "var(--gold)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.75"; el.style.color = "var(--text-muted)"; }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "1.2rem", opacity: 0.82 }}>
            CONTACT
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
              style={{ color: "var(--text-muted)", fontSize: "0.82rem", opacity: 0.75, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.75"; el.style.color = "var(--text-muted)"; }}
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
              style={{ color: "var(--text-muted)", fontSize: "0.82rem", opacity: 0.75, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.75"; el.style.color = "var(--text-muted)"; }}
            >
              <ExternalLink size={13} />
              @nakama_store_morocco
            </a>
            <a
              href="mailto:nakama.store.morocco@gmail.com"
              className="flex items-center gap-2"
              style={{ color: "var(--text-muted)", fontSize: "0.82rem", opacity: 0.75, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.75"; el.style.color = "var(--text-muted)"; }}
            >
              <Mail size={13} />
              nakama.store.morocco@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(185,154,91,0.10)",
          padding: "1.2rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "0.68rem", opacity: 0.4 }}>
          © {new Date().getFullYear()} Nakama Store Morocco. All rights reserved.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.68rem", opacity: 0.4, letterSpacing: "0.12em" }}>
          FOR DECORATION ONLY · NOT A WEAPON
        </p>
      </div>
    </footer>
  );
}
