import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { BASE_URL, mediaUrl } from "../../api";
import { useAuth } from "../../context/AuthContext";

const columns = [
  { id: "image", label: "Image", minWidth: 90 },
  { id: "name", label: "Name", minWidth: 180 },
  { id: "address", label: "Address", minWidth: 220 },
  { id: "capacity", label: "Capacity", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

const Venue = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);

  const fetchVenues = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/venues/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setRows(response.data || []);
      setError("");
    } catch (requestError) {
      console.error("Failed to fetch venues:", requestError);
      setError("Unable to load venues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [accessToken]);

  const handleDelete = async () => {
    if (!selectedVenue) return;

    try {
      await axios.delete(`${BASE_URL}/venues/${selectedVenue.slug}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setRows((currentRows) =>
        currentRows.filter((row) => row.slug !== selectedVenue.slug),
      );
      setSelectedVenue(null);
    } catch (requestError) {
      console.error("Failed to delete venue:", requestError);
      setError("Unable to delete venue.");
    }
  };

  if (loading) {
    return <p className="p-8 text-slate-600">Loading venues...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Venues</h1>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/venue/new")}
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
          Create Venue
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-rose-700">{error}</p>}

      <Dialog
        open={Boolean(selectedVenue)}
        onClose={() => setSelectedVenue(null)}
        aria-labelledby="delete-venue-dialog-title"
      >
        <DialogTitle id="delete-venue-dialog-title">Delete Venue</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedVenue?.name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedVenue(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
        }}
      >
        <TableContainer sx={{ maxHeight: 500, background: "#ffffff" }}>
          <Table
            stickyHeader
            aria-label="venues table"
            sx={{ tableLayout: "fixed" }}
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
                    No venues found.
                  </TableCell>
                </TableRow>
              ) : (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      key={row.id || row.slug}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#f8fafc" },
                      }}
                    >
                      <TableCell sx={{ borderBottom: "1px solid #e2e8f0" }}>
                        <Avatar
                          src={mediaUrl(row.image)}
                          alt={row.name}
                          variant="rounded"
                          sx={{ width: 48, height: 48 }}
                        >
                          {row.name?.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#0f172a",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {row.name || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#0f172a",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {row.address || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#0f172a",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {row.capacity ?? 0}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #e2e8f0" }}>
                        <IconButton
                          size="small"
                          aria-label={`edit ${row.name}`}
                          onClick={() =>
                            navigate(`/admin/venue/${row.slug}/edit`)
                          }
                          sx={{
                            color: "#0f172a",
                            backgroundColor: "#e2e8f0",
                            mr: 1,
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          aria-label={`delete ${row.name}`}
                          onClick={() => setSelectedVenue(row)}
                          sx={{ color: "#b91c1c", backgroundColor: "#fee2e2" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
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
          sx={{ borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}
        />
      </Paper>
    </div>
  );
};

export default Venue;
