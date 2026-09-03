import { useState } from "react";

const PersonalDetails = () => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    fullName: "",
    address: "",
    acceptedTerms: false,
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="rounded-3xl border border-neutral-800/80 bg-gradient-to-br from-neutral-900 to-neutral-950 p-5 shadow-2xl shadow-black/20 sm:p-8">
      <div className="mb-7">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Personal details
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Tell us a little about yourself.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="group">
          <label className="text-sm font-medium text-neutral-300">
            Phone Number<span className="text-lime-400">*</span>
          </label>
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleChange("phone")}
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3.5 text-sm text-white placeholder-neutral-600 shadow-inner shadow-black/20 transition duration-200 hover:border-neutral-700 focus:border-lime-400 focus:ring-4 focus:ring-lime-400/10"
          />
        </div>

        <div className="group">
          <label className="text-sm font-medium text-neutral-300">
            Email<span className="text-lime-400">*</span>
          </label>
          <input
            type="email"
            placeholder="Your Email Address"
            value={formData.email}
            onChange={handleChange("email")}
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3.5 text-sm text-white placeholder-neutral-600 shadow-inner shadow-black/20 transition duration-200 hover:border-neutral-700 focus:border-lime-400 focus:ring-4 focus:ring-lime-400/10"
          />
        </div>

        <div className="group">
          <label className="text-sm font-medium text-neutral-300">
            Full Name<span className="text-lime-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Your Full Name"
            value={formData.fullName}
            onChange={handleChange("fullName")}
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3.5 text-sm text-white placeholder-neutral-600 shadow-inner shadow-black/20 transition duration-200 hover:border-neutral-700 focus:border-lime-400 focus:ring-4 focus:ring-lime-400/10"
          />
        </div>

        <div className="group">
          <label className="text-sm font-medium text-neutral-300">
            Address
          </label>
          <input
            type="text"
            placeholder="Your Address"
            value={formData.address}
            onChange={handleChange("address")}
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3.5 text-sm text-white placeholder-neutral-600 shadow-inner shadow-black/20 transition duration-200 hover:border-neutral-700 focus:border-lime-400 focus:ring-4 focus:ring-lime-400/10"
          />
        </div>
      </div>
      <div className="mt-7 flex items-start gap-3 rounded-xl border border-neutral-800/70 bg-neutral-950/50 p-4">
        <input
          type="checkbox"
          id="acceptTerms"
          checked={formData.acceptedTerms}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              acceptedTerms: e.target.checked,
            }))
          }
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-700 bg-neutral-950 accent-lime-400 focus:ring-2 focus:ring-lime-400/30"
        />
        <label
          htmlFor="acceptTerms"
          className="cursor-pointer text-sm leading-5 text-neutral-400"
        >
          I accept the{" "}
          <a href="/terms" className="text-lime-400 hover:underline">
            Terms and Condition
          </a>
        </label>
      </div>

      {formData.acceptedTerms && (
        <button
          type="button"
          className="mt-5 w-full rounded-xl bg-lime-400 px-4 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-lime-300 focus:outline-none focus:ring-4 focus:ring-lime-400/30"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default PersonalDetails;
