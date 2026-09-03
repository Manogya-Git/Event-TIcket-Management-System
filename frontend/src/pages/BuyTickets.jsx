import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import TicketGrid from "../components/Buy Tickets/TicketGrid";

const BuyTickets = () => {
  const { event } = useOutletContext();

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedTicketId(event?.tickets?.[0]?.id ?? null);
  }, [event]);

  const tickets = event?.tickets ?? [];
  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId],
  );
  const total = selectedTicket ? Number(selectedTicket.price) * quantity : 0;

  return (
    <TicketGrid
      tickets={tickets}
      quantity={quantity}
      selectedTicketId={selectedTicketId}
      setSelectedTicketId={setSelectedTicketId}
      setQuantity={setQuantity}
      selectedTicket={selectedTicket}
      total={total}
    />
  );
};

export default BuyTickets;