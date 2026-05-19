"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/admin", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "User Management", href: "/dashboard/admin/users", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: "Blood Requests", href: "/dashboard/admin/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="m17 5-5-3-5 3"></path><path d="m17 19-5 3-5-3"></path><circle cx="12" cy="12" r="3"></circle></svg> },
    { name: "Profile", href: "/dashboard/admin/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout title="Admin Command Center" items={sidebarItems}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="icon-box icon-box-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h3 className="text-muted text-sm font-semibold mb-1">Total Donors</h3>
            <p className="text-3xl font-extrabold text-primary">{stats.totalDonors || 0}</p>
          </div>
          <div className="stat-card">
            <div className="icon-box icon-box-info mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <h3 className="text-muted text-sm font-semibold mb-1">Recipients</h3>
            <p className="text-3xl font-extrabold text-accent">{stats.totalRecipients || 0}</p>
          </div>
          <div className="stat-card">
            <div className="icon-box icon-box-warning mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </div>
            <h3 className="text-muted text-sm font-semibold mb-1">Organizations</h3>
            <p className="text-3xl font-extrabold text-warning">{stats.totalOrganizations || 0}</p>
          </div>
          <div className="stat-card">
            <div className="icon-box icon-box-success mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <h3 className="text-muted text-sm font-semibold mb-1">Total Donations</h3>
            <p className="text-3xl font-extrabold text-success">{stats.totalDonations || 0}</p>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h2 className="text-xl font-bold">Recent Registrations</h2>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="p-10 text-center text-muted-foreground">Fetching latest data...</div>
            ) : (
              <div className="divide-y divide-border">
                {stats.recentUsers?.map((u: any) => (
                  <div key={u._id} className="p-6 flex justify-between items-center hover:bg-card-hover transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center font-bold text-muted">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold">{u.name}</h4>
                        <p className="text-xs text-muted">{u.email} • <span className="capitalize">{u.role}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</p>
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
