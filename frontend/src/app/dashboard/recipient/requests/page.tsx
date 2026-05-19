"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function RecipientRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: user?.bloodGroup || "A+",
    units: 1,
    urgency: "Normal",
    location: user?.address || "",
    phone: user?.phone || "",
    message: "",
  });

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/recipient", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "My Requests", href: "/dashboard/recipient/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> },
    { name: "Find Donors", href: "/dashboard/recipient/find-donors", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> },
    { name: "Profile", href: "/dashboard/recipient/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const fetchMyRequests = async () => {
    try {
      const res = await api.get("/blood-requests/my");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/blood-requests", formData);
      fetchMyRequests();
      setIsPosting(false);
      setFormData({ ...formData, message: "", units: 1 });
      alert("Blood request posted successfully! It is now visible to all Donors, Organizations, and Admins.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post request");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this request?")) {
      try {
        await api.put(`/blood-requests/${id}/status`, { status: "Cancelled" });
        fetchMyRequests();
      } catch (err) {
        alert("Failed to cancel request");
      }
    }
  };

  return (
    <DashboardLayout title="My Blood Requests" items={sidebarItems}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Request History</h2>
            <p className="text-sm text-muted">Manage your active and past blood requests</p>
          </div>
          <button 
            onClick={() => setIsPosting(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            + Post New Request
          </button>
        </div>

        <div className="bg-card rounded-[var(--radius-card)] shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Blood Group</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Urgency</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Units</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted">
                      You haven't posted any requests yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((req: any) => (
                    <tr key={req._id} className="hover:bg-card-hover transition-colors">
                      <td className="px-6 py-4">
                        <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          req.urgency === 'Emergency' ? 'badge-warning' : 
                          req.urgency === 'Urgent' ? 'badge-warning' : 'badge-info'
                        }`}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{req.units} Units</td>
                      <td className="px-6 py-4">
                        <span className={`badge-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'Pending' && (
                          <button 
                            onClick={() => handleCancel(req._id)}
                            className="text-xs font-bold text-red-500 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                        {req.status !== 'Pending' && req.status !== 'Completed' && req.status !== 'Cancelled' && req.acceptedBy && (
                          <div className="text-left space-y-2 inline-block">
                            <div className="text-xs text-muted">
                              <strong>{req.acceptedByRole === 'organization' ? 'Org' : 'Donor'}:</strong> {req.acceptedBy.name}<br/>
                              📞 {req.acceptedBy.phone}<br/>
                              ✉️ {req.acceptedBy.email}
                            </div>
                            {!req.recipientConfirmed ? (
                              <button 
                                onClick={async () => {
                                  try {
                                    await api.put(`/blood-requests/${req._id}/status`, { status: "Blood Taken" });
                                    alert("You have marked blood as received. The donation is completed once the donor also confirms giving it!");
                                    fetchMyRequests();
                                  } catch (err) {
                                    alert("Failed to confirm blood received");
                                  }
                                }}
                                className="w-full bg-success text-white px-3 py-1.5 rounded-xl text-[10px] font-bold hover:opacity-90 transition-all"
                              >
                                Confirm Blood Received
                              </button>
                            ) : (
                              <div className="text-center text-[10px] font-bold text-success bg-green-50 dark:bg-green-900/20 py-1.5 px-3 rounded-xl border border-green-100 dark:border-green-800/30">
                                Waiting for Donor...
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Units Needed</label>
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
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Hospital / Location</label>
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
                    placeholder="Briefly explain the reason for the request..."
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
      </div>
    </DashboardLayout>
  );
}
