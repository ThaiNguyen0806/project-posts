import { type AuthProvider } from "react-admin";

const API_URL = 'http://localhost:3000';

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const { token } = await response.json();
    localStorage.setItem('token', token);
  },

  logout: async () => {
    localStorage.removeItem('token');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
  },

  checkError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('token');
      throw new Error('Unauthorized');
    }
  },

  getIdentity: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to get identity');

    const { user } = await response.json();
    return {
      id: user.id,
      fullName: user.email,
    };
  },

  getPermissions: async () => null,
};

export default authProvider;