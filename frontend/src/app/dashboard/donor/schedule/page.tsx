"use client";

import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";

export default function ScheduleDonationPage() {
  const { user } = useAuth();

  const sidebarItems = [
    { 
      name: "Overview", 
      href: "/dashboard/donor", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    },
    { 
      name: "Donations", 
      href: "/dashboard/donor/history", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
    },
    { 
      name: "Blood Requests", 
      href: "/dashboard/donor/requests", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
    },
    { 
      name: "Profile", 
      href: "/dashboard/donor/profile", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    },
  ];

  return (
    <DashboardLayout title="Schedule a Donation" items={sidebarItems}>
      <div className="max-w-4xl mx-auto dashboard-card">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground">Appointment Details</h2>
          <p className="text-sm text-muted">Choose a location and time that works for you.</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Blood Bank / Organization</label>
              <select className="w-full px-4 py-3 bg-background-secondary border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
                <option>City Blood Bank - Main Center</option>
                <option>Red Cross Donation Hub</option>
                <option>General Medical Hospital</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Preferred Date</label>
              <input type="date" className="w-full px-4 py-3 bg-background-secondary border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Time Slot</label>
              <select className="w-full px-4 py-3 bg-background-secondary border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
                <option>09:00 AM - 10:00 AM</option>
                <option>11:00 AM - 12:00 PM</option>
                <option>02:00 PM - 03:00 PM</option>
                <option>04:00 PM - 05:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Donation Type</label>
              <select className="w-full px-4 py-3 bg-background-secondary border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
                <option>Whole Blood</option>
                <option>Plasma</option>
                <option>Platelets</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button type="button" className="flex-grow bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-colors shadow-lg shadow-primary/20">
              Confirm Appointment
            </button>
            <Link href="/dashboard/donor" className="px-8 py-4 text-muted font-medium hover:text-foreground dark:hover:text-white transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
