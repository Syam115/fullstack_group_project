import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
});

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default API_URL;
