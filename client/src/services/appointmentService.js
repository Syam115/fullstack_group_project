import { api, authHeaders } from './api';

export function bookAppointment(payload, token) {
  return api.post('/appointments', payload, {
    headers: authHeaders(token),
  });
}

export function getPatientHistory(token) {
  return api.get('/appointments/history', {
    headers: authHeaders(token),
  });
}

export function getDoctorAppointments(token) {
  return api.get('/appointments/doctor', {
    headers: authHeaders(token),
  });
}

export function rescheduleAppointment(id, payload, token) {
  return api.put(`/appointments/${id}/reschedule`, payload, {
    headers: authHeaders(token),
  });
}

export function cancelAppointment(id, token) {
  return api.put(`/appointments/${id}/cancel`, {}, {
    headers: authHeaders(token),
  });
}

export function updateAppointmentStatus(id, payload, token) {
  return api.put(`/appointments/${id}/status`, payload, {
    headers: authHeaders(token),
  });
}
