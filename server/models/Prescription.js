const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorNotes: { type: String, required: true, trim: true },
    prescription: { type: String, required: true, trim: true },
    followUpDate: { type: String, default: '' },
    prescriptionFile: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
