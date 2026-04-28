const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
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

async function syncAdminAlerts() {
    const admins = await Admin.find({}).select('_id');
    const pendingDoctors = await Doctor.find({ approvalStatus: 'Pending' }).select('_id name createdAt');

    for (const admin of admins) {
        for (const doctor of pendingDoctors) {
            const exists = await Notification.findOne({
                userId: admin._id,
                userModel: 'Admin',
                type: 'Doctor Approval',
                'meta.doctorId': doctor._id,
                status: 'Unread'
            });

            if (!exists) {
                await Notification.create({
                    userId: admin._id,
                    userModel: 'Admin',
                    message: `Doctor approval pending for ${doctor.name}`,
                    sent_at: new Date(),
                    status: 'Unread',
                    type: 'Doctor Approval',
                    channel: 'in-app',
                    meta: {
                        doctorId: doctor._id,
                        doctorName: doctor.name
                    }
                });
            }
        }
    }
}

exports.getNotifications = async (req, res) => {
    try {
        await processUpcomingReminders();
        if (req.user.role === 'admin') {
            await syncAdminAlerts();
        }

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
        await Notification.create({
            userId: req.user._id,
            userModel: 'Admin',
            message: `Reminder processing finished. ${created} reminder notification(s) generated.`,
            sent_at: new Date(),
            status: 'Unread',
            type: 'System Summary',
            channel: 'in-app',
            meta: {
                created
            }
        });
        res.json({ message: 'Reminder processing complete', created });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
