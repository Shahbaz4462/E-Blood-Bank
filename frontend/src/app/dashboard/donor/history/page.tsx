"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

export default function DonorHistoryPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
      const res = await api.get("/donations");
      setDonations(res.data);
      setFilteredDonations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = donations;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.recipientName?.toLowerCase().includes(term) ||
          d.location?.toLowerCase().includes(term) ||
          d.city?.toLowerCase().includes(term)
      );
    }

    if (filterBloodGroup) {
      filtered = filtered.filter((d) => d.bloodGroup === filterBloodGroup);
    }

    if (filterStatus) {
      filtered = filtered.filter((d) => d.status === filterStatus);
    }

    setFilteredDonations(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterBloodGroup, filterStatus, donations]);

  // Pagination
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownloadPDF = () => {
    setHasDownloaded(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadExcel = () => {
    // Create CSV content
    const headers = ["Donation ID", "Date", "Blood Group", "Units", "Volume (ml)", "Recipient/Organization", "Location", "City", "Status"];
    const rows = filteredDonations.map(d => [
      `#${d._id?.slice(-8) || "N/A"}`,
      new Date(d.donationDate || d.createdAt).toLocaleDateString(),
      d.bloodGroup,
      d.units,
      d.units * 500,
      d.recipientName || "N/A",
      d.location,
      d.city,
      d.status
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `donation_history_${user?.name}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
            <h2 className="text-lg font-semibold text-foreground">Your Donations</h2>
            <div className="flex gap-2">
              <button 
                onClick={handleDownloadPDF}
                className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                Download PDF
              </button>
              <button 
                onClick={handleDownloadExcel}
                className="bg-success/10 text-success px-4 py-2 rounded-lg text-sm font-medium hover:bg-success/20 transition-colors"
              >
                Download Excel
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="p-4 border-b border-border bg-background-secondary print:hidden">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by recipient, location, city..."
                className="flex-grow px-4 py-2 bg-background rounded-lg border border-border text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 bg-background rounded-lg border border-border text-sm"
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
              >
                <option value="">All Blood Groups</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <select
                className="px-4 py-2 bg-background rounded-lg border border-border text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm print:text-base">
              <thead>
                <tr className="bg-background-secondary text-muted font-medium print:bg-gray-100 print:text-black">
                  <th className="px-6 py-4">Donation ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Blood Group</th>
                  <th className="px-6 py-4">Units</th>
                  <th className="px-6 py-4">Recipient/Org</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border print:divide-gray-300">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-10 text-center text-muted">Loading your history...</td></tr>
                ) : paginatedDonations.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-10 text-center text-muted">No donations recorded yet.</td></tr>
                ) : (
                  paginatedDonations.map((item, idx) => (
                    <tr key={item._id || idx} className="hover:bg-card-hover transition-colors print:hover:bg-transparent">
                      <td className="px-6 py-4 text-foreground font-medium print:text-black text-xs">#{item._id?.slice(-8) || idx}</td>
                      <td className="px-6 py-4 text-foreground font-medium print:text-black">{new Date(item.donationDate || item.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-muted print:text-black font-bold">{item.bloodGroup}</td>
                      <td className="px-6 py-4 text-muted print:text-black">{item.units} Unit{item.units > 1 ? 's' : ''} ({item.units * 500}ml)</td>
                      <td className="px-6 py-4 text-muted print:text-black">{item.recipientName || "N/A"}</td>
                      <td className="px-6 py-4 text-muted print:text-black">{item.location}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase print:border ${
                          item.status === "Completed" ? "badge-success print:border-green-600 print:text-green-700" :
                          item.status === "Scheduled" ? "badge-warning print:border-yellow-600 print:text-yellow-700" :
                          "badge-danger print:border-red-600 print:text-red-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border flex justify-between items-center print:hidden">
              <span className="text-sm text-muted">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDonations.length)} of {filteredDonations.length} donations
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-background-secondary rounded-lg text-sm disabled:opacity-50 hover:bg-card-hover transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-background-secondary rounded-lg text-sm disabled:opacity-50 hover:bg-card-hover transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
