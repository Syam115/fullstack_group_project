import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found animate-fade-in">
      <div className="form-container glass" style={{ textAlign: 'center' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>Error 404</span>
        <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>This page does not exist.</h1>
        <p style={{ marginBottom: '1.5rem' }}>
          The route could not be found, but the rest of the experience is still right here.
        </p>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    </section>
  );
}
