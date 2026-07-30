import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getPublic: (params) => api.get('/products/public', { params }),
  getPublicBySlug: (slug) => api.get(`/products/public/${slug}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  toggleStatus: (id) => api.patch(`/products/${id}/toggle-status`),

  uploadImages: (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteImage: (productId, imageId) =>
    api.delete(`/products/${productId}/images/${imageId}`),

  setMainImage: (productId, imageId) =>
    api.patch(`/products/${productId}/images/${imageId}/main`),

  uploadSheet: (id, file) => {
    const formData = new FormData();
    formData.append('sheet', file);
    return api.post(`/products/${id}/sheet`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
