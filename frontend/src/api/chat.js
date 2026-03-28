import api from './client';

export const askQuestion = (noteId, question) =>
  api.post(`/chat/${noteId}/ask`, { question });
export const getChatHistory = (noteId) => api.get(`/chat/${noteId}/history`);
export const generateQuiz = (noteId, data) =>
  api.post(`/quiz/${noteId}/generate`, data);
export const getQuizHistory = (noteId) => api.get(`/quiz/${noteId}/history`);
