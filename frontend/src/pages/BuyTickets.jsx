import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import TicketGrid from "../components/Buy Tickets/TicketGrid";
import { useCheckout } from "../context/CheckoutContext";

const BuyTickets = () => {
  const { event } = useOutletContext();

  const { quantities, setQuantities, discountInfo } = useCheckout();

  useEffect(() => {
    setQuantities({});
  }, [event]);

  const tickets = event?.tickets ?? [];
  const total = tickets.reduce(
    (sum, ticket) => sum + Number(ticket.price) * (quantities[ticket.id] ?? 0),
    0,
  );
  const totalCount = tickets.reduce(
    (sum, tickets) => sum + (quantities[tickets.id] ?? 0),
    0,
  );
  const displayedTotal = discountInfo
    ? Math.max(0, total - discountInfo.discount_amount)
    : total;

  return (
    <TicketGrid
      event={event}
      tickets={tickets}
      quantities={quantities}
      setQuantities={setQuantities}
      totalCount={totalCount}
      total={total}
      displayedTotal={displayedTotal}
    />
  );
};

export default BuyTickets;
