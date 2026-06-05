"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import MapSelection from "@/components/MapSelection";

export default function OrganizationProfilePage() {
  const { user, updateUserContext, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
    licenseNumber: user?.licenseNumber || "",
    website: user?.website || "",
    latitude: user?.latitude || null,
    longitude: user?.longitude || null,
    province: user?.province || "",
    country: user?.country || "",
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
        licenseNumber: user.licenseNumber || "",
        website: user.website || "",
        latitude: user.latitude || null,
        longitude: user.longitude || null,
        province: user.province || "",
        country: user.country || "",
      });
    }
  }, [user]);

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/organization", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "Inventory", href: "/dashboard/organization/inventory", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
    { name: "Donations", href: "/dashboard/organization/donations", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> },
    { name: "Profile", href: "/dashboard/organization/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await api.put("/auth/profile", formData);
      updateUserContext(res.data);
      setMessage({ type: "success", text: "Organization profile updated!" });
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
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Password change failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Organization Profile" items={sidebarItems}>
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
                🏢
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
                <p className="text-muted capitalize">{user?.role} • License: {user?.licenseNumber}</p>
              </div>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
              >
                Edit Details
              </button>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Business Info</h3>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Organization Name</label>
                <input 
                  disabled={!isEditing}
                  className="input-field disabled:opacity-70"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">License Number</label>
                <input 
                  disabled={!isEditing}
                  className="input-field disabled:opacity-70"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Email (Locked)</label>
                <input disabled className="input-field opacity-50" value={user?.email} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Contact & Web</h3>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Phone</label>
                <input 
                  disabled={!isEditing}
                  className="input-field disabled:opacity-70"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Website</label>
                <input 
                  disabled={!isEditing}
                  className="input-field disabled:opacity-70"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
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
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Full Address</label>
              <textarea 
                disabled={!isEditing}
                className="input-field disabled:opacity-70 min-h-[80px]"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              {isEditing && (
                <div className="pt-4">
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Update Map Location</label>
                  <MapSelection
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                    onLocationSelect={(loc) => {
                      setFormData((prev: any) => ({
                        ...prev,
                        address: loc.address,
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                        city: loc.city,
                        province: loc.province,
                        country: loc.country,
                      }));
                    }}
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="md:col-span-2 flex justify-end gap-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-xl bg-background-secondary hover:bg-card-hover transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition-colors">{loading ? "Saving..." : "Save Changes"}</button>
              </div>
            )}
          </form>
        </div>

        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
          <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Current Password</label>
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
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">New Password</label>
              <input type={showPassword ? "text" : "password"} required className="input-field" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Confirm New Password</label>
              <input type={showPassword ? "text" : "password"} required className="input-field" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary text-white py-3 rounded-xl hover:opacity-90 transition-colors">{loading ? "Updating..." : "Update Password"}</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
