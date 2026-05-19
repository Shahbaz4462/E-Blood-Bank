import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

async function getStats() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${API_URL}/public/stats`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const stats = (await getStats()) || { donors: 0, livesSaved: 0, hospitals: 0, requests: 0 };

  const statItems = [
    { label: "Verified Donors", value: stats.donors, accent: "text-primary", iconBg: "icon-box-primary", icon: "🩸" },
    { label: "Lives Saved", value: stats.livesSaved, accent: "text-success", iconBg: "icon-box-success", icon: "❤️" },
    { label: "Partner Groups", value: stats.hospitals, accent: "text-info", iconBg: "icon-box-info", icon: "🏥" },
    { label: "Urgent Requests", value: stats.requests, accent: "text-warning", iconBg: "icon-box-warning", icon: "📋" },
  ];

  const features = [
    { title: "Real-time Search", icon: "📍", desc: "Find available donors in your area instantly when it matters most." },
    { title: "Secure Data", icon: "🔒", desc: "Your privacy is our priority. We use elite encryption for all records." },
    { title: "Expert Support", icon: "🏥", desc: "Connected with the best medical facilities and verified blood banks." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40 border-b border-border">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto animate-fade-in space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary border border-border text-foreground text-sm font-medium shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Professional Blood Bank Network
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Every Donation is a <br className="hidden sm:block" />
                <span className="text-primary">Gift of Life.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
                Join our professional community today. We connect donors with those in need, making blood donation simple, fast, and secure.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/register?role=donor" className="btn-primary text-base px-8 py-3">
                  Donate Blood
                </Link>
                <Link href="/register?role=recipient" className="btn-outline text-base px-8 py-3">
                  Find Donors
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statItems.map((stat, i) => (
                <div key={i} className="stat-card flex items-center gap-4">
                  <div className={`icon-box ${stat.iconBg} text-xl`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${stat.accent}`}>
                      {stat.value}+
                    </p>
                    <p className="text-sm font-medium text-muted">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 section-muted">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">How it Works</h2>
              <p className="text-muted text-lg">
                A professional and secure platform designed for maximum life-saving impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="glass-card text-center sm:text-left flex flex-col items-center sm:items-start"
                >
                  <div className="w-12 h-12 rounded-lg bg-background-secondary border border-border flex items-center justify-center text-xl mb-6">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{f.title}</h3>
                  <p className="text-muted leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="glass-card border border-border rounded-2xl p-10 md:p-16 text-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                  Start Saving Lives Today
                </h2>
                <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
                  Join our elite network of donors and healthcare professionals. Your single donation can save up to three lives.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/register"
                    className="btn-primary text-base px-8 py-3"
                  >
                    Join Now
                  </Link>
                  <Link
                    href="/about"
                    className="btn-outline text-base px-8 py-3"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
