import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile, remember: boolean) => void;
  logout: () => void;
  updateUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Set default axios header
          axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
      } catch (err) {
        console.error("Error reading authentication settings from storage:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  const login = (newToken: string, newUser: UserProfile, remember: boolean) => {
    try {
      if (remember) {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("user", JSON.stringify(newUser));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setToken(newToken);
      setUser(newUser);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (err) {
      console.error("Login session save error:", err);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common["Authorization"];
    } catch (err) {
      console.error("Logout session clean error:", err);
    }
  };

  const updateUser = (updatedUser: UserProfile) => {
    try {
      const isLocalStorage = !!localStorage.getItem("token");
      if (isLocalStorage) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setUser(updatedUser);
    } catch (err) {
      console.error("Update profile cache error:", err);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
