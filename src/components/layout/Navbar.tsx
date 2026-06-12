"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, ChevronRight, MessageCircle, AtSign, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCart } from "@/components/providers/CartProvider";
import { site } from "@/data/site";

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "About",     href: "/about"     },
  { label: "Quality",   href: "/quality"   },
  { label: "Contact",   href: "/contact"   },
];

const CONTACTS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`,
    external: true,
  },
  {
    icon: AtSign,
    label: "Instagram",
    href: site.instagram,
    external: true,
  },
  {
    icon: Mail,
    label: "contact@nakamastore.ma",
    href: "mailto:contact@nakamastore.ma",
    external: false,
  },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { totalCount } = useCart();
  const isBlack  = theme === "black-dragon";
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const headerBg  = scrolled ? (isBlack ? "rgba(5,5,5,0.72)" : "rgba(247,242,232,0.82)") : "transparent";
  const goldColor = "var(--gold)";
  const iconColor = "var(--text)";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: headerBg,
          borderBottom: scrolled ? "1px solid rgba(185,154,91,0.22)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-5 md:px-8 h-16 md:h-[76px] flex items-center">

          {/* LEFT: desktop nav / mobile hamburger */}
          <div className="flex items-center w-1/3">
            <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-[0.65rem] tracking-[0.2em] uppercase transition-colors duration-300"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = goldColor; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <button
              className="md:hidden p-1 -ml-1 transition-colors duration-300"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{ color: iconColor }}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>

          {/* CENTER: logo */}
          <div className="flex flex-1 justify-center">
            <Link href="/" aria-label="Go to homepage" style={{ display: "inline-flex", alignItems: "center" }}>
              <Image
                src={isBlack ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png"}
                alt="Nakama Store Morocco"
                width={160}
                height={48}
                priority
                style={{ height: "clamp(32px, 5.5vw, 42px)", width: "auto", objectFit: "contain", maxWidth: "clamp(110px, 20vw, 165px)" }}
              />
            </Link>
          </div>

          {/* RIGHT: theme toggle + cart */}
          <div className="flex items-center justify-end gap-3 md:gap-4 w-1/3">
            <div className="hidden md:block">
              <ThemeToggle compact />
            </div>

            {/* Mobile-only pill toggle (黒 / 白) */}
            <div className="flex md:hidden items-center" style={{
              borderRadius: 999,
              border: "1px solid rgba(185,154,91,0.3)",
              padding: 3,
              gap: 2,
              backgroundColor: isBlack ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            }}>
              {(["black-dragon", "white-dragon"] as const).map((slug) => {
                const active = theme === slug;
                return (
                  <button
                    key={slug}
                    onClick={() => setTheme(slug)}
                    title={slug === "black-dragon" ? "Black Dragon" : "White Dragon"}
                    style={{
                      borderRadius: 999,
                      padding: "3px 9px",
                      fontSize: "0.72rem",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      backgroundColor: active ? "var(--gold)" : "transparent",
                      color: active ? "#1a1206" : "var(--text-muted)",
                      fontWeight: active ? 700 : 400,
                      lineHeight: 1.3,
                    }}
                  >
                    {slug === "black-dragon" ? "黒" : "白"}
                  </button>
                );
              })}
            </div>

            <Link
              href="/cart"
              className="p-1.5 transition-colors duration-300"
              aria-label="Go to cart"
              style={{ color: iconColor, position: "relative" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = goldColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = iconColor; }}
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {totalCount > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 0,
                  minWidth: 16, height: 16, borderRadius: 8,
                  backgroundColor: "var(--gold)", color: "var(--bg)",
                  fontSize: "0.42rem", fontWeight: 700, lineHeight: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 3px",
                }}>
                  {totalCount > 9 ? "9+" : totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 md:hidden flex flex-col"
        style={{
          width: 290,
          backgroundColor: isBlack ? "rgba(5,5,5,0.97)" : "rgba(247,242,232,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(185,154,91,0.18)",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Drawer header: logo + close */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid rgba(185,154,91,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image
              src={isBlack ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png"}
              alt="Nakama"
              width={120}
              height={36}
              style={{ height: 32, width: "auto", objectFit: "contain" }}
            />
          </Link>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ color: "var(--text-muted)" }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ padding: "1.5rem 1.5rem 0", flex: 1, overflowY: "auto" }}>
          <p style={{ color: "var(--gold)", fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.75rem" }}>
            NAVIGATION
          </p>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between transition-colors duration-200"
              style={{ color: "var(--text-muted)", fontSize: "0.9rem", letterSpacing: "0.06em", padding: "0.75rem 0", borderBottom: "1px solid rgba(185,154,91,0.1)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = goldColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              {label}
              <ChevronRight size={14} strokeWidth={1.5} style={{ opacity: 0.4 }} />
            </Link>
          ))}

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between transition-colors duration-200"
            style={{ color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "0.04em", padding: "0.75rem 0", borderBottom: "1px solid rgba(185,154,91,0.1)" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              Cart
              {totalCount > 0 && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 9,
                  backgroundColor: "var(--gold)", color: "var(--bg)",
                  fontSize: "0.48rem", fontWeight: 700,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "0 4px",
                }}>
                  {totalCount > 9 ? "9+" : totalCount}
                </span>
              )}
            </span>
            <ChevronRight size={14} strokeWidth={1.5} style={{ opacity: 0.4 }} />
          </Link>
        </nav>

        {/* Contact section */}
        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid rgba(185,154,91,0.15)" }}>
          <p style={{ color: "var(--gold)", fontSize: "0.48rem", letterSpacing: "0.34em", textTransform: "uppercase", opacity: 0.62, marginBottom: "0.9rem" }}>
            CONTACT
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            {CONTACTS.map(({ icon: Icon, label, href, external }) => (
              <a
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: "0.72rem",
                  letterSpacing: "0.03em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = goldColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  border: "1px solid rgba(185,154,91,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  backgroundColor: isBlack ? "rgba(185,154,91,0.06)" : "rgba(185,154,91,0.08)",
                }}>
                  <Icon size={13} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
