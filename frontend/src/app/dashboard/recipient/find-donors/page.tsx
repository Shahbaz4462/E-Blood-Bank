"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

function FindDonorsForm() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [searchGroup, setSearchGroup] = useState(searchParams.get("bloodGroup") || user?.bloodGroup || "A+");
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestData, setRequestData] = useState({
    message: "",
    emergencyType: "Normal",
  });

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/recipient", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "My Requests", href: "/dashboard/recipient/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> },
    { name: "Find Donors", href: "/dashboard/recipient/find-donors", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> },
    { name: "Profile", href: "/dashboard/recipient/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/auth/donors?bloodGroup=${encodeURIComponent(searchGroup)}`);
      setDonors(res.data);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      alert("Failed to search donors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("bloodGroup")) {
      handleSearch();
    }
  }, [searchParams]);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/blood-requests", {
        bloodGroup: selectedDonor.bloodGroup,
        units: 1,
        urgency: requestData.emergencyType,
        location: user?.address || "Hospital",
        phone: user?.phone || "03058804309",
        message: `Direct request to donor ${selectedDonor.name}. ${requestData.message}`
      });
      alert(`Request sent successfully to ${selectedDonor.name}! They will be notified.`);
      setIsRequesting(false);
      setSelectedDonor(null);
      setRequestData({ message: "", emergencyType: "Normal" });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Find Donors" items={sidebarItems}>
      <div className="space-y-8">
        <div className="dashboard-card">
          <h2 className="text-xl font-bold text-foreground mb-6">Search for Blood Donors</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              className="flex-grow px-4 py-3 bg-background-secondary rounded-xl border-none text-sm"
              value={searchGroup}
              onChange={(e) => setSearchGroup(e.target.value)}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g} Blood Group</option>)}
            </select>
            <button 
              onClick={handleSearch}
              className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-colors"
            >
              Search Donors
            </button>
          </div>
        </div>

        {hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {donors.map((donor) => (
              <div key={donor._id} className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center font-bold text-2xl text-primary mb-4 relative">
                  {donor.bloodGroup}
                  {donor.bloodGroup === user?.bloodGroup && (
                    <span className="absolute -top-1 -right-4 px-1.5 py-0.5 bg-success text-white text-[8px] font-bold uppercase rounded shadow-sm">Recommended</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{donor.name}</h3>
                <p className="text-xs text-muted mb-4">{donor.city || donor.address || "Available"}</p>
                <button 
                  onClick={() => {
                    setSelectedDonor(donor);
                    setIsRequesting(true);
                  }}
                  className="w-full btn-primary text-white py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
                >
                  Send Request
                </button>
              </div>
            ))}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-20 bg-background-secondary rounded-[var(--radius-card)] border-2 border-dashed border-border">
            <p className="text-muted-foreground">Select a blood group and click search to find donors near you.</p>
          </div>
        )}
      </div>

      {isRequesting && (
        <div className="modal-overlay">
          <div className="bg-card w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Request Blood from {selectedDonor.name}</h2>
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Urgency Level</label>
                <select 
                  className="w-full mt-1 px-4 py-3 bg-background-secondary rounded-xl border-none"
                  value={requestData.emergencyType}
                  onChange={(e) => setRequestData({...requestData, emergencyType: e.target.value})}
                >
                  <option>Normal</option>
                  <option>Emergency</option>
                  <option>Critical</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Message</label>
                <textarea 
                  required
                  className="w-full mt-1 px-4 py-3 bg-background-secondary rounded-xl border-none min-h-[100px] text-sm"
                  placeholder="Explain the urgency..."
                  value={requestData.message}
                  onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setIsRequesting(false)}
                  className="py-3 rounded-xl text-sm font-medium bg-background-secondary hover:bg-card-hover transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="py-3 rounded-xl text-sm font-medium bg-primary text-white hover:opacity-90 transition-colors"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function FindDonorsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-muted">Loading donor search...</div>}>
      <FindDonorsForm />
    </Suspense>
  );
}
