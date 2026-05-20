"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function DonorDashboard() {
  const { user, updateUserContext } = useAuth();
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [globalRequests, setGlobalRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [donationsRes, requestsRes] = await Promise.all([
          api.get("/blood-requests/my"),
          api.get("/blood-requests")
        ]);
        setMyDonations(donationsRes.data);
        setGlobalRequests(requestsRes.data);
      } catch (err) {
        console.error("Error loading donor stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalDonations = myDonations.filter(d => d.status === "Completed").length;
  const livesSaved = totalDonations * 3;
  const matchingRequestsCount = globalRequests.filter(
    r => r.status === "Pending" && r.bloodGroup === user?.bloodGroup
  ).length;

  const handleToggleAvailability = async () => {
    setIsToggling(true);
    try {
      const res = await api.put("/auth/profile", { isAvailable: !user?.isAvailable });
      // Update our local user state in context reactively without reload
      updateUserContext(res.data);
    } catch (err) {
      alert("Failed to toggle availability status");
    } finally {
      setIsToggling(false);
    }
  };

  const formattedLastDonation = user?.lastDonationDate
    ? new Date(user.lastDonationDate).toLocaleDateString()
    : "Never";

  return (
    <DashboardLayout title="Donor Dashboard" items={sidebarItems}>
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card">
            <div className="icon-box icon-box-primary mb-4 w-12 h-12">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            </div>
            <h3 className="text-muted text-sm font-semibold mb-1">Total Donations</h3>
            <p className="text-3xl font-extrabold text-foreground">{loading ? "..." : `${totalDonations} Times`}</p>
            <span className="text-xs text-success font-bold mt-2 inline-block">Verified Contributor</span>
          </div>
          <div className="stat-card">
            <div className="icon-box icon-box-info mb-4 w-12 h-12">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h3 className="text-muted text-sm font-semibold mb-1">Lives Saved</h3>
            <p className="text-3xl font-extrabold text-foreground">{loading ? "..." : `${livesSaved} People`}</p>
            <span className="text-xs text-primary font-bold mt-2 inline-block">Silver Hero Status</span>
          </div>
          <div className="stat-card">
            <div className="icon-box icon-box-warning mb-4 w-12 h-12">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            </div>
            <h3 className="text-muted text-sm font-semibold mb-1">Nearby Requests</h3>
            <p className="text-3xl font-extrabold text-foreground">{loading ? "..." : `${matchingRequestsCount} Requests`}</p>
            <span className="text-xs text-warning font-bold mt-2 inline-block">Matching Blood Group</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Donation Eligibility</h2>
              <p className="text-muted text-sm mt-1 font-medium">Your current health and availability status check.</p>
            </div>
            <span className={user?.isAvailable ? "badge-success" : "badge-danger"}>
              {user?.isAvailable ? "Status: Live / Available" : "Status: Offline"}
            </span>
          </div>
          <div className="space-y-6">
            <p className="text-muted max-w-2xl font-medium">
              You are currently {user?.isAvailable ? "listed as an active available donor" : "not listed for public requests"}. Your last registered completed donation was on <strong className="text-foreground">{formattedLastDonation}</strong>. Keep your status active to let recipients in need find you in emergencies!
            </p>
            <button 
              onClick={handleToggleAvailability}
              disabled={isToggling}
              className={`btn-primary font-bold ${user?.isAvailable ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
            >
              {isToggling ? "Updating..." : user?.isAvailable ? "Go Offline / Busy" : "Go Online / Available"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
