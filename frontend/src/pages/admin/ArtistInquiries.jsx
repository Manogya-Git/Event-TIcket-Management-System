import React from "react";
import Inquiries from "./Inquiries";

const ArtistInquiries = () => (
  <Inquiries
    inquiryType="Artist"
    endpoint="/booking/artist-inquiries/"
    title="Artist Inquiries"
  />
);

export default ArtistInquiries;
