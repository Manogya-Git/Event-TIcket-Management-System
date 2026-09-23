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
import Events from "./pages/admin/Events";
import Bookings from "./pages/admin/Bookings";
import Venue from "./pages/admin/Venue";
import Artists from "./pages/admin/Artists";
import Categories from "./pages/admin/Categories";
import AdminLayout from "./components/AdminLayout";
import EventForm from "./components/EventForm";
import VenueForm from "./pages/admin/VenueForm";
import ArtistForm from "./pages/admin/ArtistForm";
import ManageTickets from "./pages/admin/ManageTickets";
import EventsPage from "./pages/EventsPage";
import ArtistsPage from "./pages/ArtistsPage";
import VenuesPage from "./pages/VenuesPage";
import IndividualArtist from "./pages/IndividualArtist";
import IndividualVenue from "./pages/IndividualVenue";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artists/:slug" element={<IndividualArtist />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/venues/:slug" element={<IndividualVenue />} />
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
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/events" element={<Events />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/venue" element={<Venue />} />
              <Route path="/admin/venue/new" element={<VenueForm />} />
              <Route path="/admin/venue/:slug/edit" element={<VenueForm />} />
              <Route path="/admin/artists" element={<Artists />} />
              <Route path="/admin/artists/new" element={<ArtistForm />} />
              <Route
                path="/admin/artists/:slug/edit"
                element={<ArtistForm />}
              />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/events/new" element={<EventForm />} />
              <Route path="/admin/events/:slug/edit" element={<EventForm />} />
              <Route
                path="/admin/events/:slug/tickets"
                element={<ManageTickets />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
