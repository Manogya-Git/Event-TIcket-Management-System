import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Building2,
  Users,
  FolderKanban,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Events", icon: CalendarDays, path: "/admin/events" },
  { name: "Bookings", icon: ClipboardList, path: "/admin/bookings" },
  { name: "Venue", icon: Building2, path: "/admin/venue" },
  { name: "Artists", icon: Users, path: "/admin/artists" },
  { name: "Categories", icon: FolderKanban, path: "/admin/categories" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    setOpen(false);
  };

  return (
    <>
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

        <nav className="flex flex-1 flex-col space-y-2">
          {menuItems.map(({ name, icon: Icon, path }) => {
            const isActive = location.pathname === path;

            return (
              <button
                key={name}
                type="button"
                onClick={() => navigate(path)}
                className={[
                  "group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all duration-200",
                  isActive
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
                    isActive ? "opacity-100" : "group-hover:opacity-70",
                  ].join(" ")}
                />
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleClickOpen}
            className="mt-auto flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex items-center gap-3">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </span>
          </button>
        </nav>
      </aside>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out of the admin panel?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleLogout}
            color="error"
            variant="contained"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminSidebar;
