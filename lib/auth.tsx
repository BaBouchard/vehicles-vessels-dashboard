'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('vehicles-vessels-auth');
    if (savedAuth) {
      const { username: savedUsername, timestamp } = JSON.parse(savedAuth);
      // Check if session is still valid (24 hours)
      const now = Date.now();
      const sessionAge = now - timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge < maxAge) {
        setIsAuthenticated(true);
        setUsername(savedUsername);
      } else {
        localStorage.removeItem('vehicles-vessels-auth');
      }
    }
  }, []);

  const login = (inputUsername: string, inputPassword: string): boolean => {
    // Check credentials
    if (inputUsername === 'Blake' && inputPassword === 'myerlemon') {
      setIsAuthenticated(true);
      setUsername(inputUsername);
      
      // Save session to localStorage
      const sessionData = {
        username: inputUsername,
        timestamp: Date.now()
      };
      localStorage.setItem('vehicles-vessels-auth', JSON.stringify(sessionData));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem('vehicles-vessels-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
