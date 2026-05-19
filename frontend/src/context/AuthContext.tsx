"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  phone?: string;
  city?: string;
  address?: string;
  bloodGroup?: string;
  gender?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  website?: string;
  isAvailable?: boolean;
  lastDonationDate?: string;
  isVerified?: boolean;
  inventory?: any;
}

import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (formData: any) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
  updateUserContext: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user info:", error);
        localStorage.removeItem("userInfo");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    return userData;
  };

  const register = async (formData: any) => {
    const res = await api.post("/auth/register", formData);
    const userData = res.data;
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  const updateUserContext = (userData: User) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
