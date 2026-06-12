import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const graduateAPI = {
  getAll: (params) => api.get('/graduates', { params }),
  getById: (id) => api.get(`/graduates/${id}`),
  getMyProfile: () => api.get('/graduates/me'),
  updateMyProfile: (data) => api.put('/graduates/me', data),
  submitForApproval: () => api.post('/graduates/submit'),
  like: (id) => api.post(`/graduates/${id}/like`),
  getRecent: () => api.get('/graduates/recent'),
  getFeatured: () => api.get('/graduates/featured'),
  getStatistics: () => api.get('/graduates/statistics'),
};

export const adminAPI = {
  getPending: () => api.get('/admin/pending'),
  getAllGraduates: (params) => api.get('/admin/graduates', { params }),
  getUsers: () => api.get('/admin/users'),
  getStats: () => api.get('/admin/stats'),
  approve: (id) => api.put(`/admin/approve/${id}`),
  reject: (id, reason) => api.put(`/admin/reject/${id}`, { reason }),
  toggleFeatured: (id) => api.put(`/admin/featured/${id}`),
  deleteGraduate: (id) => api.delete(`/admin/graduates/${id}`),
};

export const uploadAPI = {
  profilePhoto: (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
  },
  coverPhoto: (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
  },
  gallery: (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
  },
};

export const commentAPI = {
  getByGraduate: (graduateId) => api.get(`/comments/graduate/${graduateId}`),
  add: (graduateId, text) => api.post(`/comments/graduate/${graduateId}`, { text }),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const memoryAPI = {
  getAll: (params) => api.get('/memories', { params }),
  add: (message) => api.post('/memories', { message }),
  edit: (id, message) => api.put(`/memories/${id}`, { message }),
  like: (id) => api.post(`/memories/${id}/like`),
};

export const batchPhotoAPI = {
  getAll: (params) => api.get('/batch-photos', { params }),
  getYears: () => api.get('/batch-photos/years'),
  upload: (file, data, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('graduationYear', data.graduationYear);
    if (data.caption) formData.append('caption', data.caption);
    if (data.category) formData.append('category', data.category);
    return api.post('/batch-photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
  },
  update: (id, data) => api.put(`/batch-photos/${id}`, data),
  delete: (id) => api.delete(`/batch-photos/${id}`),
};
