import { api } from './api';

export function loginRequest(credentials) {
  return api.post('/auth/login', credentials);
}

export function registerPatientRequest(payload) {
  return api.post('/auth/register', payload);
}

export function registerDoctorRequest(payload) {
  return api.post('/auth/register-doctor', payload);
}
