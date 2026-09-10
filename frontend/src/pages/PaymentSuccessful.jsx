import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccessful = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

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
            data: data,
          },
        );
        console.log("Verified:", response.data);
      } catch (error) {
        console.error(err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams]);
  if (status === "verifying") {
    return (
      <div className="text-white text-center mt-20">
        Verifying your payment...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-white text-center mt-20">
        <p>We couldn't verify your payment.</p>
        <button onClick={() => navigate("/")}>Back to home</button>
      </div>
    );
  }

  return (
    <div className="text-white text-center mt-20">
      <p>
        🎉 Payment confirmed! Your ticket confirmation has been sent to your
        email.
      </p>
      <button onClick={() => navigate("/")}>Back to home</button>
    </div>
  );
};

export default PaymentSuccessful;
