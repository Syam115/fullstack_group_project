import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
});

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default API_URL;
// This file sets up an Axios instance for making API requests to the backend. 
// It uses a base URL defined in environment variables, allowing for easy configuration across 
// different environments (development, staging, production). The `authHeaders` function generates 
// the necessary headers for authenticated requests when a token is provided.