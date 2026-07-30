import api from './api';

export const salaryService = {
  getAll: (params) => api.get('/salaries', { params }),
  getById: (id) => api.get(`/salaries/${id}`),
  getByEmployee: (employeeId, params) => api.get(`/salaries/employee/${employeeId}`, { params }),
  create: (data) => api.post('/salaries', data),
  update: (id, data) => api.put(`/salaries/${id}`, data),
  delete: (id) => api.delete(`/salaries/${id}`),
  downloadPDF: (id) => api.get(`/salaries/${id}/pdf`, { responseType: 'blob' }),
};
