const mongoose = require('mongoose');

const notifSchema = new mongoose.Schema({
    notification_id: String,
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'userModel' },
    userModel: {
        type: String,
        enum: ['User', 'Doctor', 'Admin'],
        default: 'User'
    },
    appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    message: String,
    sent_at: Date,
    status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' },
    type: String,
    channel: { type: String, default: 'in-app' },
    meta: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notifSchema);
