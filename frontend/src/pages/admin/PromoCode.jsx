import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api";

const PromoCodeTable = () => {
  const navigate = useNavigate();
  const [promoCodes, setPromoCodes] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const dateOnly = String(dateString).match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (dateOnly) return dateOnly;

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/promocode/`);
      setPromoCodes(response.data);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Promo Codes</h2>
        <Button
          onClick={() => navigate("/admin/promocode/new")}
          variant="contained"
          startIcon={<AddIcon />}
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
          Create New Promo Code
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Code</th>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Discount
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Valid From
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Valid To
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700">Active</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {promoCodes.map((promo) => (
              <tr
                key={promo.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {promo.code}
                </td>

                <td className="px-6 py-4 text-gray-700">{promo.discount}%</td>

                <td className="px-6 py-4 text-gray-600">
                  {formatDate(promo.valid_from ?? promo.valid_form)}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {formatDate(promo.valid_to)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      promo.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {promo.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <IconButton
                    size="small"
                    aria-label={`edit ${promo.code}`}
                    sx={{
                      color: "#0f172a",
                      backgroundColor: "#e2e8f0",
                      mr: 1,
                    }}
                    onClick={() => navigate(`/admin/promocode/new/${promo.id}`)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label={`delete ${promo.code}`}
                    sx={{ color: "#b91c1c", backgroundColor: "#fee2e2" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoCodeTable;
