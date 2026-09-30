import { createContext, useContext, useState } from "react";
import { useAsyncError } from "react-router-dom";

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
  const [quantities, setQuantities] = useState({});

  const value = {
    personalDetails,
    setPersonalDetails,
    quantities,
    setQuantities,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
