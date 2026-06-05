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
    bloodGroup: "",
    units: 1,
    hospitalName: "",
    urgency: "Normal",
    message: "",
  });

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/recipient", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "My Requests", href: "/dashboard/recipient/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> },
    { name: "Find Donors", href: "/dashboard/recipient/find-donors", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> },
    { name: "Profile", href: "/dashboard/recipient/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const handleSearch = async (groupToSearch?: string) => {
    const activeGroup = groupToSearch || searchGroup;
    setLoading(true);
    try {
      const res = await api.get(`/auth/donors?bloodGroup=${encodeURIComponent(activeGroup)}`);
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
    const urlBloodGroup = searchParams.get("bloodGroup");
    if (urlBloodGroup) {
      setSearchGroup(urlBloodGroup);
      handleSearch(urlBloodGroup);
    }
  }, [searchParams]);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/blood-requests", {
        bloodGroup: requestData.bloodGroup,
        units: requestData.units,
        urgency: requestData.urgency,
        location: requestData.hospitalName || "General Hospital",
        phone: user?.phone || "03058804309",
        message: requestData.message,
        acceptedBy: selectedDonor._id,
        acceptedByRole: "donor",
      });
      alert(`Request sent successfully to ${selectedDonor.name}! They will see it on their dashboard.`);
      setIsRequesting(false);
      setSelectedDonor(null);
      setRequestData({ bloodGroup: "", units: 1, hospitalName: "", urgency: "Normal", message: "" });
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
              onClick={() => handleSearch()}
              disabled={loading}
              className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                "Search Donors"
              )}
            </button>
          </div>
        </div>

        {hasSearched && (
          <>
            {donors.length > 0 ? (
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
                    <div className="space-y-1 text-xs text-muted mb-4">
                      <p className="font-medium text-foreground">{donor.city || "Available"}</p>
                      <p>{donor.distance !== null && donor.distance !== undefined ? `${donor.distance} km away` : "Distance unknown"}</p>
                      <p className="font-bold">Available Stock: 1 Unit (500ml)</p>
                      <p className="font-bold text-primary">Blood Group: {donor.bloodGroup}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${donor.isAvailable ? "bg-success/10 text-success border border-success/20" : "bg-muted/20 text-muted border border-muted/20"}`}>
                        {donor.isAvailable ? "Available" : "Busy"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDonor(donor);
                        setRequestData({
                          bloodGroup: donor.bloodGroup,
                          units: 1,
                          hospitalName: "",
                          urgency: "Normal",
                          message: "",
                        });
                        setIsRequesting(true);
                      }}
                      className="w-full btn-primary text-white py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
                    >
                      Send Request
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-background-secondary rounded-[var(--radius-card)] border-2 border-dashed border-border animate-fade-in">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-foreground mb-2">No Donors Found</h3>
                <p className="text-muted-foreground mb-4">No donors are currently available for this blood group.</p>
                <button
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        )}

        {!hasSearched && (
          <div className="text-center py-20 bg-background-secondary rounded-[var(--radius-card)] border-2 border-dashed border-border">
            <p className="text-muted-foreground">Select a blood group and click search to find donors near you.</p>
          </div>
        )}
      </div>

      {isRequesting && (
        <div className="modal-overlay">
          <div className="bg-card w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Request Blood from {selectedDonor.name}</h2>
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Required Blood Group</label>
                <select 
                  className="w-full mt-1 px-4 py-3 bg-background-secondary rounded-xl border-none"
                  value={requestData.bloodGroup}
                  onChange={(e) => setRequestData({...requestData, bloodGroup: e.target.value})}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider">Required Units ({requestData.units ? requestData.units * 500 : 500}ml)</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full mt-1 px-4 py-3 bg-background-secondary rounded-xl border-none"
                    value={requestData.units}
                    onChange={(e) => setRequestData({...requestData, units: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider">Urgency Level</label>
                  <select 
                    className="w-full mt-1 px-4 py-3 bg-background-secondary rounded-xl border-none"
                    value={requestData.urgency}
                    onChange={(e) => setRequestData({...requestData, urgency: e.target.value})}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Hospital Name</label>
                <input 
                  type="text"
                  required
                  placeholder="E.g. Shifa Hospital, Islamabad"
                  className="w-full mt-1 px-4 py-3 bg-background-secondary rounded-xl border-none"
                  value={requestData.hospitalName}
                  onChange={(e) => setRequestData({...requestData, hospitalName: e.target.value})}
                />
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
