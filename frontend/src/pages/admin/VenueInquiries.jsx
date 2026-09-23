import React from "react";
import Inquiries from "./Inquiries";

const VenueInquiries = () => (
  <Inquiries
    inquiryType="Venue"
    endpoint="/booking/venue-inquiries/"
    title="Venue Inquiries"
  />
);

export default VenueInquiries;
