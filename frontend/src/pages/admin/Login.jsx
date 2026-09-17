import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userName.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setError("");
    try {
      await login(userName, password);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9e9e8] p-4 sm:p-8">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#d7d7d6] bg-[#f3f3f2] shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
        <div className="relative hidden w-[42%] min-h-[620px] overflow-hidden bg-[#1f242a] p-6 md:flex md:flex-col">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#8cc7f9]/10 to-transparent" />
          <div className="absolute -left-14 top-10 h-40 w-40 rounded-full bg-[#8ec5ff]/10 blur-3xl" />
          <div className="absolute right-0 top-24 h-28 w-28 rounded-full bg-[#f7d7ac]/10 blur-3xl" />

          <div className="relative mt-10 flex flex-1 items-center justify-center">
            <div className="flex w-[80%] flex-col items-center justify-center rounded-[26px] border border-white/10 bg-[#f7f7f4] p-8 shadow-[0_22px_45px_rgba(0,0,0,0.25)]">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#0f172a] p-4 shadow-inner shadow-white/10">
                <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-gradient-to-br from-[#f8fafc] via-[#dbeafe] to-[#bfdbfe] text-3xl font-bold text-[#0f172a]">
                  A
                </div>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-slate-500">
                  ADMIN PANEL
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#111827]">
                  Kgarira
                </h2>
              </div>

              <div className="mt-8 w-full rounded-2xl bg-[#edf2f7] p-4">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  <span>Security</span>
                  <span className="rounded-full bg-white px-2 py-1 text-[9px] text-slate-700">
                    Online
                  </span>
                </div>
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#dfe7f3]">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#7dd3fc] via-[#60a5fa] to-[#2563eb]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-[#f1f1ef] p-8 sm:p-12 md:w-[58%]">
          <div className="w-full max-w-md">
            <h1 className="mb-8 text-center text-4xl font-semibold tracking-tight text-[#111827]">
              Login
            </h1>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-[#1f2937]"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  autoComplete="username"
                  placeholder="Username"
                  className="w-full rounded-xl border border-[#c9d2df] bg-[#eef2f7] px-4 py-3 text-sm text-[#111827] placeholder:text-[#7e8794] focus:border-[#6aa3e8] focus:outline-none focus:ring-2 focus:ring-[#b8d8ff]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#1f2937]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Password"
                    className="w-full rounded-xl border border-[#c9d2df] bg-[#eef2f7] px-4 py-3 pr-11 text-sm text-[#111827] placeholder:text-[#7e8794] focus:border-[#6aa3e8] focus:outline-none focus:ring-2 focus:ring-[#b8d8ff]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-[#64748b] hover:text-[#1e293b]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-[#2f6fe6] px-4 py-3 text-base font-semibold text-white shadow-[0_12px_26px_rgba(47,111,230,0.28)] transition hover:bg-[#225edb] focus:outline-none focus:ring-2 focus:ring-[#90b6ff]"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
