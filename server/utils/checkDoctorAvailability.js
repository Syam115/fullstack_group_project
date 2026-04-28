const Appointment = require('../models/Appointment');

module.exports = async function checkDoctorAvailability({ doctorId, date, start_time, appointmentId }) {
    const query = {
        doctorId,
        date,
        start_time,
        status: { $in: ['Pending', 'Confirmed'] }
    };

    if (appointmentId) {
        query._id = { $ne: appointmentId };
    }

    const existing = await Appointment.findOne(query);
    return !existing;
};
