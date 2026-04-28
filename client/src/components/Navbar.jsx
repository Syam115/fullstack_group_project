import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="bell-icon">
      <path
        d="M12 3.75a4.25 4.25 0 0 0-4.25 4.25v1.25c0 .94-.27 1.85-.79 2.63L5.6 13.91a1.75 1.75 0 0 0 1.46 2.73h9.88a1.75 1.75 0 0 0 1.46-2.73l-1.36-2.03a4.72 4.72 0 0 1-.79-2.63V8A4.25 4.25 0 0 0 12 3.75Zm0 16.5a2.75 2.75 0 0 0 2.58-1.8.75.75 0 0 0-.7-1.01H10.1a.75.75 0 0 0-.7 1.01A2.75 2.75 0 0 0 12 20.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Navbar() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <header className="site-header">
      <nav className="navbar animate-fade-in">
        <Link to="/" className="brand" aria-label="Medilux home">
          <span className="brand-mark">MediLuxe</span>
          <span className="brand-copy">Private Care Concierge</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/doctors" className="nav-link">Find Doctors</NavLink>
          {userInfo ? (
            <>
              {userInfo.role === 'patient' ? (
                <NavLink to="/appointments/history" className="nav-link">
                  History
                </NavLink>
              ) : null}
              <NavLink to="/notifications" className="nav-icon-link" aria-label="Notifications">
                <BellIcon />
              </NavLink>
              <NavLink to={`/dashboard/${userInfo.role}`} className="nav-link">
                Dashboard
              </NavLink>
              <button onClick={() => dispatch(logout())} className="btn btn-secondary" type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">Sign In</NavLink>
              <Link to="/register" className="btn btn-primary">Create account</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
