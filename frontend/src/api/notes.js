import api from './client';

export const getNotes = () => api.get('/notes');
export const getNote = (id) => api.get(`/notes/${id}`);
export const uploadNote = (formData) =>
  api.post('/notes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteNote = (id) => api.delete(`/notes/${id}`);
