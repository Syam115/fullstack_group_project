const fs = require('fs');
const path = require('path');

const files = {
  'src/components/ProtectedRoute.jsx': `import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function ProtectedRoute({ children }) {
  const { userInfo } = useSelector(state => state.auth);
  return userInfo ? children : <Navigate to="/login" />;
}
`,

  'src/pages/Register.jsx': `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      await axios.post((import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api')+'/auth/register', form); 
      navigate('/login'); 
    } catch(err) { alert(err.response?.data?.message || err.message); }
  };
  return (
    <div className="form-container glass animate-fade-in">
      <h2 style={{marginBottom: '1.5rem', textAlign: 'center'}}>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label className="form-label">Name</label><input className="form-input" required onChange={e=>setForm({...form, name: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" required onChange={e=>setForm({...form, email: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" required onChange={e=>setForm({...form, password: e.target.value})} /></div>
        <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop: '1rem'}}>Register</button>
      </form>
    </div>
  );
}
`,

  'src/pages/PatientDashboard.jsx': `import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
export default function PatientDashboard() {
  const { userInfo, userToken } = useSelector(state => state.auth);
  const [appts, setAppts] = useState([]);
  
  useEffect(() => {
    axios.get((import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api')+'/appointments/history', { 
      headers: { Authorization: \`Bearer \${userToken}\` } 
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
`,

  'src/components/DoctorCard.jsx': `import { Link } from 'react-router-dom';
export default function DoctorCard({ doc }) {
  return (
    <div className="glass" style={{padding:'2rem', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
      <div>
        <h3 style={{fontSize: '1.25rem', marginBottom: '0.25rem'}}>{doc.name}</h3>
        <p style={{color:'var(--primary-color)', fontWeight: '600'}}>{doc.specialization}</p>
        <p style={{color:'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0'}}>{doc.experience} Years Experience • {doc.hospital}</p>
      </div>
      <Link to={\`/doctors/\${doc._id}\`} className="btn btn-secondary" style={{marginTop:'1.5rem', textAlign: 'center'}}>View Profile</Link>
    </div>
  );
}
`,

  'src/pages/DoctorList.jsx': `import { useEffect, useState } from 'react';
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
`,

  'src/pages/DoctorDetails.jsx': `import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
export default function DoctorDetails() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  
  useEffect(() => {
    axios.get((import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api')+\`/doctors/\${id}\`)
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
          <p><strong>Consultation Fee:</strong> \${doc.fee}</p>
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
`,

  'src/pages/BookAppointment.jsx': `import { useState } from 'react';
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
      { headers: { Authorization: \`Bearer \${userToken}\` } });
      
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
`,

  'src/pages/DoctorDashboard.jsx': `export default function DoctorDashboard() { 
  return (
    <div className="dashboard-grid animate-fade-in">
      <div className="sidebar glass"><h3>Doctor Portal</h3></div>
      <div className="main-content glass"><h2>Doctor Dashboard</h2><p>View your scheduled patients here.</p></div>
    </div>
  ); 
}
`,
  'src/pages/AdminDashboard.jsx': `export default function AdminDashboard() { 
  return (
    <div className="dashboard-grid animate-fade-in">
      <div className="sidebar glass"><h3>Admin Portal</h3></div>
      <div className="main-content glass"><h2>System Statistics</h2><p>Overview of hospital doctors and appointments.</p></div>
    </div>
  ); 
}
`,
  'src/App.jsx': `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorList from './pages/DoctorList';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/book" element={<BookAppointment />} />
        
        <Route path="/dashboard/patient" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/doctor" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
`
};

Object.keys(files).forEach(f => {
  const filePath = path.join(__dirname, 'client', f);
  fs.writeFileSync(filePath, files[f]);
});
console.log("Frontend logic builder complete.");
