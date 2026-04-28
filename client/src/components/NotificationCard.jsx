import formatDate from '../utils/formatDate';

const typeToneMap = {
  Booking: 'success',
  Reminder: 'success',
  'Status Update': '',
  Reschedule: '',
  Cancellation: 'error',
  Prescription: 'success',
  'Doctor Approval': '',
  'Account Update': '',
  'Hospital Update': '',
  'System Summary': '',
};

export default function NotificationCard({ notification, onRead, roleLabel }) {
  const appointmentDate = notification.appointment_id?.date;
  const tone = typeToneMap[notification.type] || '';

  return (
    <article className="appointment-card">
      <div className="panel-header" style={{ marginBottom: 0 }}>
        <div>
          <span className={`status-pill ${tone}`} style={{ marginBottom: '0.75rem' }}>
            {notification.type || 'Notification'}
          </span>
          <h3 style={{ marginBottom: 0 }}>{roleLabel}</h3>
        </div>
        <span className={`status-pill ${notification.status === 'Read' ? '' : 'success'}`}>
          {notification.status}
        </span>
      </div>
      <p>{notification.message}</p>
      <div className="appointment-meta">
        <span>Sent: {formatDate(notification.createdAt || notification.sent_at)}</span>
        {appointmentDate ? <span>Appointment: {formatDate(appointmentDate)}</span> : null}
      </div>
      {notification.status !== 'Read' ? (
        <button type="button" className="btn btn-secondary" onClick={() => onRead(notification._id)}>
          Mark Read
        </button>
      ) : null}
    </article>
  );
}
