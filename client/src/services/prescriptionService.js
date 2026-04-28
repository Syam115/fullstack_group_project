import { api, authHeaders } from './api';

export function savePrescription(payload, token) {
  return api.post('/prescriptions', payload, {
    headers: {
      ...authHeaders(token),
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function getMyPrescriptions(token) {
  return api.get('/prescriptions/mine', {
    headers: authHeaders(token),
  });
}

export function getAppointmentPrescription(appointmentId, token) {
  return api.get(`/prescriptions/appointment/${appointmentId}`, {
    headers: authHeaders(token),
  });
}
