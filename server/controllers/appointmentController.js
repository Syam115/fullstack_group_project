const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, start_time, end_time, reason } = req.body;
        const appointmentExists = await Appointment.findOne({ doctorId, date, start_time, status: 'Booked' });
        if (appointmentExists) return res.status(400).json({ message: 'Slot already booked' });
        
        const appointment = await Appointment.create({
            patientId: req.user._id, doctorId, date, start_time, end_time, reason, status: 'Booked'
        });
        await Notification.create({ appointment_id: appointment._id, message: 'Appointment Confirmed', sent_at: new Date(), status: 'Unread', type: 'Confirmation' });
        res.status(201).json(appointment);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.getPatientHistory = async (req, res) => {
    try { const appts = await Appointment.find({ patientId: req.user._id }).populate('doctorId', 'name specialization'); res.json(appts); }
    catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appt = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(appt);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
