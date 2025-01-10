// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authenticate, renewToken, getResources } from '../services/authService';
export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("access"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("access", token);
    } else {
      localStorage.removeItem("access");
    }

    if (refreshToken) {
      localStorage.setItem("refresh", refreshToken);
    } else {
      localStorage.removeItem("refresh");
    }
  }, [token, refreshToken]);

  const login = async (userName, password) => {
    try {
      const [newToken, newRefreshToken] = await authenticate(userName, password);
      setToken(newToken);
      setRefreshToken(newRefreshToken);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location = `${window.location.origin}/login`;
  };

  return { token, refreshToken, login, logout };
}
