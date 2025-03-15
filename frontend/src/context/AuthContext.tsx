'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  name: string;
  email: string;
  phone: string;
  address: string;
  passportNumber: string;
  avatar?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string, address: string, avatar?: string) => Promise<void>;
  logout: () => void;
  checkEmailExists: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    // Implement a real API call to check if the email exists
    try {
      const response = await fetch(`/api/auth/check-email?email=${email}`);
      const data = await response.json();
      return data.exists; // Adjust based on your API response structure
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

// src/app/auth/AuthContext.tsx (updated login function)
const login = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      setIsLoggedIn(true);
      setUser(data.user);
      window.localStorage.setItem('authToken', data.token); // Store token
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

  const signup = async (name: string, email: string, password: string, phone: string, address: string, avatar?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address, avatar }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setUser(data.user); // Adjust based on your API response structure
      } else {
        throw new Error(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error; // Rethrow error to be handled in the component
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, signup, logout, checkEmailExists }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};