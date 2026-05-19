"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-md w-full glass-card space-y-8 text-center z-10">
          <div>
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              🔒
            </div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground">
              Forgot Password?
            </h2>
            <p className="mt-4 text-center text-muted leading-relaxed">
              For security purposes, self-service password resets are currently disabled. 
            </p>
            <p className="mt-4 text-center text-muted leading-relaxed font-bold">
              Please contact the Administrator from your registered email address to request a new password.
            </p>
          </div>

          <div className="bg-background-secondary p-6 rounded-2xl border border-border mt-8">
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-2">Admin Contact</p>
            <a href="mailto:shahbaz04462@gmail.com" className="text-lg font-bold text-primary hover:opacity-80 transition-colors">
              shahbaz04462@gmail.com
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Link href="/login" className="text-sm font-bold text-primary hover:opacity-80 transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
