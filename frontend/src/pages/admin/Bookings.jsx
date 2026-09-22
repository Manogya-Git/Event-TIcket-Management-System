import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { BASE_URL } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { ToggleButtonGroup } from "@mui/material";
import { ToggleButton } from "@mui/material";

const columns = [
  { id: "full_name", label: "Guest Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 220 },
  { id: "event", label: "Event", minWidth: 180 },
  { id: "ticket_tier", label: "Ticket Tier", minWidth: 130 },
  { id: "quantity", label: "Quantity", minWidth: 90, align: "center" },
  { id: "status", label: "Status", minWidth: 125 },
  { id: "payment_method", label: "Payment Method", minWidth: 150 },
  { id: "created", label: "Date Created", minWidth: 145 },
];

const statusColors = {
  CONFIRMED: { backgroundColor: "#dcfce7", color: "#166534" },
  PENDING: { backgroundColor: "#fef3c7", color: "#92400e" },
  CANCELLED: { backgroundColor: "#fee2e2", color: "#991b1b" },
};

const ticketTierColors = {
  REGULAR: { backgroundColor: "#dbeafe", color: "#1d4ed8" },
  VIP: { backgroundColor: "#ede9fe", color: "#6d28d9" },
  VVIP: { backgroundColor: "#fef3c7", color: "#b45309" },
};

const paymentMethodColors = {
  ESEWA: { backgroundColor: "#dcfce7", color: "#15803d" },
  KHALTI: { backgroundColor: "#fee2e2", color: "#dc2626" },
};

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "CANCELLED"];

