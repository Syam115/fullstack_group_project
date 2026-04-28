import formatDate from '../utils/formatDate';

export default function NotificationCard({ notification, onRead }) {
  const appointmentDate = notification.appointment_id?.date;

  return (
    <article className="appointment-card">
      <div className="panel-header" style={{ marginBottom: 0 }}>
        <h3 style={{ marginBottom: 0 }}>{notification.type || 'Notification'}</h3>
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
