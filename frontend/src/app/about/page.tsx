"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">About E-Blood Bank</h1>
        <div className="max-w-none space-y-6">
          <p className="text-lg text-muted">
            E-Blood Bank is a mission-driven platform dedicated to simplifying the process of blood donation. 
            Our goal is to save lives by bridging the gap between donors and those in need.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="glass-card">
              <h3 className="text-xl font-bold text-primary mb-2">Our Mission</h3>
              <p className="text-muted">To ensure that every person in need of blood has immediate access to a safe and reliable donor network.</p>
            </div>
            <div className="glass-card">
              <h3 className="text-xl font-bold text-primary mb-2">Our Vision</h3>
              <p className="text-muted">A world where no life is lost due to the unavailability of blood.</p>
            </div>
          </div>
          <section>
            <h2 className="text-2xl font-semibold text-foreground">Why Choose Us?</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>Real-time connection between donors and recipients.</li>
              <li>Verified organizations and secure data handling.</li>
              <li>Easy to use interface for emergency situations.</li>
              <li>Community driven and life-saving focus.</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
