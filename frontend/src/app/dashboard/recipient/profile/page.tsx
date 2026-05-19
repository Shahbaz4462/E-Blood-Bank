"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function RecipientProfilePage() {
  const { user, updateUserContext, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
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
        city: user.city || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/recipient", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "My Requests", href: "/dashboard/recipient/requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> },
    { name: "Find Donors", href: "/dashboard/recipient/find-donors", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> },
    { name: "Profile", href: "/dashboard/recipient/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await api.put("/auth/profile", formData);
      updateUserContext(res.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
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
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Password change failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action is permanent.")) {
      try {
        await api.delete("/auth/account");
        logout();
      } catch (err: any) {
        alert(err.response?.data?.message || "Deletion failed");
      }
    }
  };

  return (
    <DashboardLayout title="My Profile" items={sidebarItems}>
      <div className="space-y-8">
        {message.text && (
          <div className={`p-4 rounded-xl text-sm text-center ${
            message.type === "error" ? "alert-error" : "alert-success"
          }`}>
            {message.text}
          </div>
        )}

        <div className="dashboard-card">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl font-bold text-primary border-4 border-primary/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
                <p className="text-muted capitalize">{user?.role} • {user?.bloodGroup} Blood Group</p>
              </div>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  disabled={!isEditing}
                  className="input-field disabled:opacity-70"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Email (Locked)</label>
                <input 
                  disabled
                  className="input-field opacity-50"
                  value={user?.email}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Blood Group (Locked)</label>
                <input 
                  disabled
                  className="input-field opacity-50"
                  value={user?.bloodGroup}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Contact Details</h3>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Phone Number</label>
                <input 
                  disabled={!isEditing}
                  className="input-field disabled:opacity-70"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">City</label>
                <input 
                  disabled={!isEditing}
                  className="input-field disabled:opacity-70"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Address</label>
                <input 
                  disabled={!isEditing}
                  className="input-field disabled:opacity-70"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>

            {isEditing && (
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-xl text-sm font-medium bg-background-secondary hover:bg-card-hover  transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:opacity-90 transition-colors"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    className="input-field pr-12"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                  />
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
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">New Password</label>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Confirm New Password</label>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-danger mb-6">Danger Zone</h3>
            <p className="text-sm text-muted mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button 
              onClick={handleDeleteAccount}
              className="btn-danger-ghost-filled"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
