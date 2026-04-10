import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const doc = location.state?.doc;
  const { userToken } = useSelector(state => state.auth);
  
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  
  if(!doc) return <div style={{padding:'3rem 5%', textAlign:'center'}}>Please select a doctor first.</div>;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!userToken) { alert('Please login first'); return navigate('/login'); }
    
    setLoading(true);
    try {
      await axios.post((import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api')+'/appointments', 
      { doctorId: doc._id, date, start_time: slot, end_time: 'To be determined', reason }, 
      { headers: { Authorization: `Bearer ${userToken}` } });
      
      alert('Appointment successfully booked! Notification sent.');
      navigate('/dashboard/patient');
    } catch(err) { 
      alert(err.response?.data?.message || err.message); 
      setLoading(false);
    }
  };
  
  return (
    <div className="form-container glass animate-fade-in" style={{maxWidth: '500px'}}>
      <h2 style={{marginBottom: '1.5rem', textAlign: 'center'}}>Book Appointment</h2>
      <p style={{textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem'}}>with <strong>{doc.name}</strong></p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Date</label>
          <input type="date" className="form-input" required onChange={e=>setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Available Time Slot</label>
          <select className="form-input" required onChange={e=>setSlot(e.target.value)}>
            <option value="">Select a time</option>
            {doc.availableSlots?.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Reason for Visit</label>
          <textarea className="form-input" rows="3" required onChange={e=>setReason(e.target.value)} placeholder="Briefly describe your symptoms" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%', marginTop: '1rem'}}>
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}
