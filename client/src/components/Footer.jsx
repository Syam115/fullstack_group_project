import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="brand-mark">MediLuxe</div>
          <p>
            Manage appointments for patients, doctors, and administrators in one place.
          </p>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/doctors" className="nav-link">Specialists</Link>
          <Link to="/login" className="nav-link">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}
