import { User } from '../types';

export interface AuthResponse {
  message: string;
  user?: Omit<User, 'passwordHash'>;
}

export interface AuthError {
  message: string;
  errors?: string[];
}

class AuthService {
  private baseUrl = 'https://aisparksalesagent-backend.onrender.com/api/auth';
// private baseUrl = 'http://localhost:8000/api/auth';

  async register(email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Demo login for development/testing
    if (email === 'admin@example.com' && password === 'admin123') {
      const demoUser = {
        id: 'demo-user-1',
        email: 'admin@example.com',
        name: 'Demo User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store demo user in localStorage for demo purposes
      localStorage.setItem('demo-user', JSON.stringify(demoUser));
      
      return {
        message: 'Demo login successful',
        user: demoUser,
      };
    }

    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  }

  async logout(): Promise<void> {
    // Clear demo user if exists
    localStorage.removeItem('demo-user');
    
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }

  async getProfile(): Promise<Omit<User, 'passwordHash'> | null> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      credentials: 'include',
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    return data.user;
  }

  async updateProfile(email: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Profile update failed');
    }

    return data;
  }

  async changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password change failed');
    }
  }

  async checkStatus(): Promise<{ authenticated: boolean; user?: Omit<User, 'passwordHash'> }> {
    // Check for demo user first
    const demoUser = localStorage.getItem('demo-user');
    if (demoUser) {
      try {
        const user = JSON.parse(demoUser);
        return { authenticated: true, user };
      } catch (error) {
        localStorage.removeItem('demo-user');
      }
    }

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${this.baseUrl}/status`, {
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return { authenticated: false };
      }

      return await response.json();
    } catch (error) {
      // If network request fails (backend not available), return unauthenticated
      // This prevents the app from crashing when backend is not available
      console.warn('Backend not available, running in demo mode');
      return { authenticated: false };
    }
  }
}

export const authService = new AuthService(); 