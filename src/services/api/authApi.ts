import { apiClient } from './client';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('landsafe_token', data.token);
    }
    return data;
  },

  register: async (name: string, email: string, password: string, role = 'USER'): Promise<AuthResponse> => {
    const data = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    if (data.token) {
      localStorage.setItem('landsafe_token', data.token);
    }
    return data;
  },

  getMe: async (): Promise<AuthUser> => {
    return apiClient<AuthUser>('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('landsafe_token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('landsafe_token');
  },
};
