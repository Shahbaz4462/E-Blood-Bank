"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/organization", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "Inventory", href: "/dashboard/organization/inventory", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
    { name: "Donations", href: "/dashboard/organization/donations", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> },
    { name: "Community Requests", href: "/dashboard/organization/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: "Profile", href: "/dashboard/organization/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, transRes] = await Promise.all([
          api.get("/organization/stats"),
          api.get("/organization/transactions?limit=5")
        ]);
        setStats(statsRes.data);
        setActivities(transRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="Organization Dashboard" items={sidebarItems}>
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card">
            <h3 className="text-muted text-sm font-semibold mb-1">Daily Volume</h3>
            <p className="text-3xl font-extrabold text-foreground">{stats.daily || 0}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-muted text-sm font-semibold mb-1">Weekly Growth</h3>
            <p className="text-3xl font-extrabold text-success">+{stats.weekly || 0}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-muted text-sm font-semibold mb-1">Monthly Total</h3>
            <p className="text-3xl font-extrabold text-primary">{stats.monthly || 0}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-muted text-sm font-semibold mb-1">Total Impact</h3>
            <p className="text-3xl font-extrabold text-foreground">{stats.total || 0}</p>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Recent Activities</h2>
            <Link href="/dashboard/organization/donations" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="p-20 text-center text-muted-foreground font-medium italic">Loading activities...</div>
            ) : activities.length === 0 ? (
              <div className="p-20 text-center text-muted-foreground font-medium italic">No activities found yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {activities.map((activity: any) => (
                  <div 
                    key={activity._id} 
                    className="p-8 hover:bg-card-hover transition-all cursor-pointer group"
                    onClick={() => alert(`Details:\n\nType: ${activity.type}\nGroup: ${activity.bloodGroup}\nUnits: ${activity.quantity}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-6">
                        <div className="blood-group-badge w-14 h-14 text-xl">
                          {activity.bloodGroup}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground capitalize text-lg">{activity.type.replace('_', ' ')}</h4>
                          <p className="text-sm text-muted font-medium">{activity.personName} • {activity.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-extrabold ${activity.type.includes('add') || activity.type === 'donation' ? 'text-success' : 'text-danger'}`}>
                          {activity.type.includes('add') || activity.type === 'donation' ? '+' : '-'}{activity.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-wider">{new Date(activity.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
