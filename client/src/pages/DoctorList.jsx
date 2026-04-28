import { useEffect, useState } from 'react';
import DoctorCard from '../components/DoctorCard';
import { getDoctors } from '../services/doctorService';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialization: '',
    hospital: '',
    location: '',
    availability: false,
  });

  const loadDoctors = async () => {
    try {
      const { data } = await getDoctors({
        ...filters,
        availability: filters.availability ? 'true' : '',
      });
      setDoctors(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let ignore = false;

    getDoctors({})
      .then(({ data }) => {
        if (!ignore) {
          setDoctors(data);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="section animate-fade-in">
      <div className="doctor-list-header">
        <div>
          <span className="eyebrow">Medical Advisory Board</span>
          <h1 className="section-title">Meet our specialists.</h1>
        </div>
        <p className="section-copy">
          Select a doctor to view the profile and book an available slot.
        </p>
      </div>

      <div className="panel luxury-card filter-bar">
        <div className="filter-grid">
          <input
            className="form-input"
            placeholder="Search specialization"
            value={filters.specialization}
            onChange={(e) => setFilters((current) => ({ ...current, specialization: e.target.value }))}
          />
          <input
            className="form-input"
            placeholder="Search hospital"
            value={filters.hospital}
            onChange={(e) => setFilters((current) => ({ ...current, hospital: e.target.value }))}
          />
          <input
            className="form-input"
            placeholder="Search location"
            value={filters.location}
            onChange={(e) => setFilters((current) => ({ ...current, location: e.target.value }))}
          />
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={filters.availability}
              onChange={(e) => setFilters((current) => ({ ...current, availability: e.target.checked }))}
            />
            Show only doctors with available slots
          </label>
        </div>
        <div className="button-row">
          <button type="button" className="btn btn-primary" onClick={loadDoctors}>Apply Filters</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={async () => {
              const nextFilters = { specialization: '', hospital: '', location: '', availability: false };
              setFilters(nextFilters);
              const { data } = await getDoctors(nextFilters);
              setDoctors(data);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {doctors.length === 0 ? (
        <div className="empty-state luxury-card">
          <h3 style={{ marginBottom: '0.75rem' }}>Loading specialists</h3>
          <p>The clinical network is being prepared for viewing.</p>
        </div>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doc) => <DoctorCard key={doc._id} doc={doc} />)}
        </div>
      )}
    </section>
  );
}
