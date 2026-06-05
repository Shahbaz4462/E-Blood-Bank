"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapSelection from "@/components/MapSelection";

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "donor";

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    password: "",
    role: initialRole,
    bloodGroup: "A+",
    address: "",
    phone: "",
    latitude: null,
    longitude: null,
    city: "",
    province: "",
    country: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register(formData);
      if (user) {
        router.push(`/dashboard/${user.role}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full glass-card space-y-8 animate-fade-in z-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
        <p className="mt-2 text-muted">Join our life-saving community today.</p>
      </div>

      {error && (
        <div className="alert-error text-sm font-medium">
          {error}
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label>Full Name</label>
            <input name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div>
            <label>Email Address</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" />
          </div>
          <div>
            <label>Password</label>
            <div className="relative">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••"
                className="pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88 3 3"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line><path d="M10.47 10.47a3.38 3.38 0 0 0 4.06 4.06"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label>Account Type</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="organization">Organization</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label>Contact Number</label>
              <input name="phone" required value={formData.phone} onChange={handleChange} placeholder="03001234567" />
            </div>
          </div>
          <div>
            <label>Address</label>
            <input name="address" required value={formData.address} onChange={handleChange} placeholder="Street, City, Country" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Pin Location on Map</label>
            <MapSelection
              onLocationSelect={(loc) => {
                setFormData((prev: any) => ({
                  ...prev,
                  address: loc.address,
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                  city: loc.city,
                  province: loc.province,
                  country: loc.country,
                }));
              }}
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-4">
          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </div>
      </form>

      <div className="text-center pt-6 border-t border-border">
        <p className="text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 py-20 relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <Suspense fallback={<div className="text-center text-muted">Loading register options...</div>}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
