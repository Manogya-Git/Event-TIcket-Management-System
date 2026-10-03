import { createContext, useContext, useState } from "react";
const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
  const [personalDetails, setPersonalDetails] = useState({
    phone: "",
    email: "",
    fullName: "",
    address: "",
    acceptedTerms: false,
  });
  const [quantities, setQuantities] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState(null);

  const value = {
    personalDetails,
    setPersonalDetails,
    quantities,
    setQuantities,
    promoCode,
    setPromoCode,
    discountInfo,
    setDiscountInfo,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
