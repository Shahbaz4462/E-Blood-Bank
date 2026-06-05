"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function OrganizationHistoryPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: ""
  });

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/organization", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "Inventory", href: "/dashboard/organization/inventory", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
    { name: "Donations", href: "/dashboard/organization/donations", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> },
    { name: "Profile", href: "/dashboard/organization/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [transRes, statsRes] = await Promise.all([
        api.get("/organization/transactions", { params: filters }),
        api.get("/organization/stats")
      ]);
      setTransactions(transRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetFilters = () => {
    setFilters({ startDate: "", endDate: "", type: "" });
  };

  return (
    <DashboardLayout title="Records & History" items={sidebarItems}>
      <div className="space-y-8">
        {/* Analytics Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h4 className="text-muted text-xs font-bold uppercase mb-2">Today</h4>
            <p className="text-2xl font-bold">{stats.daily || 0}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h4 className="text-muted text-xs font-bold uppercase mb-2">Weekly</h4>
            <p className="text-2xl font-bold">{stats.weekly || 0}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h4 className="text-muted text-xs font-bold uppercase mb-2">Monthly</h4>
            <p className="text-2xl font-bold">{stats.monthly || 0}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h4 className="text-muted text-xs font-bold uppercase mb-2">Total Records</h4>
            <p className="text-2xl font-bold">{stats.total || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-muted uppercase mb-1 block">Start Date</label>
            <input type="date" className="w-full px-4 py-2 bg-background-secondary rounded-lg text-sm" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-muted uppercase mb-1 block">End Date</label>
            <input type="date" className="w-full px-4 py-2 bg-background-secondary rounded-lg text-sm" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-muted uppercase mb-1 block">Type</label>
            <select className="w-full px-4 py-2 bg-background-secondary rounded-lg text-sm" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
              <option value="">All Types</option>
              <option value="donation">Donations</option>
              <option value="request">Blood Requests</option>
              <option value="inventory_add">Stock Add</option>
              <option value="inventory_remove">Stock Remove</option>
            </select>
          </div>
          <button onClick={resetFilters} className="px-6 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors">Reset</button>
        </div>

        {/* Transactions Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary text-muted font-medium">
                <tr>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Blood Group</th>
                  <th className="px-6 py-4">Person/Entity</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading records...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No records found for the selected period.</td></tr>
                ) : (
                  transactions.map((t: any) => (
                    <tr key={t._id} className="hover:bg-card-hover transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium">{new Date(t.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px] text-muted-foreground">{new Date(t.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.type.includes('add') || t.type === 'donation' ? 'badge-success' : 'badge-warning'
                        }`}>
                          {t.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center font-bold text-primary">{t.bloodGroup}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">{t.personName}</td>
                      <td className="px-6 py-4 text-muted">{t.location}</td>
                      <td className="px-6 py-4 text-right font-bold">{t.quantity} Units ({t.quantity * 500}ml)</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
