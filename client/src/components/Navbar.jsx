import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);

  return (
    <nav className="navbar glass animate-fade-in">
      <Link to="/" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'white' }}>
        Medi<span style={{ color: 'var(--primary-color)' }}>Book</span>
      </Link>
      <div className="nav-links">
        <Link to="/doctors" className="nav-link">Find Doctors</Link>
        {userInfo ? (
          <>
            <Link to={`/dashboard/${userInfo.role}`} className="nav-link">Dashboard</Link>
            <button onClick={() => dispatch(logout())} className="btn btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
