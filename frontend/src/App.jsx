import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookVenue from "./pages/BookVenue";
import BookArtist from "./pages/BookArtist";
import Contact from "./pages/Contact";
import MainLayout from "./components/MainLayout";
import BuyTickets from "./pages/BuyTickets";
import CheckoutLayout from "./components/CheckoutLayout";
import PersonalDetails from "./pages/PersonalDetail";
import TermsAnd from "./pages/TermsAnd";
import Payment from "./pages/Payment";
import PaymentSuccessful from "./pages/PaymentSuccessful";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/book-venue" element={<BookVenue />} />
            <Route path="/book-artist" element={<BookArtist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<TermsAnd />} />

            <Route path="/buy-tickets/:slug" element={<CheckoutLayout />}>
              <Route index element={<BuyTickets />} />
              <Route path="details" element={<PersonalDetails />} />
              <Route path="payment" element={<Payment />} />
            </Route>
            <Route path="payment/success/" element={<PaymentSuccessful />} />
          </Route>
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
