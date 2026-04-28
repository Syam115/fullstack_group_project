import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AppointmentCard from '../components/AppointmentCard';
import PrescriptionCard from '../components/PrescriptionCard';
import { getPatientHistory } from '../services/appointmentService';
import { getAppointmentPrescription } from '../services/prescriptionService';

export default function AppointmentHistory() {
  const { userToken } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState({});

  useEffect(() => {
    getPatientHistory(userToken)
      .then((res) => setAppointments(res.data))
      .catch(console.error);
  }, [userToken]);

  const handleViewPrescription = async (appointmentId) => {
    try {
      const { data } = await getAppointmentPrescription(appointmentId, userToken);
      setPrescriptions((current) => ({ ...current, [appointmentId]: data }));
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <section className="section animate-fade-in">
      <div className="doctor-list-header">
        <div>
          <span className="eyebrow">Records</span>
          <h1 className="section-title">Appointment History</h1>
        </div>
        <p className="section-copy">Review every booking, status update, and completed consultation record.</p>
      </div>

      <div className="panel luxury-card">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <h3 style={{ marginBottom: '0.75rem' }}>No appointment history found</h3>
            <p>Once you start booking appointments, they will appear here.</p>
          </div>
        ) : (
          <div className="appointment-list">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="stack-md">
                <AppointmentCard appointment={appointment}>
                  {appointment.status === 'Completed' ? (
                    <button type="button" className="btn btn-secondary" onClick={() => handleViewPrescription(appointment._id)}>
                      View Consultation Record
                    </button>
                  ) : null}
                </AppointmentCard>
                {prescriptions[appointment._id] ? (
                  <PrescriptionCard prescription={prescriptions[appointment._id]} />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
