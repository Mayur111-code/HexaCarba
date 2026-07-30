import axios from 'axios';
import { API_BASE_URL } from '../constants';

console.log('[API] Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hexacarb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('[API] Network error — no response from server:', error.message);
      return Promise.reject(error);
    }

    console.error(`[API] Error ${error.response.status} on ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response.data);

    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('hexacarb_refresh');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        localStorage.setItem('hexacarb_token', data.data.accessToken);
        localStorage.setItem('hexacarb_refresh', data.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.error('[API] Token refresh failed:', refreshErr.response?.data || refreshErr.message);
        localStorage.removeItem('hexacarb_token');
        localStorage.removeItem('hexacarb_refresh');
        localStorage.removeItem('hexacarb_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
