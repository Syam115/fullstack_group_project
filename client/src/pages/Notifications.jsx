import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NotificationCard from '../components/NotificationCard';
import { getNotifications, markNotificationRead } from '../services/notificationService';

export default function Notifications() {
  const { userToken } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <span className="eyebrow">Inbox</span>
          <h1 className="section-title">Notifications</h1>
        </div>
        <p className="section-copy">Read confirmations, reminders, and appointment updates.</p>
      </div>

      <div className="panel luxury-card">
        {loading ? (
          <div className="loading-state"><p>Loading notifications...</p></div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <h3 style={{ marginBottom: '0.75rem' }}>No notifications yet</h3>
            <p>Booking confirmations and reminders will appear here.</p>
          </div>
        ) : (
          <div className="appointment-list">
            {notifications.map((notification) => (
              <NotificationCard key={notification._id} notification={notification} onRead={handleRead} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
