import axios from 'axios';

// In production uses VITE_API_URL env var, in dev uses Vite proxy (/api → localhost:5000)
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('tickethub-auth');
  if (stored) {
    const { state } = JSON.parse(stored);
    if (state?.accessToken) {
      config.headers.Authorization = `Bearer ${state.accessToken}`;
    }
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const stored = localStorage.getItem('tickethub-auth');
        if (stored) {
          const { state } = JSON.parse(stored);
          if (state?.refreshToken) {
            const { data } = await axios.post(`${baseURL}/auth/refresh`, {
              refreshToken: state.refreshToken,
            });
            const parsed = JSON.parse(stored);
            parsed.state.accessToken = data.accessToken;
            parsed.state.refreshToken = data.refreshToken;
            localStorage.setItem('tickethub-auth', JSON.stringify(parsed));
            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(original);
          }
        }
      } catch {
        localStorage.removeItem('tickethub-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
