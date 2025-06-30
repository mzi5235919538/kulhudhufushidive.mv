'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple demo authentication - replace with real authentication
    if (username === 'admin' && password === 'admin123') {
      const authData = {
        isAuthenticated: true,
        timestamp: Date.now(),
        username: username,
        sessionId: generateSessionId()
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('admin_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  const checkAuth = (): boolean => {
    try {
      const authData = localStorage.getItem('admin_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        const now = Date.now();
        const sessionAge = now - parsed.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        // Check if session is still valid
        if (parsed.isAuthenticated && sessionAge < maxAge) {
          setIsAuthenticated(true);
          return true;
        } else {
          // Session expired, clean up
          localStorage.removeItem('admin_auth');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('admin_auth');
    }
    
    setIsAuthenticated(false);
    return false;
  };

  const generateSessionId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
