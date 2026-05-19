"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function DonorRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponding, setIsResponding] = useState(false);

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/donor", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "Donations", href: "/dashboard/donor/history", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> },
    { name: "Blood Requests", href: "/dashboard/donor/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> },
    { name: "Profile", href: "/dashboard/donor/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const fetchRequests = async () => {
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
    fetchRequests();
  }, []);

  const handleRespond = async (type: 'accept' | 'decline') => {
    if (!selectedRequest) return;
    try {
      if (type === 'accept') {
        await api.put(`/blood-requests/${selectedRequest._id}/status`, { status: "Approved" });
        alert(`You have accepted the request from ${selectedRequest.requesterName}. Their contact info is now visible.`);
      } else {
        await api.put(`/blood-requests/${selectedRequest._id}/status`, { status: "Declined" });
      }
      fetchRequests();
    } catch (err) {
      alert("Failed to respond to request");
    } finally {
      setIsResponding(false);
      setSelectedRequest(null);
      setResponseMessage("");
    }
  };

  return (
    <DashboardLayout title="Available Blood Requests" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Live Requests</h2>
            <p className="text-sm text-muted">Respond to people and organizations in need of blood</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl text-primary font-bold text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {requests.length} Active Requests
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Searching for live requests...</div>
        ) : requests.length === 0 ? (
          <div className="bg-card p-12 rounded-[var(--radius-card)] border border-dashed border-border text-center">
            <div className="text-4xl mb-4">🙌</div>
            <h3 className="text-lg font-bold">No Urgent Requests</h3>
            <p className="text-muted max-w-xs mx-auto">There are no active blood requests in your area at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req: any) => (
              <div key={req._id} className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col group hover:border-primary transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      req.urgency === 'Emergency' ? 'badge-warning' : 
                      req.urgency === 'Urgent' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {req.urgency}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-2">{req.requesterName}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{req.requesterRole}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl group-hover:scale-110 transition-transform">
                    {req.bloodGroup}
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {req.location}, {req.city}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    {req.units} Units Required
                  </div>
                  {req.message && (
                    <p className="text-xs text-muted bg-background-secondary p-3 rounded-lg italic">
                      "{req.message}"
                    </p>
                  )}
                  
                  {req.status === 'Approved' && req.acceptedBy?._id === user?._id && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                      <p className="text-xs font-bold text-success dark:text-green-400 mb-1">Contact Details</p>
                      <p className="text-xs text-foreground">📞 {req.requester?.phone || req.phone}</p>
                      <p className="text-xs text-foreground">✉️ {req.requester?.email}</p>
                    </div>
                  )}
                </div>

                {req.status === 'Pending' ? (
                  <button 
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsResponding(true);
                    }}
                    className="w-full btn-primary text-white py-3 rounded-xl text-sm font-medium hover:bg-primary transition-colors"
                  >
                    Help this {req.requesterRole}
                  </button>
                ) : req.acceptedBy?._id === user?._id && req.status !== 'Completed' && req.status !== 'Cancelled' ? (
                  <div className="w-full space-y-2">
                    <div className="text-center text-xs font-bold text-muted bg-background-secondary py-1.5 rounded-lg">
                      Status: {req.status}
                    </div>
                    {!req.donorConfirmed ? (
                      <button 
                        onClick={async () => {
                          try {
                            await api.put(`/blood-requests/${req._id}/status`, { status: "Blood Given" });
                            alert("You have marked blood as given. The donation is completed once the recipient also confirms receiving it!");
                            fetchRequests();
                          } catch (err) {
                            alert("Failed to confirm blood given");
                          }
                        }}
                        className="w-full bg-success text-white py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                      >
                        Confirm Blood Given
                      </button>
                    ) : (
                      <div className="text-center text-xs font-bold text-success bg-green-50 dark:bg-green-900/20 py-2 rounded-xl border border-green-100 dark:border-green-800/30">
                        Waiting for Recipient...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`w-full py-3 rounded-xl text-center text-sm font-bold ${
                    req.status === 'Completed' ? 'badge-success' : 'bg-background-secondary text-muted'
                  }`}>
                    {req.status}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isResponding && (
        <div className="modal-overlay">
          <div className="bg-card w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold mb-2">Help {selectedRequest.requesterName}</h2>
            <p className="text-sm text-muted mb-6">By clicking accept, your contact details will be shared with the requester.</p>
            
            <div className="bg-background-secondary p-4 rounded-xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-muted-foreground">REQUIRED BLOOD</span>
                <span className="text-lg font-bold text-primary">{selectedRequest.bloodGroup}</span>
              </div>
              <p className="text-xs text-muted">{selectedRequest.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsResponding(false)}
                className="py-3 rounded-xl text-sm font-medium border border-border text-muted hover:bg-card-hover transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={() => handleRespond('accept')}
                className="py-3 rounded-xl text-sm font-medium bg-primary text-white hover:opacity-90 transition-colors"
              >
                Accept Request
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
