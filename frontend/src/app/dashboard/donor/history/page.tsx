"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function DonorHistoryPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const sidebarItems = [
    { 
      name: "Overview", 
      href: "/dashboard/donor", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    },
    { 
      name: "Donations", 
      href: "/dashboard/donor/history", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
    },
    { 
      name: "Blood Requests", 
      href: "/dashboard/donor/requests", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
    },
    { 
      name: "Profile", 
      href: "/dashboard/donor/profile", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    },
  ];

  const fetchHistory = async () => {
    try {
      const res = await api.get("/blood-requests/my");
      // Filter only completed donations
      const completed = res.data.filter((d: any) => d.status === "Completed");
      setDonations(completed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownloadReport = () => {
    setHasDownloaded(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <DashboardLayout title="Donation History" items={sidebarItems}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          aside, nav, header, button, .no-print, [role="navigation"] {
            display: none !important;
          }
          main, .print-container {
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-header {
            display: block !important;
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .print-header h1 {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
            color: #000 !important;
          }
          .print-header p {
            margin: 5px 0 0 0;
            font-size: 12px;
            color: #444 !important;
          }
          .print-meta {
            display: flex !important;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 14px;
            color: #000 !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin-top: 15px;
          }
          th, td {
            border: 1px solid #ccc !important;
            padding: 10px !important;
            text-align: left !important;
            color: #000 !important;
          }
          th {
            background-color: #f5f5f5 !important;
            font-weight: bold !important;
          }
        }
      `}} />

      <div className="print-container">
        {/* Print Only Header */}
        <div className="hidden print-header">
          <h1>E-Blood Bank Portal</h1>
          <p>Official Certified Blood Donation Record Report</p>
        </div>
        <div className="hidden justify-between mb-6 border-b pb-4 print-meta border-gray-200">
          <div>
            <strong>Donor Name:</strong> {user?.name}<br />
            <strong>Blood Group:</strong> {user?.bloodGroup}<br />
            <strong>Contact:</strong> {user?.phone || "03058804309"}
          </div>
          <div className="text-right">
            <strong>Report Date:</strong> {new Date().toLocaleDateString()}<br />
            <strong>Total Verified Donations:</strong> {donations.length}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden print:border-none print:shadow-none">
          <div className="p-6 border-b border-border flex justify-between items-center print:hidden">
            <h2 className="text-lg font-semibold text-foreground">Your Donations</h2>
            {!hasDownloaded && (
              <button 
                onClick={handleDownloadReport}
                className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                Download Report
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm print:text-base">
              <thead>
                <tr className="bg-background-secondary text-muted font-medium print:bg-gray-100 print:text-black">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Recipient Name</th>
                  <th className="px-6 py-4">Blood Group</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border print:divide-gray-300">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-muted">Loading your history...</td></tr>
                ) : donations.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-muted">No completed donations recorded yet.</td></tr>
                ) : (
                  donations.map((item, idx) => (
                    <tr key={item._id || idx} className="hover:bg-card-hover transition-colors print:hover:bg-transparent">
                      <td className="px-6 py-4 text-foreground font-medium print:text-black">{new Date(item.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-muted print:text-black">{item.requesterName || "Direct Recipient"}</td>
                      <td className="px-6 py-4 text-muted print:text-black font-bold">{item.bloodGroup}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 badge-success text-[10px] font-bold rounded uppercase print:border print:border-green-600 print:text-green-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
