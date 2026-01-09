import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../lib/auth';
import { User } from '../types';

interface AuthContextType {
  user: Omit<User, 'passwordHash'> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmNewPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage immediately on mount for instant UI update
    const restoreUserFromStorage = () => {
      try {
        const storedToken = localStorage.getItem('auth-token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setUser(user);
            setLoading(false);
          } catch (e) {
            // Invalid stored user, clear it
            localStorage.removeItem('user');
            localStorage.removeItem('auth-token');
          }
        } else {
          // Check for demo user
          const demoUser = localStorage.getItem('demo-user');
          if (demoUser) {
            try {
              const user = JSON.parse(demoUser);
              setUser(user);
              setLoading(false);
              return;
            } catch (e) {
              localStorage.removeItem('demo-user');
            }
          }
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    // Restore immediately
    restoreUserFromStorage();
    
    // Then validate with backend in the background
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const status = await authService.checkStatus();
      if (status.authenticated && status.user) {
        // Update with fresh data from API
        setUser(status.user);
      } else {
        // Only clear user if API confirms not authenticated (not on network errors)
        setUser(null);
      }
    } catch (error) {
      console.warn('Auth check failed:', error);
      // Don't clear user on network errors - keep the cached user
      // Only clear if localStorage is also empty
      const storedToken = localStorage.getItem('auth-token');
      const storedUser = localStorage.getItem('user');
      if (!storedToken || !storedUser) {
        setUser(null);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      // Use creditsBalance from API only, no hardcoded defaults
      setUser(response.user || null);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    try {
      const response = await authService.register(email, password, confirmPassword);
      // Use creditsBalance from API only, no hardcoded defaults
      setUser(response.user || null);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if logout fails
      setUser(null);
    }
  };

  const updateProfile = async (email: string) => {
    try {
      const response = await authService.updateProfile(email);
      setUser(response.user || null);
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmNewPassword: string) => {
    try {
      await authService.changePassword(currentPassword, newPassword, confirmNewPassword);
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const status = await authService.checkStatus();
      if (status.authenticated && status.user) {
        setUser(status.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 