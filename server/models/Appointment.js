const mongoose = require('mongoose');

const apptSchema = new mongoose.Schema({
    appointment_id: String,
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, default: 'To be determined' },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    rescheduledCount: { type: Number, default: 0 },
    previousSchedules: {
        type: [{
            date: String,
            start_time: String,
            end_time: String,
            changedAt: Date
        }],
        default: []
    },
    completedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', apptSchema);
