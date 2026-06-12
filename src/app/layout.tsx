import type { Metadata } from "next";
import { Cinzel, Inter, Rakkas } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InstagramPopup from "@/components/ui/InstagramPopup";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const rakkas = Rakkas({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic-calligraphy",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Nakama Store Morocco — Decorative Wooden Katanas",
  description:
    "Decorative wooden katanas inspired by Japanese legends. Black Dragon & White Dragon. Free delivery across Morocco. For decoration only.",
  keywords: ["katana", "decorative", "wooden", "Morocco", "anime", "Black Dragon", "White Dragon"],
};

// Inline script — runs synchronously before React hydrates.
// Reads saved theme from localStorage and sets data-theme on <html>.
// This prevents the flash of wrong theme on first load.
const themeScript = `
(function(){
  try{
    var t=localStorage.getItem('nakama-theme');
    if(t==='white-dragon'||t==='black-dragon'){
      document.documentElement.setAttribute('data-theme',t);
    } else {
      document.documentElement.setAttribute('data-theme','black-dragon');
    }
  }catch(e){
    document.documentElement.setAttribute('data-theme','black-dragon');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="black-dragon"
      suppressHydrationWarning
      className={`${cinzel.variable} ${inter.variable} ${rakkas.variable}`}
    >
      <head>
        {/* Anti-flicker: set theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <InstagramPopup />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
