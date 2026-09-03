import React from "react";
import { MapPin, Mail, Phone,  } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (
    <>
      <footer className="bg-black text-white px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10">
          {/* Brand + App downloads */}
          <div className="flex flex-col gap-3 min-w-[220px]">
            <h2 className="text-2xl font-bold text-green-500">k garira?</h2>
            <p className="text-sm font-medium">Download Kgarira App</p>
            <div className="flex gap-2">
              <img
                src="/images/google-play-badge.png"
                alt="Get it on Google Play"
                className="h-9 w-auto rounded-md border border-zinc-700"
              />
              <img
                src="/images/app-store-badge.png"
                alt="Download on the App Store"
                className="h-9 w-auto rounded-md border border-zinc-700"
              />
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-2 min-w-[200px]">
            <h3 className="text-base font-semibold mb-1">Company</h3>
            <p className="text-sm text-gray-300">
              Registration No: 90220/068/069
            </p>
            <p className="text-sm text-gray-300">
              K. Garira Marketing &amp; Promotion Pvt. Ltd.
            </p>
            <p className="text-sm text-gray-300">Vat No: 600375913</p>
          </div>

          {/* Website links */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <h3 className="text-base font-semibold mb-1">Website</h3>
            <a
              href="/"
              className="text-sm text-gray-300 hover:text-green-500 transition-colors"
            >
              Home
            </a>
            <a
              href="/book-artist"
              className="text-sm text-gray-300 hover:text-green-500 transition-colors"
            >
              Book an Artist
            </a>
            <a
              href="/book-venue"
              className="text-sm text-gray-300 hover:text-green-500 transition-colors"
            >
              Book a Venue
            </a>
            <a
              href="/blogs"
              className="text-sm text-gray-300 hover:text-green-500 transition-colors"
            >
              Blogs
            </a>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-2 min-w-[200px]">
            <h3 className="text-base font-semibold mb-1">Contact Us</h3>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin size={15} className="text-green-500 shrink-0" />
              <span>Kupondole</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Mail size={15} className="text-green-500 shrink-0" />
              <span>tickets@kgarira.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Phone size={15} className="text-green-500 shrink-0" />
              <span>9705427472</span>
            </div>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-green-500 hover:text-white transition-colors"
          >
            <FaFacebook size={16} />
          </a>
          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-green-500 hover:text-white transition-colors"
          >
            <FaInstagram size={16} />
          </a>
          {/* TikTok - lucide has no built-in icon, using inline SVG */}
          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-green-500 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width={16}
              height={16}
            >
              <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </a>
        </div>

        {/* Divider */}
        <hr className="border-zinc-700 my-6 max-w-7xl mx-auto" />

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3 text-xs text-gray-400">
          <p>
            © Kgarira.com | Powered by{" "}
            <span className="text-white font-medium">Pagoda Labs</span>
          </p>
          <div className="flex gap-4">
            <a href="/terms" className="hover:text-green-500 transition-colors">
              Terms &amp; Condition
            </a>
            <a
              href="/privacy"
              className="hover:text-green-500 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/cookies"
              className="hover:text-green-500 transition-colors"
            >
              Cookie Policy
            </a>
            <a
              href="/refund"
              className="hover:text-green-500 transition-colors"
            >
              Refund Policy
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
