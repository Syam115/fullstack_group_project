const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');

exports.addPrescription = async (req, res) => {
    try {
        const { appointmentId, doctorNotes, prescription, followUpDate } = req.body;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        if (String(appointment.doctorId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'You can only add prescriptions for your own appointments' });
        }

        const saved = await Prescription.findOneAndUpdate(
            { appointmentId },
            {
                appointmentId,
                doctorId: appointment.doctorId,
                patientId: appointment.patientId,
                doctorNotes,
                prescription,
                followUpDate: followUpDate || '',
                prescriptionFile: req.file ? req.file.path : ''
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
            .populate('doctorId', 'name specialization')
            .populate('patientId', 'name email');

        appointment.status = 'Completed';
        appointment.completedAt = new Date();
        await appointment.save();

        await Notification.create({
            userId: appointment.patientId,
            userModel: 'User',
            appointment_id: appointment._id,
            message: 'Your doctor added consultation notes and prescription',
            sent_at: new Date(),
            status: 'Unread',
            type: 'Prescription',
            channel: 'in-app'
        });

        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAppointmentPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId })
            .populate('doctorId', 'name specialization')
            .populate('patientId', 'name email');

        if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
        res.json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyPrescriptions = async (req, res) => {
    try {
        const query = req.user.role === 'doctor'
            ? { doctorId: req.user._id }
            : { patientId: req.user._id };

        const prescriptions = await Prescription.find(query)
            .populate('appointmentId')
            .populate('doctorId', 'name specialization')
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 });

        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
