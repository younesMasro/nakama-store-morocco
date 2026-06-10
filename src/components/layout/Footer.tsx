import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="py-16 px-6"
      style={{
        backgroundColor: "var(--bg-soft)",
        borderTop: "1px solid var(--border)",
        transition: "background-color 0.5s ease, border-color 0.5s ease",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
        <Image
          src="/images/logo/logo-dark.png"
          alt="Nakama"
          width={110}
          height={38}
          className="h-9 w-auto opacity-70"
        />

        <p className="text-sm max-w-md font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Decorative wooden katanas inspired by Japanese legends. Made for collectors, anime lovers, and premium room decoration.
          <br />
          <span className="text-xs mt-1 block" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
            For decoration only. Not a real weapon.
          </span>
        </p>

        <div
          className="flex items-center gap-6 text-xs tracking-widest uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          <Link href="#catalogue" className="hover:opacity-100 opacity-60 transition-opacity">Catalogue</Link>
          <Link href="#order" className="hover:opacity-100 opacity-60 transition-opacity">Order</Link>
          <Link href="#faq" className="hover:opacity-100 opacity-60 transition-opacity">FAQ</Link>
        </div>

        <Link
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm opacity-50 hover:opacity-80 transition-opacity"
          style={{ color: "var(--text-muted)" }}
        >
          <ExternalLink size={14} />
          <span>@nakama_store_morocco</span>
        </Link>

        <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.3 }}>
          © {new Date().getFullYear()} Nakama Store Morocco. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
