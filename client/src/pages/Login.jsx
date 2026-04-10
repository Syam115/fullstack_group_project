import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector(state => state.auth);

  useEffect(() => {
    if (userInfo) navigate(`/dashboard/${userInfo.role}`);
  }, [userInfo, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password, role }));
  };

  return (
    <div className="form-container glass animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="form-input">
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
