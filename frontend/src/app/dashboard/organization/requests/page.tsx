"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function OrganizationRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bloodGroup: "A+",
    units: 1,
    urgency: "Normal",
    location: user?.address || "",
    phone: user?.phone || "",
    message: "",
  });

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/organization", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "Inventory", href: "/dashboard/organization/inventory", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
    { name: "Donations", href: "/dashboard/organization/donations", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> },
    { name: "Community Requests", href: "/dashboard/organization/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: "Profile", href: "/dashboard/organization/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
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

  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/blood-requests", formData);
      fetchRequests();
      setIsPosting(false);
      setFormData({ ...formData, message: "", units: 1 });
      alert("Blood request posted successfully! It is now visible to all Donors and Admins.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post request");
    } finally {
      setLoading(false);
    }
  };



  return (
    <DashboardLayout title="Community Blood Requests" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Global Needs</h2>
            <p className="text-sm text-muted">Monitor and fulfill blood requests or post your own organizational needs</p>
          </div>
          <button 
            onClick={() => setIsPosting(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            + Post Blood Request
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="bg-card p-12 rounded-[var(--radius-card)] border border-dashed border-border text-center">
            <h3 className="text-lg font-bold">No Pending Requests</h3>
            <p className="text-muted">The community is currently well-supplied!</p>
          </div>
        ) : (
          <div className="bg-card rounded-[var(--radius-card)] shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background-secondary border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Requester</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Group</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Units</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Urgency</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {requests.map((req: any) => (
                    <tr key={req._id} className="hover:bg-card-hover transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold">{req.requesterName}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{req.requesterRole}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary">{req.bloodGroup}</span>
                      </td>
                      <td className="px-6 py-4">{req.units} Units ({req.units * 500}ml)</td>
                      <td className="px-6 py-4 text-sm text-muted">{req.location}</td>
                      <td className="px-6 py-4">
                        <span className={`badge-${req.status?.toLowerCase() || 'pending'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'Pending' ? (
                          req.requester?._id?.toString() === user?._id?.toString() ? (
                            <span className="text-xs text-muted-foreground italic">Your Pending Request</span>
                          ) : (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={async () => {
                                  try {
                                    await api.put(`/blood-requests/${req._id}/status`, { status: "Approved" });
                                    fetchRequests();
                                    alert("You have accepted this blood request! Please coordinate and confirm donation.");
                                  } catch (e) { alert("Failed to approve"); }
                                }}
                                className="bg-success text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                              >
                                Approve / Accept
                              </button>
                              <button 
                                onClick={async () => {
                                  try {
                                    await api.put(`/blood-requests/${req._id}/status`, { status: "Declined" });
                                    fetchRequests();
                                  } catch (e) { alert("Failed to decline"); }
                                }}
                                className="text-xs font-bold text-red-500 hover:underline"
                              >
                                Decline
                              </button>
                            </div>
                          )
                        ) : req.status !== 'Completed' && req.status !== 'Cancelled' ? (
                          req.acceptedBy?._id === user?._id ? (
                            // Organization is the accepter (supplier)
                            <div className="text-left space-y-2 inline-block">
                              <div className="text-xs text-muted">
                                <strong>Recipient:</strong> {req.requesterName}<br/>
                                📞 {req.requester?.phone || req.phone}<br/>
                                ✉️ {req.requester?.email}
                              </div>
                              {!req.donorConfirmed ? (
                                <button 
                                  onClick={async () => {
                                    try {
                                      await api.put(`/blood-requests/${req._id}/status`, { status: "Blood Given" });
                                      alert("Marked blood as given. Awaiting recipient confirmation!");
                                      fetchRequests();
                                    } catch (err) {
                                      alert("Failed to confirm blood given");
                                    }
                                  }}
                                  className="w-full bg-success text-white px-3 py-1.5 rounded-xl text-[10px] font-bold hover:opacity-90 transition-all"
                                >
                                  Mark Blood Given
                                </button>
                              ) : (
                                <div className="text-center text-[10px] font-bold text-success bg-green-50 dark:bg-green-900/20 py-1.5 px-3 rounded-xl border border-green-100 dark:border-green-800/30">
                                  Waiting for Recipient...
                                </div>
                              )}
                            </div>
                          ) : req.requester?._id === user?._id ? (
                            // Organization is the poster (recipient)
                            <div className="text-left space-y-2 inline-block">
                              <div className="text-xs text-muted">
                                <strong>Accepter:</strong> {req.acceptedBy?.name || "Life Saver"}<br/>
                                📞 {req.acceptedBy?.phone}<br/>
                                ✉️ {req.acceptedBy?.email}
                              </div>
                              {!req.recipientConfirmed ? (
                                <button 
                                  onClick={async () => {
                                    try {
                                      await api.put(`/blood-requests/${req._id}/status`, { status: "Blood Taken" });
                                      alert("Marked blood as received. Awaiting donor/org confirmation!");
                                      fetchRequests();
                                    } catch (err) {
                                      alert("Failed to confirm blood received");
                                    }
                                  }}
                                  className="w-full bg-success text-white px-3 py-1.5 rounded-xl text-[10px] font-bold hover:opacity-90 transition-all"
                                >
                                  Mark Blood Received
                                </button>
                              ) : (
                                <div className="text-center text-[10px] font-bold text-success bg-green-50 dark:bg-green-900/20 py-1.5 px-3 rounded-xl border border-green-100 dark:border-green-800/30">
                                  Waiting for Donor/Org...
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Accepted by {req.acceptedBy?.name || "Others"}</span>
                          )
                        ) : (
                          <span className="text-xs font-bold text-success">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Post Modal */}
      {isPosting && (
        <div className="modal-overlay">
          <div className="bg-card w-full max-w-xl p-8 rounded-[var(--radius-card)] shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Post Blood Request</h2>
              <button onClick={() => setIsPosting(false)} className="text-muted-foreground hover:text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <form onSubmit={handlePostRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Blood Group</label>
                  <select 
                    className="input-field"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Urgency</label>
                  <select 
                    className="input-field"
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Units Needed ({formData.units ? formData.units * 500 : 500}ml)</label>
                  <input 
                    type="number" min="1"
                    className="input-field"
                    value={formData.units}
                    onChange={(e) => setFormData({...formData, units: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Contact Phone</label>
                  <input 
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Location / Department</label>
                <input 
                  className="input-field"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Extra Message</label>
                <textarea 
                  className="input-field min-h-[100px]"
                  placeholder="Details about the requirement..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all mt-4"
              >
                {loading ? "Posting..." : "Post Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Removing fulfill modal in favor of simple Accept/Decline for now */}
    </DashboardLayout>
  );
}