const Bookings = () => {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchBookings = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      setError("");
      const url =
        statusFilter === "ALL"
          ? `${BASE_URL}/bookings/`
          : `${BASE_URL}/bookings/?status=${statusFilter}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setRows(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || [],
      );
    } catch (fetchError) {
      console.error("Failed to fetch bookings:", fetchError);
      setError("Unable to load bookings right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [accessToken, statusFilter]);

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = async (bookingId, nextStatus) => {
    if (!bookingId || !nextStatus || !accessToken) return;

    const originalRow = rows.find(
      (row) => row.id === bookingId || row.slug === bookingId,
    );
    if (!originalRow || originalRow.status === nextStatus) return;

    const confirmed = window.confirm(
      `Are you sure you want to change this booking status to ${nextStatus}?`,
    );

    if (!confirmed) return;

    const candidateUrls = [];

    if (originalRow.id !== undefined && originalRow.id !== null) {
      candidateUrls.push(`${BASE_URL}/bookings/${originalRow.id}/`);
    }

    if (originalRow.slug) {
      candidateUrls.push(`${BASE_URL}/bookings/${originalRow.slug}/`);
    }

    let requestSucceeded = false;

    try {
      for (const url of candidateUrls) {
        try {
          await axios.patch(
            url,
            { status: nextStatus },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
          requestSucceeded = true;
          break;
        } catch (patchError) {
          if (patchError.response?.status !== 404) {
            throw patchError;
          }
        }
      }

      if (!requestSucceeded) {
        throw new Error("Booking lookup did not match the backend route.");
      }

      setError("");
      await fetchBookings();
    } catch (patchError) {
      console.error("Failed to update booking status:", patchError);
      setError("Unable to update booking status.");
    }
  };

  const handleChangePage = (_event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  if (loading) {
    return <p className="p-8 text-slate-600">Loading bookings...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Bookings
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Review ticket bookings and payment details.
        </p>
      </div>
      <ToggleButtonGroup
        value={statusFilter}
        exclusive
        onChange={(_event, newStatus) => {
          if (newStatus !== null) {
            setStatusFilter(newStatus);
            setPage(0);
          }
        }}
        aria-label="booking status filter"
        size="small"
        sx={{
          mb: 3,
          p: 0.5,
          gap: 0.5,
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid #e2e8f0",
          borderRadius: 2.5,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
          "& .MuiToggleButtonGroup-grouped": {
            m: 0,
            border: 0,
            borderRadius: 1.75,
            color: "#64748b",
            fontWeight: 700,
            textTransform: "none",
            letterSpacing: "0.01em",
            px: { xs: 1.5, sm: 2 },
            py: 0.9,
            display: "flex",
            alignItems: "center",
            transition: "all 160ms ease",
            "&:hover": {
              backgroundColor: "#f1f5f9",
              color: "#0f172a",
            },
            "&.Mui-selected": {
              backgroundColor: "#0f172a",
              color: "#ffffff",
              boxShadow: "0 3px 8px rgba(15, 23, 42, 0.2)",
              "&:hover": { backgroundColor: "#1e293b" },
            },
            "&:focus-visible": {
              outline: "3px solid rgba(59, 130, 246, 0.35)",
              outlineOffset: 2,
            },
          },
        }}
      >
        <ToggleButton value="ALL" aria-label="all bookings">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#94a3b8",
              marginRight: 6,
              display: "inline-block",
            }}
          />
          All
        </ToggleButton>
        <ToggleButton value="PENDING" aria-label="pending bookings">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#f59e0b",
              marginRight: 6,
              display: "inline-block",
            }}
          />
          Pending
        </ToggleButton>
        <ToggleButton value="CONFIRMED" aria-label="confirmed bookings">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#16a34a",
              marginRight: 6,
              display: "inline-block",
            }}
          />
          Confirmed
        </ToggleButton>
        <ToggleButton value="CANCELLED" aria-label="cancelled bookings">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#dc2626",
              marginRight: 6,
              display: "inline-block",
            }}
          />
          Cancelled
        </ToggleButton>
      </ToggleButtonGroup>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
        }}
      >
        <TableContainer sx={{ maxHeight: 620, background: "#ffffff" }}>
          <Table
            stickyHeader
            aria-label="bookings table"
            sx={{ minWidth: 1220 }}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sx={{
                      minWidth: column.minWidth,
                      backgroundColor: "#0f172a",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ py: 6, color: "#b91c1c" }}
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ py: 6, color: "#64748b" }}
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#f8fafc" },
                      }}
                    >
                      {columns.map((column) => {
                        const value =
                          column.id === "created"
                            ? formatDate(row.created)
                            : row[column.id];

                        return (
                          <TableCell
                            key={column.id}
                            align={column.align || "left"}
                            sx={{
                              py: 2,
                              color: "#0f172a",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "0.92rem",
                            }}
                          >
                            {column.id === "status" ? (
                              <FormControl size="small" sx={{ minWidth: 140 }}>
                                <Select
                                  value={row.status || "PENDING"}
                                  onChange={(event) =>
                                    handleStatusChange(
                                      row.id,
                                      event.target.value,
                                    )
                                  }
                                  size="small"
                                  sx={{
                                    backgroundColor: statusColors[row.status]
                                      ? statusColors[row.status].backgroundColor
                                      : "#f1f5f9",
                                    color: statusColors[row.status]
                                      ? statusColors[row.status].color
                                      : "#475569",
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: "0.78rem",
                                    ".MuiOutlinedInput-notchedOutline": {
                                      border: "none",
                                    },
                                    ".MuiSelect-select": {
                                      py: 1,
                                      px: 1.5,
                                    },
                                  }}
                                >
                                  {STATUS_OPTIONS.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : column.id === "ticket_tier" ||
                              column.id === "payment_method" ? (
                              <Chip
                                label={value || "-"}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  ...((column.id === "ticket_tier"
                                    ? ticketTierColors[value]
                                    : paymentMethodColors[value]) || {
                                    backgroundColor: "#f1f5f9",
                                    color: "#475569",
                                  }),
                                }}
                              />
                            ) : (
                              (value ?? "-")
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </div>
  );
};

export default Bookings;
