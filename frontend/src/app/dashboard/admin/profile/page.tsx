"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function AdminProfilePage() {
  const { user, updateUserContext } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/admin", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "User Management", href: "/dashboard/admin/users", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { name: "Blood Requests", href: "/dashboard/admin/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="m17 5-5-3-5 3"></path><path d="m17 19-5 3-5-3"></path><circle cx="12" cy="12" r="3"></circle></svg> },
    { name: "Profile", href: "/dashboard/admin/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/profile", formData);
      updateUserContext(res.data);
      setMessage({ type: "success", text: "Admin profile updated!" });
    } catch (err: any) {
      setMessage({ type: "error", text: "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match" });
    }
    setLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Password change failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Admin Profile" items={sidebarItems}>
      <div className="max-w-4xl space-y-8">
        {message.text && (
          <div className={`p-4 rounded-xl text-sm text-center ${
            message.type === "error" ? "alert-error" : "alert-success"
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-card p-8 rounded-[var(--radius-card)] shadow-sm border border-border">
          <h3 className="text-xl font-bold mb-6">Personal Details</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Admin Name</label>
                <input className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Email (Locked)</label>
                <input disabled className="input-field opacity-50" value={user?.email} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-colors">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="bg-card p-8 rounded-[var(--radius-card)] shadow-sm border border-border">
          <h3 className="text-xl font-bold mb-6">Change Administrative Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required className="input-field pr-12" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88 3 3"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line><path d="M10.47 10.47a3.38 3.38 0 0 0 4.06 4.06"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider">New Password</label>
              <input type={showPassword ? "text" : "password"} required className="input-field" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Confirm New Password</label>
              <input type={showPassword ? "text" : "password"} required className="input-field" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-colors">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
