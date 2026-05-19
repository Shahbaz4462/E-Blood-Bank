"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        <div className="page-prose max-w-none space-y-6">
          <p>Last updated: May 10, 2024</p>
          <section>
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>By accessing or using E-Blood Bank, you agree to be bound by these terms.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">2. User Conduct</h2>
            <p>Users are responsible for the accuracy of the information they provide. Any misuse of the platform for purposes other than blood donation coordination is strictly prohibited.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">3. Limitation of Liability</h2>
            <p>E-Blood Bank is a platform for connection and coordination. We are not responsible for the actual medical procedures or the quality of blood provided by donors.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
