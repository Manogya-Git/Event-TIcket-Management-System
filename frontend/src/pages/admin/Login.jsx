import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}
        <button type="submit">Log in</button>
      </form>
    </main>
  );
};

export default Login;
