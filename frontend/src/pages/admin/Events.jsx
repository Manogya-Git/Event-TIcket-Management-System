import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { BASE_URL } from "../../api";
import { useAuth } from "../../context/AuthContext";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";

const columns = [
  { id: "title", label: "Title", minWidth: 180 },
  { id: "venue", label: "Venue", minWidth: 180 },
  { id: "organizer", label: "Organizer", minWidth: 150 },
  { id: "start_date", label: "Start Date", minWidth: 130 },
  { id: "end_date", label: "End Date", minWidth: 130 },
  { id: "status", label: "Status", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

const Events = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedEventSlug, setSelectedEventSlug] = useState(null);

  const handleClickOpen = (event) => {
    setSelectedEventSlug(event?.slug || event?.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEventSlug(null);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/events/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setRows(response.data || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [accessToken]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) {
    return <p className="p-8 text-slate-600">Loading events...</p>;
  }

  const getStatusStyles = (status) => {
    const normalized = (status || "").toUpperCase();

    if (normalized === "PUBLISHED") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (normalized === "DRAFT") {
      return "bg-amber-100 text-amber-700";
    }
    if (normalized === "CANCELLED") {
      return "bg-rose-100 text-rose-700";
    }
    if (normalized === "COMPLETED") {
      return "bg-sky-100 text-sky-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const handleDelete = async () => {
    if (!selectedEventSlug) return;

    try {
      await axios.delete(`${BASE_URL}/events/${selectedEventSlug}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setRows((prevRows) =>
        prevRows.filter((row) => (row.slug || row.id) !== selectedEventSlug),
      );
      handleClose();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Events</h1>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/events/new")}
          sx={{
            backgroundColor: "#0f172a",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 1,
            "&:hover": { backgroundColor: "#1e293b" },
          }}
        >
          Create Event
        </Button>
      </div>

      <div className="mx-auto w-full max-w-[1400px]">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="delete-event-dialog-title"
          aria-describedby="delete-event-dialog-description"
        >
          <DialogTitle id="delete-event-dialog-title">Delete Event</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-event-dialog-description">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Paper
          sx={{
            width: "100%",
            maxWidth: 1320,
            overflow: "hidden",
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
            margin: "0 auto",
          }}
        >
          <TableContainer sx={{ maxHeight: 500, background: "#ffffff" }}>
            <Table
              stickyHeader
              aria-label="events table"
              sx={{ tableLayout: "fixed" }}
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        background: "#0f172a",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      align="center"
                      sx={{ py: 6, color: "#64748b" }}
                    >
                      No events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.id || row.slug}
                        sx={{
                          "&:nth-of-type(even)": { backgroundColor: "#f8fafc" },
                        }}
                      >
                        {columns.map((column) => {
                          let value = row[column.id];

                          if (
                            (column.id === "start_date" ||
                              column.id === "end_date") &&
                            value
                          ) {
                            value = new Date(value).toLocaleDateString();
                          }

                          if (column.id === "status") {
                            value = (
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyles(value)}`}
                              >
                                {value || "-"}
                              </span>
                            );
                          }

                          if (column.id === "actions") {
                            value = (
                              <div className="flex items-center gap-1">
                                <IconButton
                                  size="small"
                                  aria-label="edit event"
                                  onClick={() =>
                                    navigate(`/admin/events/${row.slug}/edit`)
                                  }
                                  sx={{
                                    color: "#0f172a",
                                    backgroundColor: "#e2e8f0",
                                    "&:hover": { backgroundColor: "#cbd5e1" },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleClickOpen(row)}
                                  size="small"
                                  aria-label="delete event"
                                  sx={{
                                    color: "#b91c1c",
                                    backgroundColor: "#fee2e2",
                                    "&:hover": { backgroundColor: "#fecaca" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </div>
                            );
                          }

                          return (
                            <TableCell
                              key={column.id}
                              sx={{
                                py: 2,
                                color: "#0f172a",
                                borderBottom: "1px solid #e2e8f0",
                                fontSize: "0.95rem",
                              }}
                            >
                              {value ?? "-"}
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
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid #e2e8f0",
              background: "#f8fafc",
              ".MuiTablePagination-toolbar": {
                paddingLeft: 2,
                paddingRight: 2,
              },
            }}
          />
        </Paper>
      </div>
    </div>
  );
};

export default Events;
