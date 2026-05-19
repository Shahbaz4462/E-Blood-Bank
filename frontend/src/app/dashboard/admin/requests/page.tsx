"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function AdminRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/admin", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "User Management", href: "/dashboard/admin/users", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: "Blood Requests", href: "/dashboard/admin/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="m17 5-5-3-5 3"></path><path d="m17 19-5 3-5-3"></path><circle cx="12" cy="12" r="3"></circle></svg> },
    { name: "Profile", href: "/dashboard/admin/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blood-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      try {
        await api.put(`/blood-requests/${id}/status`, { status: "Cancelled" });
        fetchAllRequests();
      } catch (err) {
        alert("Failed to delete request");
      }
    }
  };

  return (
    <DashboardLayout title="System Blood Requests" items={sidebarItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Request Monitoring</h2>
          <p className="text-sm text-muted">Track all blood requests and donation offers across the entire network</p>
        </div>

        <div className="bg-card rounded-[var(--radius-card)] shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-muted uppercase">Requester</th>
                  <th className="px-6 py-4 font-bold text-muted uppercase">Details</th>
                  <th className="px-6 py-4 font-bold text-muted uppercase">Accepted By</th>
                  <th className="px-6 py-4 font-bold text-muted uppercase">Blood Given</th>
                  <th className="px-6 py-4 font-bold text-muted uppercase">Blood Taken</th>
                  <th className="px-6 py-4 font-bold text-muted uppercase">Final Status</th>
                  <th className="px-6 py-4 font-bold text-muted uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">Loading system requests...</td></tr>
                ) : requests.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">No requests found in system.</td></tr>
                ) : (
                  requests.map((req: any) => (
                    <tr key={req._id} className="hover:bg-card-hover transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold">{req.requesterName}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{req.requesterRole}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary">{req.bloodGroup} • {req.units} Units</div>
                        <div className="text-xs text-muted">{req.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        {req.acceptedBy ? (
                          <div>
                            <div className="font-bold">{req.acceptedBy.name}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{req.acceptedByRole || "Donor"}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unaccepted</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${
                          req.donorConfirmed 
                            ? "bg-green-50 dark:bg-green-900/20 text-success border border-green-100 dark:border-green-800/30" 
                            : "bg-background-secondary text-muted"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${req.donorConfirmed ? "bg-success" : "bg-muted"}`}></span>
                          {req.donorConfirmed ? "Confirmed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${
                          req.recipientConfirmed 
                            ? "bg-green-50 dark:bg-green-900/20 text-success border border-green-100 dark:border-green-800/30" 
                            : "bg-background-secondary text-muted"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${req.recipientConfirmed ? "bg-success" : "bg-muted"}`}></span>
                          {req.recipientConfirmed ? "Confirmed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          req.status === 'Completed' ? 'badge-success' : 
                          req.status === 'Cancelled' ? 'bg-background-secondary text-muted' : 'badge-warning'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(req._id)}
                          className="p-2 text-red-500 hover:bg-danger/10 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </td>
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
