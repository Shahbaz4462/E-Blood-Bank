"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="page-prose max-w-none space-y-6">
          <p>Last updated: May 10, 2024</p>
          <section>
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, update your profile, or request blood donations. This includes your name, email, phone number, and blood group.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p>We use the information we collect to connect donors with recipients, facilitate blood donations, and improve our services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
            <p>Your blood group and contact information may be shared with other users of the platform for the sole purpose of facilitating blood donations in emergencies.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
