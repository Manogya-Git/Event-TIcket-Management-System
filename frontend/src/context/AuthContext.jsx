import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { BASE_URL } from "../api";

const AuthContext = createContext();
function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken"),
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken"),
  );
  const isAuthenticated = accessToken ? true : false;

  async function login(username, password) {
    const response = await axios.post(`${BASE_URL}/api/token/`, {
      username: username,
      password: password,
    });
    const { access, refresh } = response.data;
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}
function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext, AuthProvider, useAuth };
