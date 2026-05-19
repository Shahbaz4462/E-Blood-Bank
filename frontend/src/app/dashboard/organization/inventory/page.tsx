"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function OrganizationInventoryPage() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: "A+",
    quantity: 1,
    type: "inventory_add",
    personName: "System Update",
    location: "Main Branch",
    note: ""
  });

  const sidebarItems = [
    { name: "Overview", href: "/dashboard/organization", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: "Inventory", href: "/dashboard/organization/inventory", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
    { name: "Donations", href: "/dashboard/organization/donations", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> },
    { name: "Profile", href: "/dashboard/organization/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const fetchInventory = async () => {
    try {
      const res = await api.get("/organization/inventory");
      setInventory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/organization/inventory", formData);
      setInventory(res.data.inventory);
      alert(`Successfully ${formData.type === 'inventory_add' ? 'added' : 'removed'} ${formData.quantity} units of ${formData.bloodGroup}`);
      setIsUpdating(false);
      setFormData({...formData, quantity: 1, note: ""});
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Blood Inventory" items={sidebarItems}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Live Stock Status</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => { setIsUpdating(true); setFormData({...formData, type: "inventory_add"}); }}
              className="btn-success btn-sm"
            >
              + Add Stock
            </button>
            <button 
              onClick={() => { setIsUpdating(true); setFormData({...formData, type: "inventory_remove"}); }}
              className="btn-danger btn-sm"
            >
              - Remove Stock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {Object.entries(inventory).map(([group, quantity]: [string, any]) => (
            <div key={group} className="bg-card p-8 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center group hover:border-primary transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-2xl font-bold text-primary mb-4 group-hover:scale-110 transition-transform">
                {group}
              </div>
              <p className="text-3xl font-bold text-foreground">{quantity}</p>
              <p className="text-xs text-muted uppercase tracking-widest mt-1">Units Available</p>
            </div>
          ))}
        </div>

        {isUpdating && (
          <div className="modal-overlay">
            <div className="bg-card w-full max-w-lg p-8 rounded-2xl shadow-2xl animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">{formData.type === 'inventory_add' ? 'Add to' : 'Remove from'} Inventory</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
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
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Quantity (Units)</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      className="input-field"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Source/Recipient Name</label>
                    <input 
                      required
                      className="input-field"
                      value={formData.personName}
                      onChange={(e) => setFormData({...formData, personName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Location</label>
                    <input 
                      required
                      className="input-field"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Note</label>
                  <textarea 
                    className="input-field min-h-[80px]"
                    placeholder="Optional details..."
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsUpdating(false)} className="flex-1 py-3 rounded-xl bg-background-secondary hover:bg-card-hover transition-colors">Cancel</button>
                  <button type="submit" disabled={loading} className={`flex-1 py-3 rounded-xl font-medium transition-colors ${formData.type === 'inventory_add' ? 'btn-success' : 'btn-danger'}`}>
                    {loading ? "Processing..." : "Confirm Action"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
