import React from "react";
import AdminSidebar from "./AdminSidebar";

const stats = [
  {
    label: "Total revenue",
    value: "Rs. 245K",
    tone: "bg-slate-900 text-white",
  },
  { label: "Bookings", value: "1,284", tone: "bg-white text-slate-900" },
  { label: "Artists", value: "42", tone: "bg-white text-slate-900" },
];

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#f3f1ee] text-slate-800">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Overview
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
