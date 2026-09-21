import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!accessToken) return;

      try {
        const response = await axios.get(
          `${BASE_URL}/api/admin/dashboard-stats/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, [accessToken]);

  if (!stats) {
    return <p className="p-8 text-slate-600">Loading...</p>;
  }

  const statCards = [
    {
      label: "Total Events",
      value: stats.total_events,
      tone: "bg-slate-900 text-white",
    },
    {
      label: "Upcoming Events",
      value: stats.upcoming_events,
      tone: "bg-white text-slate-900",
    },
    {
      label: "Total Bookings",
      value: stats.total_bookings,
      tone: "bg-white text-slate-900",
    },
    {
      label: "Pending Bookings",
      value: stats.pending_bookings,
      tone: "bg-white text-slate-900",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Overview
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, tone }) => (
            <div
              key={label}
              className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${tone}`}
            >
              <p className="text-sm font-medium opacity-80">{label}</p>
              <h3 className="mt-3 text-3xl font-bold">{value}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
