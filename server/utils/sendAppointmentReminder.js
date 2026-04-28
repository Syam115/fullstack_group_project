const Notification = require('../models/Notification');

module.exports = async function sendAppointmentReminder({ appointment, patientId, message }) {
    return Notification.create({
        userId: patientId,
        userModel: 'User',
        appointment_id: appointment._id,
        message,
        sent_at: new Date(),
        status: 'Unread',
        type: 'Reminder',
        channel: 'in-app',
        meta: {
            date: appointment.date,
            start_time: appointment.start_time
        }
    });
};
