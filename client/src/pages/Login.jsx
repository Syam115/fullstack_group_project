import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const [role, setRole] = useState(() => location.state?.suggestedRole || 'patient');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const redirectTo = location.state?.redirectTo;
  const redirectState = location.state?.redirectState;
  const portalMessage = location.state?.portalMessage;

  useEffect(() => {
    if (userInfo) {
      navigate(redirectTo || `/dashboard/${userInfo.role}`, {
        replace: true,
        state: redirectState,
      });
    }
  }, [userInfo, navigate, redirectTo, redirectState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password, role }));
  };

  return (
    <section className="auth-shell animate-fade-in">
      <div className="form-container glass auth-card">
        <span className="eyebrow">Secure Access</span>
        <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>Sign in to MediLuxe.</h1>
        <p className="auth-copy" style={{ marginBottom: '1.75rem' }}>
          Enter your email, password, and role to continue.
        </p>

        {portalMessage ? <div className="form-note" style={{ marginBottom: '1rem' }}>{portalMessage}</div> : null}
        {error ? <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="you@mediluxe.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Portal Type</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === 'doctor' ? (
            <div className="form-note" style={{ marginBottom: '1rem' }}>
              Newly registered doctors can sign in only after admin approval.
            </div>
          ) : null}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>
            {loading ? 'Signing In...' : 'Enter Platform'}
          </button>
        </form>

        <p className="auth-footer-text" style={{ marginTop: '1.25rem' }}>
          New here? <Link to="/register" style={{ color: 'var(--text)' }}>Get started</Link>.
        </p>
      </div>
    </section>
  );
}
