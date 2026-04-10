import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
export default function PatientDashboard() {
  const { userInfo, userToken } = useSelector(state => state.auth);
  const [appts, setAppts] = useState([]);
  
  useEffect(() => {
    axios.get((import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api')+'/appointments/history', { 
      headers: { Authorization: `Bearer ${userToken}` } 
    }).then(res => setAppts(res.data)).catch(console.error);
  }, [userToken]);
  
  return (
    <div className="dashboard-grid animate-fade-in">
      <div className="sidebar glass">
        <h3 style={{color: 'var(--primary-color)'}}>{userInfo?.name}</h3>
        <p>Patient Portal</p>
      </div>
      <div className="main-content glass">
        <h2 style={{marginBottom: '1rem'}}>My Appointments</h2>
        <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
          {appts.length === 0 ? <p>No appointments booked.</p> : appts.map(a => (
            <div key={a._id} style={{padding: '1rem', borderLeft: '4px solid var(--primary-color)', background: 'rgba(0,0,0,0.2)'}}>
              <p><strong>Date:</strong> {a.date} | <strong>Time:</strong> {a.start_time}</p>
              <p style={{color: 'var(--text-muted)'}}>Reason: {a.reason}</p>
              <span style={{color: a.status==='Booked' ? 'var(--secondary-color)' : 'var(--text-light)'}}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
