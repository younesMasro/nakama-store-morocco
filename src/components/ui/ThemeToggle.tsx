"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

interface ThemeToggleProps {
  /** Compact mode: shorter labels, fits in the navbar */
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isBlack = theme === "black-dragon";

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className="relative flex items-center rounded-full overflow-hidden"
      style={{
        border: "1px solid var(--gold)",
        backgroundColor: "var(--surface)",
        padding: "2px",
      }}
    >
      {/* Sliding gold indicator */}
      <div
        aria-hidden
        className="absolute top-[2px] bottom-[2px] rounded-full transition-all duration-500 ease-in-out"
        style={{
          width: "calc(50% - 2px)",
          left: isBlack ? "2px" : "calc(50%)",
          backgroundColor: "var(--gold)",
          opacity: 0.15,
          border: "1px solid var(--gold)",
        }}
      />

      {/* Black Dragon */}
      <button
        onClick={() => setTheme("black-dragon")}
        className="relative z-10 rounded-full transition-all duration-300 cursor-pointer"
        aria-pressed={isBlack}
        style={{
          padding: compact ? "4px 10px" : "6px 14px",
          fontSize: compact ? "0.58rem" : "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "var(--font-inter, sans-serif)",
          color: isBlack ? "var(--gold)" : "var(--text-muted)",
          fontWeight: isBlack ? 500 : 400,
          whiteSpace: "nowrap",
        }}
      >
        {compact ? (
          <>
            <span className="hidden lg:inline">Black Dragon</span>
            <span className="lg:hidden">Black</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Black Dragon</span>
            <span className="sm:hidden">Black</span>
          </>
        )}
      </button>

      {/* White Dragon */}
      <button
        onClick={() => setTheme("white-dragon")}
        className="relative z-10 rounded-full transition-all duration-300 cursor-pointer"
        aria-pressed={!isBlack}
        style={{
          padding: compact ? "4px 10px" : "6px 14px",
          fontSize: compact ? "0.58rem" : "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "var(--font-inter, sans-serif)",
          color: !isBlack ? "var(--gold)" : "var(--text-muted)",
          fontWeight: !isBlack ? 500 : 400,
          whiteSpace: "nowrap",
        }}
      >
        {compact ? (
          <>
            <span className="hidden lg:inline">White Dragon</span>
            <span className="lg:hidden">White</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">White Dragon</span>
            <span className="sm:hidden">White</span>
          </>
        )}
      </button>
    </div>
  );
}
