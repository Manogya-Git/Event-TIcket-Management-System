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
import { BASE_URL } from "../../api";
import { useAuth } from "../../context/AuthContext";

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

const Bookings = () => {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/bookings/`, {
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

    fetchBookings();
  }, [accessToken]);

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
                            {column.id === "status" ||
                            column.id === "ticket_tier" ||
                            column.id === "payment_method" ? (
                              <Chip
                                label={value || "-"}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  ...((column.id === "status"
                                    ? statusColors[value]
                                    : column.id === "ticket_tier"
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
