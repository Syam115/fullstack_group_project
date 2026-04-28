import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NotificationCard from '../components/NotificationCard';
import { getNotifications, markNotificationRead } from '../services/notificationService';

const roleCopy = {
  patient: {
    eyebrow: 'Patient Inbox',
    title: 'Care Notifications',
    description: 'Track confirmations, reminders, reschedules, and consultation updates for your appointments.',
    emptyTitle: 'No patient notifications yet',
    emptyText: 'Your appointment confirmations, reminders, and care updates will appear here.',
    cardLabel: 'Patient Update',
  },
  doctor: {
    eyebrow: 'Doctor Inbox',
    title: 'Practice Alerts',
    description: 'Review new booking requests, patient changes, account updates, and schedule-related actions.',
    emptyTitle: 'No doctor alerts yet',
    emptyText: 'New appointment requests, reschedule alerts, and admin updates will appear here.',
    cardLabel: 'Doctor Alert',
  },
  admin: {
    eyebrow: 'Admin Inbox',
    title: 'System Notifications',
    description: 'Monitor doctor approvals, hospital record updates, and operational summaries that need oversight.',
    emptyTitle: 'No admin notifications yet',
    emptyText: 'Approval requests, hospital updates, and system summaries will appear here.',
    cardLabel: 'Admin Alert',
  },
};

export default function Notifications() {
  const { userToken, userInfo } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const copy = roleCopy[userInfo?.role] || roleCopy.patient;

  useEffect(() => {
    let ignore = false;

    getNotifications(userToken)
      .then(({ data }) => {
        if (!ignore) {
          setNotifications(data);
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

  const handleRead = async (id) => {
    try {
      const { data } = await markNotificationRead(id, userToken);
      setNotifications((current) => current.map((item) => (item._id === id ? data : item)));
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <section className="section animate-fade-in">
      <div className="doctor-list-header">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="section-title">{copy.title}</h1>
        </div>
        <p className="section-copy">{copy.description}</p>
      </div>

      <div className="panel luxury-card">
        {loading ? (
          <div className="loading-state"><p>Loading notifications...</p></div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <h3 style={{ marginBottom: '0.75rem' }}>{copy.emptyTitle}</h3>
            <p>{copy.emptyText}</p>
          </div>
        ) : (
          <div className="appointment-list">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onRead={handleRead}
                roleLabel={copy.cardLabel}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
