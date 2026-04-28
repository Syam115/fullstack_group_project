import formatDate from '../utils/formatDate';
import formatLabel from '../utils/formatLabel';

export default function AppointmentCard({ appointment, children }) {
  return (
    <article className="appointment-card">
      <div className="panel-header" style={{ marginBottom: 0 }}>
        <h3 style={{ marginBottom: 0 }}>
          {appointment.doctorId?.name || appointment.patientId?.name || 'Appointment'}
        </h3>
        <span className={`status-pill ${appointment.status === 'Confirmed' || appointment.status === 'Completed' ? 'success' : appointment.status === 'Cancelled' ? 'error' : ''}`}>
          {appointment.status}
        </span>
      </div>
      <div className="appointment-meta">
        <span>Date: {formatDate(appointment.date)}</span>
        <span>Time: {appointment.start_time}</span>
        {appointment.doctorId?.specialization ? <span>Doctor: {formatLabel(appointment.doctorId.specialization)}</span> : null}
        {appointment.patientId?.email ? <span>Patient: {appointment.patientId.email}</span> : null}
      </div>
      <p>Reason: {appointment.reason}</p>
      {children}
    </article>
  );
}
