import { useState } from "react";
import axios from "axios";
import { Ticket, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api";
import { useCheckout } from "../../context/CheckoutContext";

const TicketGrid = ({
  event,
  tickets,
  quantities,
  setQuantities,
  total,
  displayedTotal,
  totalCount,
}) => {
  const navigate = useNavigate();
  const { discountInfo, setDiscountInfo, setPromoCode } = useCheckout();
  const [promoCode, setPromoCodeLocal] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const changeQuantity = (ticketId, delta) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[ticketId] ?? 0) + delta);
      return { ...prev, [ticketId]: next };
    });
  };

  const handleApplyPromo = async () => {
    const trimmedCode = promoCode.trim();

    if (!trimmedCode) {
      setPromoError("Please enter a promo code.");
      setPromoMessage("");
      return;
    }

    if (totalCount === 0) {
      setPromoError("Please select at least one ticket.");
      setPromoMessage("");
      return;
    }

    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketId, quantity]) => ({
        ticket: Number(ticketId),
        quantity,
      }));

    setPromoLoading(true);
    setPromoError("");
    setPromoMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/promocode/`, {
        code: trimmedCode,
        event_id: event.id,
        items,
      });

      setDiscountInfo(response.data);
      setPromoCode(trimmedCode);
      setPromoMessage(`✓ ${response.data.message || "Promo code applied."}`);
    } catch (error) {
      setDiscountInfo(null);
      setPromoCode("");
      setPromoError(error.response?.data?.error || "Invalid promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCodeLocal("");
    setDiscountInfo(null);
    setPromoMessage("");
    setPromoCode("");
    setPromoError("");
  };

  return (
    <>
      <div className="lg:sticky lg:top-10 lg:self-start">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Ticket className="h-5 w-5 text-lime-400" />
            Select tickets
          </h2>

          {tickets.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-400">
              Tickets for this event haven't been released yet.
            </p>
          ) : (
            <>
              <div className="mt-5 flex flex-col gap-3">
                {tickets.map((ticket) => {
                  const qty = quantities[ticket.id] ?? 0;
                  const isSelected = qty > 0;
                  return (
                    <div
                      key={ticket.id}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                        isSelected
                          ? "border-lime-400 bg-lime-400/10"
                          : "border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {ticket.ticket_type}
                      </span>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? "text-lime-400" : "text-neutral-300"
                          }`}
                        >
                          Rs. {Number(ticket.price).toFixed(0)}
                        </span>
                        <button
                          onClick={() => changeQuantity(ticket.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 hover:border-lime-400 hover:text-lime-400 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-4 text-center text-sm font-medium">
                          {qty}
                        </span>
                        <button
                          onClick={() => changeQuantity(ticket.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 hover:border-lime-400 hover:text-lime-400 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setPromoCodeLocal(code);
                      setPromoCode(code);
                    }}
                    placeholder="Enter code"
                    className="w-full rounded-full border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading}
                    className="rounded-full bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-100 transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {promoLoading ? "Checking..." : "Check"}
                  </button>
                </div>
                {promoMessage && (
                  <p className="mt-2 text-xs text-lime-300">{promoMessage}</p>
                )}
                {promoError && (
                  <p className="mt-2 text-xs text-red-400">{promoError}</p>
                )}
                {discountInfo && (
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400 hover:text-neutral-200"
                  >
                    Remove promo
                  </button>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-neutral-400">Total</span>
                <span className="text-xl font-bold">
                  Rs. {Number(displayedTotal ?? total).toFixed(0)}
                </span>
              </div>

              <button
                disabled={totalCount === 0}
                onClick={() => navigate("details")}
                className="mt-5 w-full rounded-full bg-lime-400 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Get tickets
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketGrid;
