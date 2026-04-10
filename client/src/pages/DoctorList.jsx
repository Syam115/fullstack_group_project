import { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';
export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  
  useEffect(() => {
    axios.get((import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api')+'/doctors')
      .then(res => setDoctors(res.data)).catch(console.error);
  }, []);
  
  return (
    <div style={{padding: '3rem 5%'}} className="animate-fade-in">
      <h2 style={{fontSize: '2.5rem'}}>Our Medical Specialists</h2>
      <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Select a doctor to view availability and book an appointment.</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'2rem'}}>
        {doctors.map(doc => <DoctorCard key={doc._id} doc={doc} />)}
      </div>
    </div>
  );
}
