import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          toast.success(`Добро пожаловать, ${data.user.name}!`);
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.error || 'Ошибка входа';
          toast.error(msg);
          return { success: false, error: msg };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', { email, password, name });
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          toast.success('Аккаунт создан!');
          return { success: true };
        } catch (err) {
          const respData = err.response?.data;
          // Show first validation detail if available, otherwise generic error
          const msg = respData?.details?.[0]?.message || respData?.error || 'Ошибка регистрации';
          toast.error(msg);
          return { success: false, error: msg };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Ignore errors (e.g. expired token) — still clear local state
        }
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        toast.success('Вы вышли из системы');
      },

      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),

      initAuth: () => {
        const { accessToken } = get();
        if (accessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
      },
    }),
    {
      name: 'tickethub-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
