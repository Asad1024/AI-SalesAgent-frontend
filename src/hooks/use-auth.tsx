import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../lib/auth';
import { User } from '../types';

interface AuthContextType {
  user: Omit<User, 'passwordHash'> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  googleLogin: (googleData: { idToken?: string; email: string; name?: string; picture?: string; googleId: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmNewPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateCreditsBalance: (newBalance: number) => void;
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
    checkAuthStatus();
  }, []);

  // Set up periodic refresh of user data to update minutes balance
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshUser();
    }, 15000); // Refresh every 15 seconds to keep balance updated
    
    return () => clearInterval(refreshInterval);
  }, []);

  const checkAuthStatus = async () => {
    // First, check localStorage synchronously to set user immediately
    // This prevents redirect loops after Google login
    const token = localStorage.getItem('auth-token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Convert date strings back to Date objects if needed
        if (user.createdAt && typeof user.createdAt === 'string') {
          user.createdAt = new Date(user.createdAt);
        }
        if (user.updatedAt && typeof user.updatedAt === 'string') {
          user.updatedAt = new Date(user.updatedAt);
        }
        // Set user immediately from localStorage
        setUser(user);
        setLoading(false); // Set loading to false early so routes can render
      } catch (parseError) {
        // If parsing fails, continue to API check
        setLoading(false);
      }
    } else {
      // No cached data, set loading to false so routes can render
      setLoading(false);
    }
    
    // Then verify with API in the background (don't block rendering)
    try {
      const status = await authService.checkStatus();
      if (status.authenticated && status.user) {
        // Update user with fresh data from API
        setUser(status.user);
      } else if (!token || !storedUser) {
        // Only set to null if we don't have cached data
        setUser(null);
      }
      // If we have cached data but API says not authenticated, keep cached user
      // (token might be expired but we'll let the user try to use the app)
    } catch (error) {
      // If API fails but we have cached data, keep the cached user
      if (!token || !storedUser) {
        console.warn('Auth check failed, running in demo mode:', error);
        setUser(null);
      }
      // If we have cached data, don't clear it on API error
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

  const register = async (email: string, password: string, confirmPassword: string, companyName?: string, firstName?: string, lastName?: string, googleId?: string) => {
    try {
      const response = await authService.register(email, password, confirmPassword, companyName, firstName, lastName, googleId);
      // Use creditsBalance from API only, no hardcoded defaults
      setUser(response.user || null);
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (googleData: { idToken?: string; email: string; name?: string; picture?: string; googleId: string }) => {
    try {
      const response = await authService.googleLogin(googleData);
      // Set user directly from response (googleLogin already saved to localStorage)
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
      // Use getProfile to get fresh user data directly from database
      // This bypasses all caching and throttling
      const freshUser = await authService.getProfile();
      if (freshUser) {
        // Update both React state and localStorage with fresh data
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } else {
        // Fallback to checkStatus if getProfile fails
        const status = await authService.checkStatus(true);
        if (status.authenticated && status.user) {
          setUser(status.user);
          localStorage.setItem('user', JSON.stringify(status.user));
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Fallback to checkStatus on error
      try {
        const status = await authService.checkStatus(true);
        if (status.authenticated && status.user) {
          setUser(status.user);
          localStorage.setItem('user', JSON.stringify(status.user));
        }
      } catch (fallbackError) {
        console.error('Fallback refresh also failed:', fallbackError);
      }
    }
  };

  const updateCreditsBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, creditsBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    updateCreditsBalance,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 