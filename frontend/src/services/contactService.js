import api from './api';

export const contactService = {
  submit: (data) => api.post('/contacts', data),
  getAll: (params) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  markAsRead: (id) => api.patch(`/contacts/${id}/read`),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
};
