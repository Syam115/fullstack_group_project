import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero animate-fade-in">
      <div>
        <h1>Modern Healthcare <br /> At Your Fingertips</h1>
        <p>Book appointments with the best doctors in your city instantly. No queues, no waiting.</p>
        <Link to="/doctors" className="btn btn-primary" style={{ marginRight: '1rem' }}>Book an Appointment</Link>
        <Link to="/register" className="btn btn-secondary">Join as Patient</Link>
      </div>
    </div>
  );
}
