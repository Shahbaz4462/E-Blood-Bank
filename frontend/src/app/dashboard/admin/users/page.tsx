"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/admin", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "User Management", href: "/dashboard/admin/users", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: "Blood Requests", href: "/dashboard/admin/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="m17 5-5-3-5 3"></path><path d="m17 19-5 3-5-3"></path><circle cx="12" cy="12" r="3"></circle></svg> },
    { name: "Profile", href: "/dashboard/admin/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users${roleFilter ? `?role=${roleFilter}` : ""}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you absoluteley sure? This will permanently delete this user and all their records.")) {
      setIsDeleting(id);
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter((u: any) => u._id !== id));
      } catch (err) {
        alert("Deletion failed");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser._id}`, editingUser);
      if (editingUser.newPassword) {
        await api.put(`/admin/users/${editingUser._id}/reset-password`, { newPassword: editingUser.newPassword });
      }
      setUsers(users.map((u: any) => u._id === editingUser._id ? editingUser : u));
      setEditingUser(null);
      alert("User updated successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <DashboardLayout title="User Management" items={sidebarItems}>
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold">Platform Users</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-bold text-muted uppercase tracking-wider whitespace-nowrap">Filter By Role:</label>
            <select 
              className="input-field py-2 text-sm min-w-[160px]"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="donor">Donors Only</option>
              <option value="recipient">Recipients Only</option>
              <option value="organization">Organizations Only</option>
            </select>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary text-muted font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Name & Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Blood Group</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-20 text-center text-muted-foreground">Loading platform users...</td></tr>
                ) : (
                  users.map((u: any) => (
                    <tr key={u._id} className="hover:bg-card-hover transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{u.name}</div>
                        <div className="text-xs text-muted">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'organization' ? 'badge-warning' : u.role === 'donor' ? 'badge-success' : 'badge-info'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">{u.bloodGroup || "N/A"}</td>
                      <td className="px-6 py-4 text-muted">{u.city}</td>
                      <td className="px-6 py-4">
                        <span className={`w-2 h-2 rounded-full inline-block mr-2 ${u.isVerified ? 'bg-success' : 'bg-border'}`}></span>
                        {u.isVerified ? 'Verified' : 'Pending'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingUser(u)}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button 
                            disabled={isDeleting === u._id}
                            onClick={() => handleDelete(u._id)}
                            className="p-2 hover:bg-danger/10 text-danger rounded-lg transition-colors disabled:opacity-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="bg-card w-full max-w-2xl p-8 rounded-[var(--radius-card)] shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Edit Profile: {editingUser.name}</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Full Name</label>
                <input 
                  className="input-field"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Email Address</label>
                <input 
                  className="input-field"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Phone</label>
                <input 
                  className="input-field"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Blood Group</label>
                <select 
                  className="input-field"
                  value={editingUser.bloodGroup}
                  onChange={(e) => setEditingUser({...editingUser, bloodGroup: e.target.value})}
                >
                  <option value="">None</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Address</label>
                <textarea 
                  className="input-field min-h-[80px]"
                  value={editingUser.address}
                  onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="verified"
                  checked={editingUser.isVerified}
                  onChange={(e) => setEditingUser({...editingUser, isVerified: e.target.checked})}
                />
                <label htmlFor="verified" className="text-sm font-medium">Verify User Account</label>
              </div>
              <div className="col-span-2 pt-4 border-t border-border">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">New Password (leave blank to keep current)</label>
                <input 
                  type="password"
                  className="input-field mt-1"
                  value={editingUser.newPassword || ""}
                  onChange={(e) => setEditingUser({...editingUser, newPassword: e.target.value})}
                  placeholder="Enter new password"
                />
                <p className="text-xs text-muted mt-1">Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character.</p>
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 rounded-xl bg-background-secondary hover:bg-card-hover transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition-colors font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
