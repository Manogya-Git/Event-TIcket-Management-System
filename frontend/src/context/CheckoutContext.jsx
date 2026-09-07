import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [personalDetails, setPersonalDetails] = useState({
    phone: "",
    email: "",
    fullName: "",
    address: "",
    acceptedTerms: false,
  });

  const value = {
    selectedTicketId,
    setSelectedTicketId,
    quantity,
    setQuantity,
    personalDetails,
    setPersonalDetails,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
