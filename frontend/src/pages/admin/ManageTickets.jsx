import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { BASE_URL } from "../../api";
import { useAuth } from "../../context/AuthContext";

const columns = [
  { id: "event", label: "Event", minWidth: 180 },
  { id: "ticket_type", label: "Ticket Type", minWidth: 140 },
  { id: "quantity", label: "Total Qty", minWidth: 110 },
  { id: "sold_quantity", label: "Sold", minWidth: 90 },
  { id: "price", label: "Price", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

const ManageTickets = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventId, setEventId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newTicket, setNewTicket] = useState({
    ticket_type: "REGULAR",
    price: "",
    quantity: "",
  });

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await axios.patch(
          `${BASE_URL}/tickets/${editingId}/`,
          {
            ticket_type: newTicket.ticket_type,
            price: newTicket.price,
            quantity: newTicket.quantity,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === editingId ? response.data : row)),
        );
      } else {
        const response = await axios.post(
          `${BASE_URL}/tickets/`,
          {
            event: eventId,
            ticket_type: newTicket.ticket_type,
            price: newTicket.price,
            quantity: newTicket.quantity,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        setRows((prevRows) => [...prevRows, response.data]);
      }

      setNewTicket({ ticket_type: "REGULAR", price: "", quantity: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save ticket:", error);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/tickets/?event=${slug}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setRows(
          Array.isArray(response.data)
            ? response.data
            : response.data.results || [],
        );
      } catch (fetchError) {
        console.error("Failed to fetch tickets:", fetchError);
        setError("Unable to load tickets right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [slug, accessToken]);

  useEffect(() => {
    const fetchEventId = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/events/${slug}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setEventId(response.data.id);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      }
    };

    fetchEventId();
  }, [slug, accessToken]);

  if (loading) {
    return <p className="p-8 text-slate-600">Loading tickets...</p>;
  }

  const handleDeleteClick = (id) => {
    setTicketToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTicketToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!ticketToDelete || !accessToken) return;

    try {
      await axios.delete(`${BASE_URL}/tickets/${ticketToDelete}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== ticketToDelete),
      );
      setError("");
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Failed to delete ticket:", error);
      setError("Unable to delete this ticket right now.");
    }
  };

  const handleEditClick = (row) => {
    setEditingId(row.id);
    setNewTicket({
      ticket_type: row.ticket_type,
      price: row.price,
      quantity: row.quantity,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <button
        type="button"
        onClick={() => navigate("/admin/events")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to events
      </button>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Ticket Inventory
        </h1>
      </div>

      <form
        onSubmit={handleCreateTicket}
        className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="ticket_type"
            className="text-sm font-medium text-slate-700"
          >
            Ticket Type
          </label>
          <select
            id="ticket_type"
            name="ticket_type"
            value={newTicket.ticket_type}
            onChange={handleTicketChange}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500"
          >
            <option value="REGULAR">Regular</option>
            <option value="VIP">VIP</option>
            <option value="VVIP">VVIP</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="text-sm font-medium text-slate-700">
            Price
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={newTicket.price}
            onChange={handleTicketChange}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-slate-700"
          >
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={newTicket.quantity}
            onChange={handleTicketChange}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Add Ticket
        </button>
      </form>

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
          <Table stickyHeader aria-label="tickets table" sx={{ minWidth: 900 }}>
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
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#f8fafc" },
                    }}
                  >
                    <TableCell
                      sx={{
                        py: 2,
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "0.92rem",
                      }}
                    >
                      {row.event_title || row.event?.title || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2,
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "0.92rem",
                      }}
                    >
                      {row.ticket_type || "-"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        py: 2,
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "0.92rem",
                      }}
                    >
                      {row.quantity ?? "-"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        py: 2,
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "0.92rem",
                      }}
                    >
                      {row.sold_quantity ?? "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2,
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "0.92rem",
                      }}
                    >
                      {row.price ? `Rs. ${row.price}` : "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2,
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "0.92rem",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <IconButton
                          size="small"
                          aria-label="edit ticket"
                          onClick={() => handleEditClick(row)}
                          sx={{ color: "#0f172a" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          aria-label="delete ticket"
                          onClick={() => handleDeleteClick(row.id)}
                          sx={{ color: "#dc2626" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-ticket-dialog-title"
        aria-describedby="delete-ticket-dialog-description"
      >
        <DialogTitle id="delete-ticket-dialog-title">Delete Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-ticket-dialog-description">
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageTickets;
