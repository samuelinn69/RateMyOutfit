import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach token from localStorage on each request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          { refreshToken }
        );

        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;

        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Typed helpers
export const authApi = {
  register: (data: { email: string; username: string; password: string; displayName?: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/api/auth/login', data),
  logout: (refreshToken: string) => api.post('/api/auth/logout', { refreshToken }),
  refresh: (refreshToken: string) => api.post('/api/auth/refresh', { refreshToken }),
};

export const outfitsApi = {
  upload: (formData: FormData) =>
    api.post('/api/outfits', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  get: (id: string) => api.get(`/api/outfits/${id}`),
  delete: (id: string) => api.delete(`/api/outfits/${id}`),
  like: (id: string) => api.post(`/api/outfits/${id}/like`),
  getUserOutfits: (username: string, params?: { page?: number; limit?: number }) =>
    api.get(`/api/outfits/user/${username}`, { params }),
};

export const feedApi = {
  getFeed: (params?: { page?: number; limit?: number; sort?: string }) =>
    api.get('/api/feed', { params }),
  getTrending: (limit?: number) => api.get('/api/feed/trending', { params: { limit } }),
  getLeaderboard: () => api.get('/api/feed/leaderboard'),
};

export const usersApi = {
  getMe: () => api.get('/api/users/me'),
  getProfile: (username: string) => api.get(`/api/users/${username}`),
  updateProfile: (data: { displayName?: string; bio?: string }) => api.put('/api/users/me', data),
};
