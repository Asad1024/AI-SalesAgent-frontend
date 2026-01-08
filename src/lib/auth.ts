import { User } from '../types';

export interface AuthResponse {
  message: string;
  user?: Omit<User, 'passwordHash'>;
  token?: string;
}

export interface AuthError {
  message: string;
  errors?: string[];
}

class AuthService {
  // Production URL (commented for local testing)
  // private baseUrl = 'https://aisparksalesagent-backend.onrender.com/api/auth';
  
  // Local development URL (Backend running on port 8000)
  private baseUrl = 'http://localhost:8000/api/auth';

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
      throw new Error('failed');
    }

    if (data.token) {
      localStorage.setItem('auth-token', data.token);
    }

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Demo login for development/testing
    if (email === 'admin@example.com' && password === 'admin123') {
      const demoUser = {
        id: 'demo-user-1',
        email: 'admin@example.com',
        creditsBalance: 500,
        creditsUsed: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
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
      throw new Error('failed');
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
      throw new Error('failed');
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
      throw new Error('failed');
    }
  }

  // Throttle checkStatus calls to prevent 429 errors
  private lastStatusCheck = 0;
  private statusCheckCooldown = 10000; // 10 seconds cooldown between status checks

  async checkStatus(): Promise<{ authenticated: boolean; user?: Omit<User, 'passwordHash'> }> {
    const now = Date.now();
    
    // Throttle: if called too soon, return cached data
    if (now - this.lastStatusCheck < this.statusCheckCooldown) {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('auth-token');
      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          return { authenticated: true, user };
        } catch (e) {
          // Continue to fetch fresh data if cache is invalid
        }
      }
    }

    this.lastStatusCheck = now;

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

    // Always fetch fresh user data from API instead of using cached localStorage
    if (token) {
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${this.baseUrl}/status`, {
          headers,
          credentials: 'include',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle 429 (Too Many Requests) gracefully
        if (response.status === 429) {
          // Return cached user data if rate limited
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              return { authenticated: true, user };
            } catch (e) {
              // Continue
            }
          }
          return { authenticated: false };
        }

        if (!response.ok) {
          // Don't clear tokens on other errors, just return cached data
          const storedUser = localStorage.getItem('user');
          if (storedUser && response.status !== 401) {
            try {
              const user = JSON.parse(storedUser);
              return { authenticated: true, user };
            } catch (e) {
              // Continue
            }
          }
          if (response.status === 401) {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user');
          }
          return { authenticated: false };
        }

        const data = await response.json();
        
        // Always update localStorage with fresh data from API
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
      } catch (error) {
        // Fallback to cached user only if API fails
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            return { authenticated: true, user };
          } catch (e) {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user');
          }
        }
        
        return { authenticated: false };
      }
    }

    return { authenticated: false };
  }
}

export const authService = new AuthService(); 