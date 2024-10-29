// import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// export const registerUser = (userData) => API.post('/auth/register', userData);
// export const loginUser = (userData) => API.post('/auth/login', userData);
// export const uploadFile = (file) => API.post('/files/upload', file, {
//   headers: { 'Content-Type': 'multipart/form-data' }
// });
// export const getFiles = () => API.get('/files');

// services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const uploadFile = (file) =>
  API.post('/files/upload', file, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const getFiles = () => API.get('/files');

// views and statistics
export const incrementFileView = (fileId) => API.get(`/files/file/${fileId}/view`);
export const getFileStatistics = (fileId) => API.get(`/files/file/${fileId}/statistics`);
export const getAllFilesStatistics = () => API.get('/files/statistics');
