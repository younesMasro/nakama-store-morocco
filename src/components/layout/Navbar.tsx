"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

const NAV_LINKS = [
  { label: "Catalogue", href: "#catalogue" },
  { label: "Quality",   href: "#quality"   },
  { label: "Contact",   href: "#contact"   },
];

export default function Navbar() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── header background ── */
  const headerStyle: React.CSSProperties = scrolled
    ? {
        backgroundColor: isBlack
          ? "rgba(5, 5, 5, 0.65)"
          : "rgba(247, 242, 232, 0.65)",
        borderBottom: isBlack
          ? "1px solid rgba(185, 154, 91, 0.22)"
          : "1px solid rgba(185, 154, 91, 0.25)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }
    : {
        backgroundColor: "transparent",
        borderBottom: "1px solid transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      };

  const iconColor = "var(--text)";
  const mutedColor = "var(--text-muted)";
  const goldColor  = "var(--gold)";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={headerStyle}
    >
      <div className="max-w-screen-2xl mx-auto px-5 md:px-8 h-16 md:h-[76px] flex items-center">

        {/* ── LEFT: desktop nav links / mobile hamburger ── */}
        <div className="flex items-center w-1/3">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[0.65rem] tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: mutedColor }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = goldColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = mutedColor; }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 -ml-1 transition-colors duration-300"
            aria-label="Open menu"
            style={{ color: iconColor }}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── CENTER: brand text logo ── */}
        <div className="flex flex-1 justify-center">
          <Link
            href="#hero"
            className="flex flex-col items-center gap-[2px] select-none"
            aria-label="Nakama Store Morocco — home"
          >
            <span
              className="font-heading text-[1.05rem] md:text-[1.25rem] tracking-[0.32em] uppercase leading-none"
              style={{ color: "var(--text)" }}
            >
              NAKAMA
            </span>
            <span
              className="text-[0.45rem] md:text-[0.5rem] tracking-[0.38em] uppercase"
              style={{ color: goldColor, opacity: 0.85 }}
            >
              STORE MOROCCO
            </span>
          </Link>
        </div>

        {/* ── RIGHT: theme toggle (desktop) + cart ── */}
        <div className="flex items-center justify-end gap-4 md:gap-5 w-1/3">
          {/* Theme toggle — desktop only, compact */}
          <div className="hidden md:block">
            <ThemeToggle compact />
          </div>

          <Link
            href="#order"
            className="p-1.5 transition-colors duration-300"
            aria-label="Go to order"
            style={{ color: iconColor }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = goldColor; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = iconColor; }}
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </header>
  );
}
