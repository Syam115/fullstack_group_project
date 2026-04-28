import { api, authHeaders } from './api';

export function getNotifications(token) {
  return api.get('/notifications', {
    headers: authHeaders(token),
  });
}

export function markNotificationRead(id, token) {
  return api.put(`/notifications/${id}/read`, {}, {
    headers: authHeaders(token),
  });
}

export function processReminders(token) {
  return api.post('/notifications/process-reminders', {}, {
    headers: authHeaders(token),
  });
}
