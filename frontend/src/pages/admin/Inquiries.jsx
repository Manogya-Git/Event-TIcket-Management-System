import axios from "axios";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api";
import { useAuth } from "../../context/AuthContext";

const baseColumns = [
  { id: "type", label: "Type", minWidth: 120 },
  { id: "full_name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 220 },
  { id: "phone_number", label: "Phone", minWidth: 150 },
  { id: "event_name", label: "Event", minWidth: 180 },
  { id: "event_date", label: "Event Date", minWidth: 140 },
  { id: "status", label: "Status", minWidth: 120 },
];

const venueColumn = { id: "venue_name", label: "Venue", minWidth: 180 };
const artistColumn = { id: "artist_name", label: "Artist", minWidth: 180 };

const getRows = (response) => {
  const data = response.data;
  return Array.isArray(data) ? data : data?.results || [];
};

const Inquiries = ({ inquiryType, endpoint, title }) => {
  const columns =
    inquiryType === "Venue"
      ? [...baseColumns.slice(0, 5), venueColumn, ...baseColumns.slice(5)]
      : inquiryType === "Artist"
        ? [...baseColumns.slice(0, 5), artistColumn, ...baseColumns.slice(5)]
        : baseColumns;
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchInquiries = async () => {
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await axios.get(`${BASE_URL}${endpoint}`, { headers });
        const inquiryRows = getRows(response).map((inquiry) => ({
          ...inquiry,
          type: inquiryType,
          inquiryId: `${inquiryType.toLowerCase()}-${inquiry.id}`,
        }));

        setRows(inquiryRows);
        setError("");
      } catch (requestError) {
        console.error("Failed to fetch inquiries:", requestError);
        setError("Unable to load inquiries right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [accessToken]);

  if (loading) {
    return <p className="p-8 text-slate-600">Loading inquiries...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 2,
            color: "#475569",
            textTransform: "none",
            fontWeight: 600,
            px: 0,
            "&:hover": { backgroundColor: "transparent", color: "#0f172a" },
          }}
        >
          Back
        </Button>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review artist and venue booking inquiries.
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
            aria-label="inquiries table"
            sx={{ minWidth: 1050 }}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      minWidth: column.minWidth,
                      background: "#0f172a",
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
                    No inquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.inquiryId}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          sx={{
                            color: "#0f172a",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {column.id === "type" ? (
                            <Chip
                              label={row.type}
                              size="small"
                              color={
                                row.type === "Artist" ? "primary" : "success"
                              }
                            />
                          ) : (
                            row[column.id] || "-"
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
        />
      </Paper>
    </div>
  );
};

export default Inquiries;
