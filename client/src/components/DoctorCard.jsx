import { Link } from 'react-router-dom';

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function DoctorCard({ doc }) {
  return (
    <article className="doctor-card glass">
      <div className="doctor-card-top">
        <div className="doctor-monogram">{getInitials(doc.name)}</div>
        <span className="doctor-tag">{doc.specialization}</span>
      </div>

      <div>
        <h3>{doc.name}</h3>
        <p>
          View doctor details, hospital information, and available booking options.
        </p>
      </div>

      <div className="doctor-meta">
        <span>{doc.experience} years of experience</span>
        <span>{doc.hospital}</span>
        <span>Consultation from ${doc.fee}</span>
      </div>

      <Link to={`/doctors/${doc._id}`} className="btn btn-secondary" style={{ width: '100%' }}>
        View Profile
      </Link>
    </article>
  );
}
