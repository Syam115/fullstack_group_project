import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
export default function DoctorDetails() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  
  useEffect(() => {
    axios.get((import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api')+`/doctors/${id}`)
      .then(res => setDoc(res.data)).catch(console.error);
  }, [id]);
  
  if(!doc) return <div style={{padding:'3rem 5%', textAlign:'center'}}>Loading...</div>;
  
  return (
    <div style={{padding: '3rem 5%', display: 'flex', justifyContent: 'center'}} className="animate-fade-in">
      <div className="glass" style={{padding:'3rem', width:'100%', maxWidth:'600px'}}>
        <h2 style={{fontSize: '2rem', marginBottom: '0.25rem'}}>{doc.name}</h2>
        <h4 style={{color:'var(--primary-color)', fontSize: '1.25rem'}}>{doc.specialization}</h4>
        
        <div style={{margin: '2rem 0', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
          <p><strong>Hospital:</strong> {doc.hospital}</p>
          <p><strong>Experience:</strong> {doc.experience} Years</p>
          <p><strong>Consultation Fee:</strong> ${doc.fee}</p>
        </div>
        
        <h4>Available Slots</h4>
        <div style={{display:'flex', gap:'1rem', marginTop:'1rem', flexWrap:'wrap'}}>
          {doc.availableSlots?.map(slot => (
            <span key={slot} style={{padding:'0.5rem 1rem', background:'var(--surface-dark)', borderRadius:'8px', border:'1px solid var(--primary-color)'}}>
              {slot}
            </span>
          ))}
        </div>
        
        <Link to="/book" state={{doc}} className="btn btn-primary" style={{marginTop:'2rem', display:'block', textAlign:'center', width:'100%'}}>
          Proceed to Booking
        </Link>
      </div>
    </div>
  );
}
