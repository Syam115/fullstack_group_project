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
// This service file defines functions for interacting with the appointment-related endpoints of the backend API.
// Each function corresponds to a specific action, such as booking an appointment, fetching patient history, 
// rescheduling, canceling, or updating the status of an appointment. The functions use the Axios instance 
// defined in `api.js` and include authentication headers when a token is provided. This abstraction allows 
// the rest of the application to easily perform these operations without worrying about the underlying API details.