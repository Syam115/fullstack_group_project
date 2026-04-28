import formatDate from '../utils/formatDate';
import formatLabel from '../utils/formatLabel';

export default function PrescriptionCard({ prescription }) {
  return (
    <article className="appointment-card">
      <div className="panel-header" style={{ marginBottom: 0 }}>
        <h3 style={{ marginBottom: 0 }}>{prescription.doctorId?.name || 'Consultation Record'}</h3>
        <span className="status-pill success">Prescription</span>
      </div>
      <div className="appointment-meta">
        <span>Specialization: {formatLabel(prescription.doctorId?.specialization) || 'N/A'}</span>
        <span>Follow Up: {prescription.followUpDate ? formatDate(prescription.followUpDate) : 'Not specified'}</span>
      </div>
      <p><strong>Doctor Notes:</strong> {prescription.doctorNotes}</p>
      <p><strong>Prescription:</strong> {prescription.prescription}</p>
    </article>
  );
}
