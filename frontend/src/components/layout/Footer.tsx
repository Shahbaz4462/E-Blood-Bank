"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
          <div className="space-y-6 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-xl">🩸</span>
              <span className="text-base font-bold text-foreground tracking-tight">
                E-Blood <span className="text-primary">Bank</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              A premium, secure blood donation management platform bridging the gap between lifesavers.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground tracking-wide">Platform</h4>
            <nav className="flex flex-col space-y-4 text-sm text-muted">
              <Link href="/about" className="hover:text-foreground transition-colors">About Us</Link>
              <Link href="/donors" className="hover:text-foreground transition-colors">Find Donors</Link>
              <Link href="/requests" className="hover:text-foreground transition-colors">Blood Requests</Link>
              <Link href="/hospitals" className="hover:text-foreground transition-colors">Our Partners</Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground tracking-wide">Support</h4>
            <nav className="flex flex-col space-y-4 text-sm text-muted">
              <Link href="/faq" className="hover:text-foreground transition-colors">Help Center</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground tracking-wide">Contact Us</h4>
            <div className="flex flex-col space-y-3 text-sm text-muted">
              <p className="font-semibold text-foreground">Muhammad Shahbaz</p>
              <p className="text-foreground">03058804309</p>
              <p className="text-muted">shahbaz04462@gmail.com</p>
            </div>
            <p className="text-xs text-muted-foreground pt-4">© {new Date().getFullYear()} E-Blood Bank Global.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
