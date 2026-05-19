"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RecipientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/recipient", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "My Requests", href: "/dashboard/recipient/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> },
    { name: "Find Donors", href: "/dashboard/recipient/find-donors", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> },
    { name: "Profile", href: "/dashboard/recipient/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [requestsRes, donorsRes] = await Promise.all([
          api.get("/blood-requests/my"),
          api.get("/auth/donors")
        ]);
        setRequests(requestsRes.data);
        setDonors(donorsRes.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const activeRequestsCount = requests.filter(
    (r) => ["Pending", "Accepted", "Blood Given", "Blood Taken"].includes(r.status)
  ).length;
  
  const donorRespondingCount = requests.filter(
    (r) => ["Accepted", "Blood Given", "Blood Taken"].includes(r.status)
  ).length;

  const bloodReceivedCount = requests
    .filter((r) => r.status === "Completed")
    .reduce((sum, r) => sum + r.units, 0);

  const lastReceivedRequest = requests
    .filter((r) => r.status === "Completed")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

  const lastReceivedText = lastReceivedRequest
    ? `Last: ${new Date(lastReceivedRequest.updatedAt).toLocaleDateString()}`
    : "No completed requests yet";

  return (
    <DashboardLayout title="Recipient Dashboard" items={sidebarItems}>
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="stat-card">
            <h3 className="text-muted text-sm font-semibold mb-1">Active Requests</h3>
            <p className="text-3xl font-extrabold text-foreground">{activeRequestsCount} Requests</p>
            <span className="text-xs text-warning font-bold mt-2 inline-block">
              {donorRespondingCount} Donor{donorRespondingCount !== 1 ? "s" : ""} Responding
            </span>
          </div>
          <div className="stat-card">
            <h3 className="text-muted text-sm font-semibold mb-1">Blood Received</h3>
            <p className="text-3xl font-extrabold text-foreground">{bloodReceivedCount} Units</p>
            <span className="text-xs text-success font-bold mt-2 inline-block">{lastReceivedText}</span>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Donors Nearby</h2>
              <p className="text-sm text-muted font-medium">Available lifesavers in your immediate area.</p>
            </div>
            <button className="text-sm font-bold text-primary hover:underline" onClick={() => router.push("/dashboard/recipient/find-donors")}>View All</button>
          </div>
          <div className="p-8">
            {loading ? (
              <div className="text-center py-8 text-muted font-medium italic">Loading available donors...</div>
            ) : donors.length === 0 ? (
              <div className="text-center py-8 text-muted font-medium italic">No available donors found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {donors.map((donor) => (
                  <div key={donor._id} className="list-item-card">
                    <div className="flex items-center gap-4">
                      <div className="blood-group-badge w-12 h-12 text-base">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">
                          {donor.name}
                        </h4>
                        <p className="text-xs text-muted font-medium">{donor.city || "Available"}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/dashboard/recipient/find-donors?bloodGroup=${encodeURIComponent(donor.bloodGroup)}`)}
                      className="btn-primary py-2 px-4 text-xs"
                    >
                      Request
                    </button>
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
