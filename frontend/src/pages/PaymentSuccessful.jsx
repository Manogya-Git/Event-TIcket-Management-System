import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../api";

const PaymentSuccessful = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const data = searchParams.get("data");

      if (!data) {
        setStatus("failed");
        return;
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/payments/esewa/verify/`,
          {
            data,
          },
        );
        setBooking(response.data.booking || response.data);
        setStatus(response.data.status || "failed");
      } catch (error) {
        console.error(error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      {/* Ticket stub */}
      <div className="relative w-full max-w-sm">
        {/* Perforation notches */}
        <div className="absolute left-1/2 -translate-x-1/2 top-42 w-6 h-6 rounded-full bg-black z-10 -ml-[calc(50%-3px)]" />
        <div className="relative bg-[#101A14] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
          {/* Top: status band */}
          <div
            className={`px-8 pt-10 pb-8 text-center transition-colors duration-500 ${
              status === "PAID"
                ? "bg-linear-to-b from-[#22C55E]/20 to-transparent"
                : status === "failed"
                  ? "bg-linear-to-b from-[#166534]/25 to-transparent"
                  : "bg-linear-to-b from-[#22C55E]/15 to-transparent"
            }`}
          >
            <StatusIcon status={status} />

            <p
              className="mt-5 text-[13px] tracking-wide text-white/50 uppercase"
              style={{ letterSpacing: "0.08em" }}
            >
              Kgarira
            </p>

            <h1
              className="mt-2 text-3xl text-white leading-tight"
              style={{
                fontFamily: "'Oswald', 'Arial Narrow', sans-serif",
                fontWeight: 600,
              }}
            >
              {status === "verifying" && "Confirming your seat"}
              {status === "failed" && "Payment didn't go through"}
              {status === "PAID" && "You're going"}
            </h1>

            <p className="mt-3 text-[15px] text-white/60 leading-relaxed max-w-[26ch] mx-auto">
              {status === "verifying" &&
                "Checking your eSewa payment. This usually takes a few seconds."}
              {status === "failed" &&
                "We couldn't confirm this transaction. No amount was charged if the payment was cancelled."}
              {status === "PAID" &&
                "Your ticket confirmation is on its way to your email."}
            </p>
          </div>

          {/* Perforated divider */}
          <div className="relative px-8">
            <div className="border-t border-dashed border-white/15" />
          </div>

          {/* Bottom: details / actions */}
          <div className="px-8 py-7">
            {status === "PAID" && booking && (
              <div className="mb-6 space-y-2.5">
                {booking.eventName && (
                  <Row label="Event" value={booking.eventName} />
                )}
                {booking.transaction_uuid && (
                  <Row
                    label="Reference"
                    value={booking.transaction_uuid.slice(0, 18)}
                    mono
                  />
                )}
                {booking.fullName && (
                  <Row label="Booked for" value={booking.fullName} />
                )}
              </div>
            )}

            <button
              onClick={() => navigate("/")}
              className={`w-full py-3 rounded-lg text-[15px] font-medium transition-colors ${
                status === "PAID"
                  ? "bg-[#22C55E] text-black hover:bg-[#4ADE80]"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              {status === "PAID" ? "Back to events" : "Return home"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, mono }) => (
  <div className="flex items-baseline justify-between gap-4">
    <span className="text-[13px] text-white/40">{label}</span>
    <span
      className={`text-[14px] text-white/85 text-right ${mono ? "font-mono tracking-tight" : ""}`}
    >
      {value}
    </span>
  </div>
);

const StatusIcon = ({ status }) => {
  if (status === "verifying") {
    return (
      <div className="mx-auto w-12 h-12 rounded-full border-2 border-[#E8A33D]/30 border-t-[#E8A33D] animate-spin" />
    );
  }
  if (status === "failed") {
    return (
      <div className="mx-auto w-12 h-12 rounded-full bg-[#C0524A]/15 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="#E08981"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="mx-auto w-12 h-12 rounded-full bg-[#3FA796]/15 flex items-center justify-center">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13l4 4L19 7"
          stroke="#3FA796"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default PaymentSuccessful;
