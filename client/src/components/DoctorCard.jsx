import { Link } from 'react-router-dom';
export default function DoctorCard({ doc }) {
  return (
    <div className="glass" style={{padding:'2rem', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
      <div>
        <h3 style={{fontSize: '1.25rem', marginBottom: '0.25rem'}}>{doc.name}</h3>
        <p style={{color:'var(--primary-color)', fontWeight: '600'}}>{doc.specialization}</p>
        <p style={{color:'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0'}}>{doc.experience} Years Experience • {doc.hospital}</p>
      </div>
      <Link to={`/doctors/${doc._id}`} className="btn btn-secondary" style={{marginTop:'1.5rem', textAlign: 'center'}}>View Profile</Link>
    </div>
  );
}
