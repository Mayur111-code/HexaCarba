import api from './api';

export const categoryService = {
  getAll: (params) => api.get('/categories', { params }),
  getPublic: () => api.get('/categories/public'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};
