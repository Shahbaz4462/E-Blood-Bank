"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  if (theme === "dark") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const publicLinks = [
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLandingPage = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  const hideAuthButtons = isAuthPage;

  const navLinkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href ? "text-foreground" : "text-muted hover:text-foreground"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 z-10">
          <span className="text-xl transition-transform group-hover:scale-105">🩸</span>
          <span className="text-base font-bold text-foreground tracking-tight">
            E-Blood <span className="text-primary">Bank</span>
          </span>
        </Link>

        {/* Clean centered nav */}
        {!isAuthPage && (
          <nav className={isLandingPage ? "nav-landing" : "hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"}>
            <Link href="/" className={navLinkClass("/")}>Home</Link>
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4 z-10">
          {!hideAuthButtons && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link href="/register" className="btn-primary py-1.5 px-4 text-sm">
                Sign up
              </Link>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border bg-card text-muted hover:text-foreground hover:border-foreground/20 transition-all flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <ThemeIcon theme={theme} />
          </button>

          {!hideAuthButtons && (
            <button
              className="lg:hidden p-2 rounded-full border border-border bg-card text-muted"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && !hideAuthButtons && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-lg border-b border-border shadow-lg animate-fade-in">
          <nav className="flex flex-col p-6 space-y-2">
            <Link href="/" className="px-4 py-3 rounded-xl text-foreground font-medium hover:bg-background-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href} className="px-4 py-3 rounded-xl text-foreground font-medium hover:bg-background-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-border flex flex-col gap-3">
              <Link href="/login" className="btn-secondary w-full py-2.5 text-center" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              <Link href="/register" className="btn-primary w-full py-2.5 text-center" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
