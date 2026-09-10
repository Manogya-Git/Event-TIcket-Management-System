import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import esewaLogo from "../assets/esewa.png";
import khaltiLogo from "../assets/khalti-logo-png_seeklogo-337962.png";
import { useCheckout } from "../context/CheckoutContext";
import axios from "axios";
import { redirectToEsewa } from "../utils/esewaRedirect";
import { BASE_URL } from "../api";

const PAYMENT_METHODS = [
  { id: "esewa", label: "eSewa", logo: esewaLogo },
  { id: "khalti", label: "Khalti", logo: khaltiLogo },
];

const Payment = () => {
  const { event } = useOutletContext();
  const navigate = useNavigate();
  const { selectedTicketId, quantity, personalDetails } = useCheckout();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedMethod) return;
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/bookings/`, {
        ticket: selectedTicketId,
        quantity: quantity,
        full_name: personalDetails.fullName,
        email: personalDetails.email,
        phone_number: personalDetails.phone,
        address: personalDetails.address,
      });

      const booking = response.data;

      if (selectedMethod !== "esewa") {
        setError("Khalti is not connected yet. Please pay with eSewa.");
        return;
      }

      const initiateResponse = await axios.post(
        `${BASE_URL}/payments/esewa/initiate/`,
        {
          booking_id: booking.id,
        },
      );

      const { payload, form_url } = initiateResponse.data;
      redirectToEsewa(payload, form_url);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          err.response.data.non_field_errors?.[0] ||
            JSON.stringify(err.response.data),
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900 p-10">
      <h1 className="text-xl font-semibold text-white">
        Choose a payment method
      </h1>
      <p className="mt-1 text-sm text-neutral-400">
        You'll be redirected to complete your payment securely.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div
        role="radiogroup"
        aria-label="Payment methods"
        className="mt-8 flex flex-col flex-wrap gap-6 sm:flex-row"
      >
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedMethod(method.id)}
              className={`flex flex-1 items-center justify-center gap-4 rounded-xl border px-8 py-8 text-base font-medium transition-colors ${
                isSelected
                  ? "border-lime-400 bg-lime-400/10 text-lime-400"
                  : "border-neutral-800 bg-neutral-950 text-white hover:border-neutral-700"
              }`}
            >
              <img
                src={method.logo}
                alt={method.label}
                className="h-12 w-auto"
              />
              {method.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group inline-flex items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 px-6 py-3 text-sm font-medium text-neutral-300 shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-lime-400 hover:bg-neutral-900 hover:text-lime-400 hover:shadow-lime-500/10"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">
            Previous
          </span>
        </button>

        <button
          type="button"
          disabled={!selectedMethod || loading}
          onClick={handleContinue}
          className="inline-flex items-center justify-center rounded-full bg-lime-400 px-8 py-3 text-sm font-semibold text-black shadow-lg shadow-lime-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-lime-300 hover:shadow-lime-500/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </main>
  );
};

export default Payment;
