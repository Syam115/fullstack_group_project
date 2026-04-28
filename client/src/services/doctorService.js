import { api, authHeaders } from './api';

export function getDoctors(params) {
  return api.get('/doctors', { params });
}

export function getDoctorById(id) {
  return api.get(`/doctors/${id}`);
}

export function updateDoctorAvailability(payload, token) {
  return api.put('/doctors/availability', payload, {
    headers: authHeaders(token),
  });
}
