import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { BASE_URL } from "../api";
import { useAuth } from "../context/AuthContext";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white sm:text-base";

const PromoCodeForm = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    valid_from: "",
    valid_to: "",
    applicable_events: [],
    active: false,
  });
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      setEventsError("");
      try {
        const response = await axios.get(`${BASE_URL}/events/`);
        const eventList = Array.isArray(response.data)
          ? response.data
          : response.data?.results;
        if (!Array.isArray(eventList)) {
          throw new Error("Unexpected events response from the server.");
        }
        setEvents(eventList);
      } catch (requestError) {
        console.error("Failed to fetch events:", requestError);
        setEventsError("Unable to load events. Please try again later.");
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (slug) {
      axios
        .get(`${BASE_URL}/api/admin/promocode/${slug}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          setFormData({
            ...response.data,
            valid_from: response.data.valid_from?.slice(0, 10) ?? "",
            valid_to: response.data.valid_to?.slice(0, 10) ?? "",
          });
        });
    }
  }, [slug]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    const data = {
      code: formData.code.trim().toUpperCase(),
      discount: Number(formData.discount),
      valid_from: formData.valid_from,
      valid_to: formData.valid_to,
      applicable_events: formData.applicable_events,
      active: formData.active,
    };

    event.preventDefault();
    setSaving(true);
    setError("");

    if (formData.valid_to < formData.valid_from) {
      setError("Valid To must be on or after Valid From.");
      setSaving(false);
      return;
    }

    try {
      if (slug) {
        await axios.patch(`${BASE_URL}/api/admin/promocode/${slug}/`, data, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        await axios.post(`${BASE_URL}/api/admin/promocode/`, data, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      navigate("/admin/promocode");
    } catch (requestError) {
      console.error(
        "Failed to " + (slug ? "updated" : "created") + " promo code",
        requestError,
      );
      const responseData = requestError.response?.data;
      const firstFieldError = responseData
        ? Object.values(responseData).flat()[0]
        : null;
      setError(
        responseData?.detail ||
          responseData?.error ||
          firstFieldError ||
          "The promo code could not be " +
            (slug ? "updated" : "created") +
            ". Please check the form and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8">
        <button
          type="button"
          onClick={() => navigate("/admin/promocode")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to promo codes
        </button>
        <h1 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
          {slug ? "Update Promo Code" : "Create Promo Code"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="code"
                className="text-sm font-medium text-slate-700"
              >
                Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={50}
                value={formData.code}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Enter promo code"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="discount"
                className="text-sm font-medium text-slate-700"
              >
                Discount (%)
              </label>
              <input
                id="discount"
                name="discount"
                type="number"
                required
                min={0}
                max={100}
                value={formData.discount}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Enter discount percentage"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="valid_from"
                className="text-sm font-medium text-slate-700"
              >
                Valid From
              </label>
              <input
                id="valid_from"
                name="valid_from"
                type="date"
                required
                value={formData.valid_from}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="valid_to"
                className="text-sm font-medium text-slate-700"
              >
                Valid To
              </label>
              <input
                id="valid_to"
                name="valid_to"
                type="date"
                required
                value={formData.valid_to}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <FormControl fullWidth>
                <InputLabel
                  id="applicable-events-label"
                  sx={{
                    color: "#64748b",
                    "&.Mui-focused": { color: "#0f172a" },
                  }}
                >
                  Applicable Events
                </InputLabel>
                <Select
                  labelId="applicable-events-label"
                  id="applicable_events"
                  multiple
                  value={formData.applicable_events}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      applicable_events: event.target.value.map(Number),
                    }))
                  }
                  label="Applicable Events"
                  disabled={eventsLoading || Boolean(eventsError)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        mt: 1,
                        maxHeight: 320,
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 16px 35px rgba(15, 23, 42, 0.14)",
                        "& .MuiList-root": { p: 1 },
                      },
                    },
                  }}
                  sx={{
                    minHeight: 52,
                    borderRadius: "16px",
                    backgroundColor: "#f8fafc",
                    color: "#0f172a",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e2e8f0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#94a3b8",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0f172a",
                      borderWidth: 1,
                    },
                    "& .MuiSelect-icon": { color: "#64748b" },
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return (
                        <span className="text-slate-400">
                          Choose events (optional)
                        </span>
                      );
                    }
                    return (
                      <Box
                        sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}
                      >
                        {events
                          .filter((item) => selected.includes(item.id))
                          .map((item) => (
                            <Chip
                              key={item.id}
                              label={item.title}
                              size="small"
                              sx={{
                                borderRadius: 2,
                                backgroundColor: "#e2e8f0",
                                color: "#0f172a",
                                fontWeight: 600,
                              }}
                            />
                          ))}
                      </Box>
                    );
                  }}
                >
                  {eventsLoading ? (
                    <MenuItem disabled>Loading events...</MenuItem>
                  ) : events.length === 0 ? (
                    <MenuItem disabled>No events available</MenuItem>
                  ) : (
                    events.map((item) => (
                      <MenuItem
                        key={item.id}
                        value={item.id}
                        sx={{
                          minHeight: 44,
                          borderRadius: 2,
                          color: "#334155",
                          "&.Mui-selected": {
                            backgroundColor: "#f1f5f9",
                            color: "#0f172a",
                          },
                          "&.Mui-selected:hover, &:hover": {
                            backgroundColor: "#f1f5f9",
                          },
                        }}
                      >
                        <Checkbox
                          checked={formData.applicable_events.includes(item.id)}
                          sx={{
                            color: "#94a3b8",
                            "&.Mui-checked": { color: "#0f172a" },
                          }}
                        />
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: formData.applicable_events.includes(
                              item.id,
                            )
                              ? 600
                              : 500,
                          }}
                        />
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <p className="text-xs text-slate-500">
                Leave empty to apply the promo code to all events.
              </p>
              {eventsError && (
                <p role="alert" className="text-sm text-rose-700">
                  {eventsError}
                </p>
              )}
            </div>

            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 md:col-span-2">
              <input
                name="active"
                type="checkbox"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 accent-slate-900"
              />
              Active
            </label>
          </div>
          {error && (
            <p role="alert" className="text-sm text-rose-700">
              {String(error)}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoCodeForm;
