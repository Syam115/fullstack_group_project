import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import formatDate from '../utils/formatDate';
import formatLabel from '../utils/formatLabel';
import { api, authHeaders } from '../services/api';
import { processReminders } from '../services/notificationService';

export default function AdminDashboard() {
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [hospitalForm, setHospitalForm] = useState({
    hospitalName: '',
    location: '',
    contactNumber: '',
    email: '',
    description: '',
  });

  const loadAdminData = async () => {
    try {
      const requestConfig = { headers: authHeaders(userToken) };
      const [statsResponse, doctorsResponse, patientsResponse, hospitalsResponse] = await Promise.all([
        api.get('/admin/stats', requestConfig),
        api.get('/admin/doctors', requestConfig),
        api.get('/admin/patients', requestConfig),
        api.get('/admin/hospitals', requestConfig),
      ]);

      setStats(statsResponse.data);
      setDoctors(doctorsResponse.data);
      setPatients(patientsResponse.data);
      setHospitals(hospitalsResponse.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const requestConfig = { headers: authHeaders(userToken) };

    Promise.all([
      api.get('/admin/stats', requestConfig),
      api.get('/admin/doctors', requestConfig),
      api.get('/admin/patients', requestConfig),
      api.get('/admin/hospitals', requestConfig),
    ])
      .then(([statsResponse, doctorsResponse, patientsResponse, hospitalsResponse]) => {
        if (!ignore) {
          setStats(statsResponse.data);
          setDoctors(doctorsResponse.data);
          setPatients(patientsResponse.data);
          setHospitals(hospitalsResponse.data);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [userToken]);

  const updateDoctorApproval = async (id, approvalStatus) => {
    try {
      await api.put(`/admin/doctors/${id}/approval`, { approvalStatus }, { headers: authHeaders(userToken) });
      await loadAdminData();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const saveHospital = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/hospitals', hospitalForm, { headers: authHeaders(userToken) });
      setHospitalForm({
        hospitalName: '',
        location: '',
        contactNumber: '',
        email: '',
        description: '',
      });
      await loadAdminData();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const removeHospital = async (id) => {
    try {
      await api.delete(`/admin/hospitals/${id}`, { headers: authHeaders(userToken) });
      await loadAdminData();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const triggerReminders = async () => {
    try {
      const { data } = await processReminders(userToken);
      alert(`${data.message}. Created: ${data.created}`);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <section className="dashboard-layout animate-fade-in">
      <aside className="dashboard-sidebar glass">
        <div>
          <span className="eyebrow">Administration</span>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>{userInfo?.name || 'Admin Portal'}</h2>
          <p>Monitor system activity, doctors, patients, and recent appointment requests.</p>
        </div>

        <div className="metric-card">
          <strong>{stats?.totals?.appointments ?? 0}</strong>
          <span>Total Appointments</span>
        </div>

        <div className="metric-card">
          <strong>{stats?.totals?.doctors ?? 0}</strong>
          <span>Doctors</span>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-metrics">
          <div className="metric-card">
            <strong>{stats?.totals?.patients ?? 0}</strong>
            <span>Patients</span>
          </div>
          <div className="metric-card">
            <strong>{stats?.totals?.pendingAppointments ?? 0}</strong>
            <span>Pending</span>
          </div>
          <div className="metric-card">
            <strong>{stats?.totals?.confirmedAppointments ?? 0}</strong>
            <span>Confirmed</span>
          </div>
          <div className="metric-card">
            <strong>{stats?.totals?.completedAppointments ?? 0}</strong>
            <span>Completed</span>
          </div>
        </div>

        <div className="panel luxury-card">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Recent Activity</span>
              <h3>Latest Appointments</h3>
            </div>
            <div className="button-row">
              <span className="status-pill">Admin View</span>
              <button type="button" className="btn btn-secondary" onClick={triggerReminders}>
                Run Reminders
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Loading dashboard data...</p>
            </div>
          ) : !stats?.appointments?.length ? (
            <div className="empty-state">
              <h3 style={{ marginBottom: '0.75rem' }}>No appointments found</h3>
              <p>Appointments will appear here when patients start booking.</p>
            </div>
          ) : (
            <div className="appointment-list">
              {stats.appointments.map((appt) => (
                <article key={appt._id} className="appointment-card">
                  <div className="panel-header" style={{ marginBottom: 0 }}>
                    <h3 style={{ marginBottom: 0 }}>{appt.doctorId?.name || 'Doctor'}</h3>
                    <span className={`status-pill ${appt.status === 'Confirmed' ? 'success' : appt.status === 'Cancelled' ? 'error' : ''}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="appointment-meta">
                    <span>Patient: {appt.patientId?.name || 'N/A'}</span>
                    <span>Date: {formatDate(appt.date)}</span>
                    <span>Time: {appt.start_time}</span>
                  </div>
                  <p>Specialization: {formatLabel(appt.doctorId?.specialization) || 'N/A'}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="panel luxury-card">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Approvals</span>
              <h3>Doctor Registrations</h3>
            </div>
          </div>
          <div className="appointment-list">
            {doctors.map((doctor) => (
              <article key={doctor._id} className="appointment-card">
                <div className="panel-header" style={{ marginBottom: 0 }}>
                  <h3 style={{ marginBottom: 0 }}>{doctor.name}</h3>
                  <span className="status-pill">{doctor.approvalStatus}</span>
                </div>
                <div className="appointment-meta">
                  <span>{formatLabel(doctor.specialization)}</span>
                  <span>{doctor.hospital}</span>
                  <span>{doctor.location || 'No location'}</span>
                </div>
                <div className="button-row">
                  <button type="button" className="btn btn-primary" onClick={() => updateDoctorApproval(doctor._id, 'Approved')}>
                    Approve
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => updateDoctorApproval(doctor._id, 'Rejected')}>
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel luxury-card">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Patients</span>
              <h3>Patient Accounts</h3>
            </div>
          </div>
          <div className="appointment-list">
            {patients.map((patient) => (
              <article key={patient._id} className="appointment-card">
                <h3>{patient.name}</h3>
                <div className="appointment-meta">
                  <span>{patient.email}</span>
                  <span>{patient.phone || 'No phone'}</span>
                  <span>Joined: {formatDate(patient.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel luxury-card">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Hospitals</span>
              <h3>Hospital Management</h3>
            </div>
          </div>

          <form onSubmit={saveHospital} className="stack-sm" style={{ marginBottom: '1rem' }}>
            <div className="filter-grid">
              <input className="form-input" placeholder="Hospital Name" value={hospitalForm.hospitalName} onChange={(e) => setHospitalForm((current) => ({ ...current, hospitalName: e.target.value }))} required />
              <input className="form-input" placeholder="Location" value={hospitalForm.location} onChange={(e) => setHospitalForm((current) => ({ ...current, location: e.target.value }))} required />
              <input className="form-input" placeholder="Contact Number" value={hospitalForm.contactNumber} onChange={(e) => setHospitalForm((current) => ({ ...current, contactNumber: e.target.value }))} required />
              <input className="form-input" placeholder="Email" value={hospitalForm.email} onChange={(e) => setHospitalForm((current) => ({ ...current, email: e.target.value }))} />
            </div>
            <textarea className="form-input" rows="3" placeholder="Hospital description" value={hospitalForm.description} onChange={(e) => setHospitalForm((current) => ({ ...current, description: e.target.value }))} />
            <button type="submit" className="btn btn-primary">Add Hospital</button>
          </form>

          <div className="appointment-list">
            {hospitals.map((hospital) => (
              <article key={hospital._id} className="appointment-card">
                <div className="panel-header" style={{ marginBottom: 0 }}>
                  <h3 style={{ marginBottom: 0 }}>{hospital.hospitalName}</h3>
                  <button type="button" className="btn btn-secondary" onClick={() => removeHospital(hospital._id)}>
                    Delete
                  </button>
                </div>
                <div className="appointment-meta">
                  <span>{hospital.location}</span>
                  <span>{hospital.contactNumber}</span>
                  <span>{hospital.email || 'No email'}</span>
                </div>
                <p>{hospital.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
