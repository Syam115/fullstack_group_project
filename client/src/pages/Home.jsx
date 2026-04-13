import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Book by Doctor',
    copy: 'Choose a specialist, review open time slots, and request an appointment directly.',
  },
  {
    title: 'Doctor Actions',
    copy: 'Doctors can review requests after login and confirm or cancel each booking.',
  },
  {
    title: 'Admin Oversight',
    copy: 'Administrators can monitor doctors, patients, and recent appointments from one place.',
  },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Appointments</span>
            <h1 className="section-title">Doctor booking made simple.</h1>
          </div>
          <p className="section-copy">
            Patients can book with a specific doctor, doctors can manage requests, and administrators
            can track activity across the platform.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-index">{String(index + 1).padStart(2, '0')}</div>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-band">
          <div className="panel">
            <span className="eyebrow">Patients</span>
            <h2 className="section-title">Find the right doctor and request a visit.</h2>
            <p className="section-copy">
              Browse specialists, open a profile, and book using the doctor&apos;s available slots.
            </p>
          </div>
          <div className="panel">
            <span className="eyebrow">Access</span>
            <h2 className="section-title">Use the role-based portal.</h2>
            <p>
              Sign in as a patient, doctor, or administrator to manage the work assigned to that role.
            </p>
            <div className="button-row" style={{ marginTop: '1.5rem' }}>
              <Link to="/doctors" className="btn btn-primary">View Doctors</Link>
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
