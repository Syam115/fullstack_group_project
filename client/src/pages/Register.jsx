import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import generateTimeSlots from '../utils/generateTimeSlots';
import { registerDoctorRequest, registerPatientRequest } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: '',
    role: 'patient',
    specialization: '',
    experience: 0,
    hospital: '',
    location: '',
    fee: 0,
    availableSlots: ['09:00 AM', '11:00 AM'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const allTimeSlots = generateTimeSlots(9, 17);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSlotToggle = (slot) => {
    setForm((current) => ({
      ...current,
      availableSlots: current.availableSlots.includes(slot)
        ? current.availableSlots.filter((item) => item !== slot)
        : [...current.availableSlots, slot],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (form.role === 'doctor') {
        await registerDoctorRequest({
          name: form.name,
          email: form.email,
          password: form.password,
          specialization: form.specialization,
          experience: Number(form.experience),
          hospital: form.hospital,
          location: form.location,
          fee: Number(form.fee),
          availableSlots: form.availableSlots,
        });

        navigate('/login', {
          state: {
            portalMessage: 'Doctor registration submitted. An admin must approve your account before you can sign in.',
            suggestedRole: 'doctor',
          },
        });
        return;
      } else {
        await registerPatientRequest({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          date_of_birth: form.date_of_birth,
          role: 'patient',
        });
      }

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell animate-fade-in">
      <div className="form-container glass auth-card">
        <span className="eyebrow">Account Setup</span>
        <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>Get started with MediLuxe.</h2>
        <p className="auth-copy" style={{ marginBottom: '1.75rem' }}>
          {form.role === 'doctor'
            ? 'Create a doctor account request. After admin approval, you can sign in to the doctor portal.'
            : 'Create a patient account to book appointments with available doctors.'}
        </p>

        {error ? <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div> : null}
        {form.role === 'doctor' ? (
          <div className="form-note" style={{ marginBottom: '1rem' }}>
            Doctor accounts are reviewed by an admin before login is enabled.
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select value={form.role} onChange={handleChange('role')} className="form-input">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" required onChange={handleChange('name')} placeholder="Aarav Sharma" />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" required onChange={handleChange('email')} placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" required onChange={handleChange('password')} placeholder="Create a secure password" />
          </div>

          {form.role === 'patient' ? (
            <>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" onChange={handleChange('phone')} placeholder="+91 9876543210" />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-input" onChange={handleChange('date_of_birth')} />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input className="form-input" required onChange={handleChange('specialization')} placeholder="Cardiology" />
              </div>

              <div className="form-group">
                <label className="form-label">Experience</label>
                <input type="number" className="form-input" required min="0" onChange={handleChange('experience')} placeholder="8" />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital</label>
                <input className="form-input" required onChange={handleChange('hospital')} placeholder="City Care Hospital" />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" required onChange={handleChange('location')} placeholder="Hyderabad" />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Fee</label>
                <input type="number" className="form-input" required min="0" onChange={handleChange('fee')} placeholder="500" />
              </div>

              <div className="form-group">
                <label className="form-label">Available Slots</label>
                <div className="slots">
                  {allTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-chip ${form.availableSlots.includes(slot) ? 'slot-chip-active' : ''}`}
                      onClick={() => handleSlotToggle(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text" style={{ marginTop: '1.25rem' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--text)' }}>Sign in here</Link>.
        </p>
      </div>
    </section>
  );
}
