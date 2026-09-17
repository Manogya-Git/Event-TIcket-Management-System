import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Building2,
  Users,
  FolderKanban,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Events", icon: CalendarDays },
  { name: "Bookings", icon: ClipboardList },
  { name: "Venue", icon: Building2 },
  { name: "Artists", icon: Users },
  { name: "Categories", icon: FolderKanban },
];

const AdminSidebar = () => {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-[#f7f7f5] px-5 py-6 text-slate-700">
      <div className="mb-10 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
            K
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Admin
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Kgarira</h1>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map(({ name, icon: Icon, active }) => (
          <button
            key={name}
            type="button"
            className={[
              "group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all duration-200",
              active
                ? "bg-slate-900 text-white shadow-[0_10px_25px_rgba(15,23,42,0.12)]"
                : "text-slate-600 hover:bg-white hover:text-slate-900",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              <span>{name}</span>
            </span>
            <ChevronRight
              className={[
                "h-4 w-4 opacity-0 transition-opacity",
                active ? "opacity-100" : "group-hover:opacity-70",
              ].join(" ")}
            />
          </button>
        ))}
      </nav>

   
      
      
    </aside>
  );
};

export default AdminSidebar;
