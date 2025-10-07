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

  async login(email: string, password: string): Promise<AuthResponse & { token?: string }> {
    // Demo login for development/testing
    if (email === 'admin@example.com' && password === 'admin123') {
      const demoUser = {
        id: 'demo-user-1',
        email: 'admin@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Store demo user in localStorage for demo purposes
      localStorage.setItem('demo-user', JSON.stringify(demoUser));
      
      return {
        message: 'Demo login successful',
        user: demoUser as any,
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

    if (data.token) {
      localStorage.setItem('auth-token', data.token);
    }

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('demo-user');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

    } catch (error) {
      console.warn('Logout API call failed, but local data cleared');
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

    const token = localStorage.getItem('auth-token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return { authenticated: true, user };
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
      }
    }

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/status`, {
        headers,
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
        return { authenticated: false };
      }

      const data = await response.json();
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      if (token && storedUser) {
        console.warn('Backend not available, using cached auth data');
        try {
          const user = JSON.parse(storedUser);
          return { authenticated: true, user };
        } catch (e) {
          // Ignore parse error
        }
      }
      
      console.warn('Backend not available and no cached auth');
      return { authenticated: false };
    }
  }
}

export const authService = new AuthService(); 