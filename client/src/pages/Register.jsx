import { useState } from 'react';
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
