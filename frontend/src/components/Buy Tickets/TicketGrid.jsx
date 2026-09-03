import { Ticket, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TicketGrid = ({
  tickets,
  quantity,
  selectedTicketId,
  setSelectedTicketId,
  setQuantity,
  selectedTicket,
  total,
}) => {
  const navigate = useNavigate();
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
                  const isSelected = ticket.id === selectedTicketId;
                  return (
                    <button
                      key={ticket.id}
                      onClick={() => {
                        setSelectedTicketId(ticket.id);
                        setQuantity(1);
                      }}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? "border-lime-400 bg-lime-400/10"
                          : "border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {ticket.ticket_type}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-lime-400" : "text-neutral-300"
                        }`}
                      >
                        Rs. {Number(ticket.price).toFixed(0)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedTicket && (
                <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-6">
                  <span className="text-sm text-neutral-400">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 hover:border-lime-400 hover:text-lime-400 transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 hover:border-lime-400 hover:text-lime-400 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-neutral-400">Total</span>
                <span className="text-xl font-bold">
                  Rs. {total.toFixed(0)}
                </span>
              </div>

              <button
                disabled={!selectedTicket}
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
