import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  fullName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clear: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token });
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    }
    set({ user: null, token: null });
  },
  hydrate: () => {
    if (typeof window === 'undefined') return;
    const storedToken = window.localStorage.getItem('token');
    const storedUser = window.localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        set({
          token: storedToken,
          user: JSON.parse(storedUser),
        });
      } catch (err) {
        console.error('Failed to parse stored user', err);
      }
    }
  },
}));
