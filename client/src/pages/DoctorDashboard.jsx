import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AppointmentCard from '../components/AppointmentCard';
import formatDate from '../utils/formatDate';
import generateTimeSlots from '../utils/generateTimeSlots';
import { getDoctorAppointments, updateAppointmentStatus } from '../services/appointmentService';
import { getDoctorById, updateDoctorAvailability } from '../services/doctorService';
import { getMyPrescriptions, savePrescription } from '../services/prescriptionService';
import PrescriptionCard from '../components/PrescriptionCard';

export default function DoctorDashboard() {
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([
    '09:00 AM',
    '11:30 AM',
    '03:00 PM',
  ]);
  const [prescriptions, setPrescriptions] = useState({});
  const [prescriptionForms, setPrescriptionForms] = useState({});
  const [openRecordEditor, setOpenRecordEditor] = useState({});
  const slotOptions = generateTimeSlots(9, 17);

  const fetchAppointments = async () => {
    try {
      const [{ data }, doctorProfile, prescriptionsResponse] = await Promise.all([
        getDoctorAppointments(userToken),
        getDoctorById(userInfo?._id),
        getMyPrescriptions(userToken),
      ]);
      setAppointments(data);
      setAvailableSlots(doctorProfile.data.availableSlots || []);
      const prescriptionMap = Object.fromEntries(
        prescriptionsResponse.data.map((item) => [item.appointmentId?._id || item.appointmentId, item]),
      );
      setPrescriptions(prescriptionMap);
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
      getMyPrescriptions(userToken),
    ])
      .then(([appointmentsResponse, doctorResponse, prescriptionsResponse]) => {
        if (!ignore) {
          setAppointments(appointmentsResponse.data);
          setAvailableSlots(doctorResponse.data.availableSlots || []);
          const prescriptionMap = Object.fromEntries(
            prescriptionsResponse.data.map((item) => [item.appointmentId?._id || item.appointmentId, item]),
          );
          setPrescriptions(prescriptionMap);
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
      if (!form?.doctorNotes || !form?.prescription) {
        alert('Please enter doctor notes and prescription details before saving.');
        return;
      }

      const payload = new FormData();
      payload.append('appointmentId', appointmentId);
      payload.append('doctorNotes', form?.doctorNotes || '');
      payload.append('prescription', form?.prescription || '');
      payload.append('followUpDate', form?.followUpDate || '');

      const { data } = await savePrescription(payload, userToken);
      setPrescriptions((current) => ({ ...current, [appointmentId]: data }));
      setOpenRecordEditor((current) => ({ ...current, [appointmentId]: false }));
      await fetchAppointments();
      alert('Consultation record saved');
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const openEditor = (appointmentId) => {
    const existing = prescriptions[appointmentId];
    if (existing) {
      setPrescriptionForms((current) => ({
        ...current,
        [appointmentId]: {
          doctorNotes: existing.doctorNotes || '',
          prescription: existing.prescription || '',
          followUpDate: existing.followUpDate || '',
        },
      }));
    }

    setOpenRecordEditor((current) => ({ ...current, [appointmentId]: true }));
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
                    </div>
                  ) : null}

                  {appt.status === 'Confirmed' ? (
                    <div className="stack-sm">
                      {!openRecordEditor[appt._id] ? (
                        <button type="button" className="btn btn-secondary" onClick={() => openEditor(appt._id)}>
                          Add Consultation Record
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {(appt.status === 'Confirmed' && openRecordEditor[appt._id]) ? (
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
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setOpenRecordEditor((current) => ({ ...current, [appt._id]: false }))}
                      >
                        Close
                      </button>
                    </div>
                  ) : null}

                  {appt.status === 'Completed' ? (
                    <div className="stack-sm">
                      <div className="form-note">Consultation completed. The saved record is shown below.</div>
                      {prescriptions[appt._id] ? (
                        <>
                          <PrescriptionCard prescription={prescriptions[appt._id]} />
                          {!openRecordEditor[appt._id] ? (
                            <button type="button" className="btn btn-secondary" onClick={() => openEditor(appt._id)}>
                              Edit Record
                            </button>
                          ) : null}
                        </>
                      ) : (
                        <div className="form-note">No consultation record was found for this completed appointment.</div>
                      )}
                    </div>
                  ) : null}

                  {(appt.status === 'Completed' && openRecordEditor[appt._id]) ? (
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
                      <div className="button-row">
                        <button type="button" className="btn btn-secondary" onClick={() => submitPrescription(appt._id)}>
                          Update Consultation Record
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => setOpenRecordEditor((current) => ({ ...current, [appt._id]: false }))}
                        >
                          Close
                        </button>
                      </div>
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
