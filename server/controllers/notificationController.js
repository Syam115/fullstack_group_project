const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const sendAppointmentReminder = require('../utils/sendAppointmentReminder');

function getUserModel(role) {
    if (role === 'doctor') return 'Doctor';
    if (role === 'admin') return 'Admin';
    return 'User';
}

async function processUpcomingReminders() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
    const appointments = await Appointment.find({
        status: 'Confirmed',
        date: {
            $gte: now.toISOString().slice(0, 10),
            $lte: tomorrow.toISOString().slice(0, 10)
        }
    });

    let created = 0;

    for (const appointment of appointments) {
        const existingReminder = await Notification.findOne({
            appointment_id: appointment._id,
            userId: appointment.patientId,
            type: 'Reminder'
        });

        if (!existingReminder) {
            await sendAppointmentReminder({
                appointment,
                patientId: appointment.patientId,
                message: `Reminder: you have an appointment on ${appointment.date} at ${appointment.start_time}`
            });
            created += 1;
        }
    }

    return created;
}

exports.getNotifications = async (req, res) => {
    try {
        await processUpcomingReminders();

        const notifications = await Notification.find({
            userId: req.user._id,
            userModel: getUserModel(req.user.role)
        })
            .populate('appointment_id')
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (String(notification.userId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'You can only update your own notifications' });
        }

        notification.status = 'Read';
        await notification.save();

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.processReminders = async (req, res) => {
    try {
        const created = await processUpcomingReminders();
        res.json({ message: 'Reminder processing complete', created });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
