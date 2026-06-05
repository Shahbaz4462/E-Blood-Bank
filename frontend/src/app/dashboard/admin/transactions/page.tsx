"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    bloodGroup: ""
  });

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/admin", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "User Management", href: "/dashboard/admin/users", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: "Blood Requests", href: "/dashboard/admin/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="m17 5-5-3-5 3"></path><path d="m17 19-5 3-5-3"></path><circle cx="12" cy="12" r="3"></circle></svg> },
    { name: "Profile", href: "/dashboard/admin/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/transactions`, { params: filters });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <DashboardLayout title="Platform Transactions" items={sidebarItems}>
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <h2 className="text-xl font-bold flex-1">All Activities</h2>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              className="input-field py-2 text-sm"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="donation">Donations</option>
              <option value="request">Requests</option>
              <option value="inventory_add">Stock Add</option>
              <option value="inventory_remove">Stock Remove</option>
            </select>
            <select 
              className="input-field py-2 text-sm"
              value={filters.bloodGroup}
              onChange={(e) => setFilters({...filters, bloodGroup: e.target.value})}
            >
              <option value="">All Groups</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary text-muted font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Blood</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Person/Location</th>
                  <th className="px-6 py-4 text-right">Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-20 text-center text-muted-foreground">Fetching transactions...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-20 text-center text-muted-foreground">No transactions found.</td></tr>
                ) : (
                  transactions.map((t: any) => (
                    <tr key={t._id} className="hover:bg-card-hover transition-colors cursor-pointer group" onClick={() => alert(`Full Details:\n\nType: ${t.type}\nBlood Group: ${t.bloodGroup}\nUnits: ${t.quantity}\nOrganization: ${t.organizationId?.name}\nPerson: ${t.personName}\nLocation: ${t.location}\nDate: ${new Date(t.createdAt).toLocaleString()}\nNote: ${t.note || 'None'}`)}>
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
                      <td className="px-6 py-4 font-bold text-primary">{t.bloodGroup}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold">{t.organizationId?.name}</div>
                        <div className="text-[10px] text-muted-foreground">{t.organizationId?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{t.personName}</div>
                        <div className="text-xs text-muted-foreground">{t.location}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-lg">{t.quantity} Units ({t.quantity * 500}ml)</td>
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
