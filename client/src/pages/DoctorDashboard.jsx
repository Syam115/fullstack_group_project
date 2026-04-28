import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AppointmentCard from '../components/AppointmentCard';
import formatDate from '../utils/formatDate';
import generateTimeSlots from '../utils/generateTimeSlots';
import { getDoctorAppointments, updateAppointmentStatus } from '../services/appointmentService';
import { getDoctorById, updateDoctorAvailability } from '../services/doctorService';
import { savePrescription } from '../services/prescriptionService';

export default function DoctorDashboard() {
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([
    '09:00 AM',
    '11:30 AM',
    '03:00 PM',
  ]);
  const [prescriptionForms, setPrescriptionForms] = useState({});
  const slotOptions = generateTimeSlots(9, 17);

  const fetchAppointments = async () => {
    try {
      const [{ data }, doctorProfile] = await Promise.all([
        getDoctorAppointments(userToken),
        getDoctorById(userInfo?._id),
      ]);
      setAppointments(data);
      setAvailableSlots(doctorProfile.data.availableSlots || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    Promise.all([
      getDoctorAppointments(userToken),
      getDoctorById(userInfo?._id),
    ])
      .then(([appointmentsResponse, doctorResponse]) => {
        if (!ignore) {
          setAppointments(appointmentsResponse.data);
          setAvailableSlots(doctorResponse.data.availableSlots || []);
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
  }, [userInfo?._id, userToken]);

  const updateStatus = async (appointmentId, status) => {
    try {
      const { data } = await updateAppointmentStatus(appointmentId, { status }, userToken);

      setAppointments((current) => current.map((appt) => (appt._id === appointmentId ? data : appt)));
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const toggleSlot = (slot) => {
    setAvailableSlots((current) => (current.includes(slot)
      ? current.filter((item) => item !== slot)
      : [...current, slot]));
  };

  const saveAvailability = async () => {
    try {
      await updateDoctorAvailability({ availableSlots }, userToken);
      alert('Availability updated');
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const submitPrescription = async (appointmentId) => {
    try {
      const form = prescriptionForms[appointmentId];
      const payload = new FormData();
      payload.append('appointmentId', appointmentId);
      payload.append('doctorNotes', form?.doctorNotes || '');
      payload.append('prescription', form?.prescription || '');
      payload.append('followUpDate', form?.followUpDate || '');

      await savePrescription(payload, userToken);
      await fetchAppointments();
      alert('Consultation record saved');
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const pendingCount = appointments.filter((appt) => appt.status === 'Pending').length;
  const confirmedCount = appointments.filter((appt) => appt.status === 'Confirmed').length;

  return (
    <section className="dashboard-layout animate-fade-in">
      <aside className="dashboard-sidebar glass">
        <div>
          <span className="eyebrow">Doctor Workspace</span>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>{userInfo?.name || 'Doctor Portal'}</h2>
          <p>Review patient requests and confirm or cancel each appointment.</p>
        </div>

        <div className="metric-card">
          <strong>{pendingCount}</strong>
          <span>Pending Requests</span>
        </div>

        <div className="metric-card">
          <strong>{confirmedCount}</strong>
          <span>Confirmed Visits</span>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="panel luxury-card">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Availability</span>
              <h3>Manage Consultation Slots</h3>
            </div>
            <button type="button" className="btn btn-secondary" onClick={saveAvailability}>
              Save Availability
            </button>
          </div>
          <div className="slots">
            {slotOptions.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`slot-chip ${availableSlots.includes(slot) ? 'slot-chip-active' : ''}`}
                onClick={() => toggleSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="panel luxury-card">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Appointments</span>
              <h3>Patient Requests</h3>
            </div>
            <span className="status-pill">Doctor View</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <h3 style={{ marginBottom: '0.75rem' }}>No appointment requests yet</h3>
              <p>New patient bookings will appear here.</p>
            </div>
          ) : (
            <div className="appointment-list">
              {appointments.map((appt) => (
                <AppointmentCard key={appt._id} appointment={appt}>
                  <div className="appointment-meta">
                    <span>Email: {appt.patientId?.email || 'N/A'}</span>
                    <span>Date: {formatDate(appt.date)}</span>
                  </div>
                  {appt.status !== 'Completed' ? (
                    <div className="button-row" style={{ marginTop: '0.35rem' }}>
                      <button type="button" className="btn btn-primary" onClick={() => updateStatus(appt._id, 'Confirmed')}>
                        Confirm
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => updateStatus(appt._id, 'Cancelled')}>
                        Cancel
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => updateStatus(appt._id, 'Completed')}>
                        Mark Completed
                      </button>
                    </div>
                  ) : null}

                  {(appt.status === 'Confirmed' || appt.status === 'Completed') ? (
                    <div className="stack-sm">
                      <textarea
                        className="form-input"
                        rows="3"
                        placeholder="Doctor notes"
                        value={prescriptionForms[appt._id]?.doctorNotes || ''}
                        onChange={(e) => setPrescriptionForms((current) => ({
                          ...current,
                          [appt._id]: { ...current[appt._id], doctorNotes: e.target.value },
                        }))}
                      />
                      <textarea
                        className="form-input"
                        rows="3"
                        placeholder="Prescription details"
                        value={prescriptionForms[appt._id]?.prescription || ''}
                        onChange={(e) => setPrescriptionForms((current) => ({
                          ...current,
                          [appt._id]: { ...current[appt._id], prescription: e.target.value },
                        }))}
                      />
                      <input
                        type="date"
                        className="form-input"
                        value={prescriptionForms[appt._id]?.followUpDate || ''}
                        onChange={(e) => setPrescriptionForms((current) => ({
                          ...current,
                          [appt._id]: { ...current[appt._id], followUpDate: e.target.value },
                        }))}
                      />
                      <button type="button" className="btn btn-secondary" onClick={() => submitPrescription(appt._id)}>
                        Save Consultation Record
                      </button>
                    </div>
                  ) : null}
                </AppointmentCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
