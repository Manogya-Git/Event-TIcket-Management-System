import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../api";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Categories = () => {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const requestConfig = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const fetchCategories = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/category/`, requestConfig);
      setRows(response.data || []);
      setError("");
    } catch (requestError) {
      console.error("Failed to fetch categories:", requestError);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [accessToken]);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setName("");
    setError("");
    setEditorOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setName(category.name || "");
    setError("");
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingCategory(null);
    setName("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingCategory) {
        await axios.patch(
          `${BASE_URL}/category/${editingCategory.id}/`,
          { name: name.trim() },
          requestConfig,
        );
      } else {
        await axios.post(
          `${BASE_URL}/category/`,
          { name: name.trim() },
          requestConfig,
        );
      }
      await fetchCategories();
      closeEditor();
    } catch (requestError) {
      console.error("Failed to save category:", requestError);
      setError(
        requestError.response?.data?.name?.[0] ||
          "The category could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await axios.delete(
        `${BASE_URL}/category/${deleteTarget.id}/`,
        requestConfig,
      );
      setRows((currentRows) =>
        currentRows.filter((row) => row.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
    } catch (requestError) {
      console.error("Failed to delete category:", requestError);
      setError("Unable to delete category.");
    }
  };

  if (loading) {
    return <p className="p-8 text-slate-600">Loading categories...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Categories</h1>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
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
          Create Category
        </Button>
      </div>

      {error && !editorOpen && (
        <p className="mb-4 text-sm text-rose-700">{error}</p>
      )}

      <Dialog open={editorOpen} onClose={closeEditor} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              fullWidth
              label="Category name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Music"
              margin="dense"
              inputProps={{ maxLength: 20 }}
            />
            {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditor} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !name.trim()}
            >
              {saving ? "Saving..." : editingCategory ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {deleteTarget?.name}? Existing
            events may no longer be associated with this category.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
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
          <Table stickyHeader aria-label="categories table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ background: "#0f172a", color: "#fff", fontWeight: 700 }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{ background: "#0f172a", color: "#fff", fontWeight: 700 }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{ background: "#0f172a", color: "#fff", fontWeight: 700 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ py: 6, color: "#64748b" }}
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#f8fafc" },
                      }}
                    >
                      <TableCell sx={{ color: "#64748b" }}>{row.id}</TableCell>
                      <TableCell sx={{ color: "#0f172a", fontWeight: 600 }}>
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          aria-label={`edit ${row.name}`}
                          onClick={() => openEditDialog(row)}
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
                          onClick={() => setDeleteTarget(row)}
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

export default Categories;
