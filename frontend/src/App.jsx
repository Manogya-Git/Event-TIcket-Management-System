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

const App = () => {
  return (
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

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
