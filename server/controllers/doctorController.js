const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res) => {
    try {
        const { specialization, hospital, location, availability, approvalStatus } = req.query;
        const query = {};

        if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
        if (hospital) query.hospital = { $regex: hospital, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };
        query.approvalStatus = approvalStatus || 'Approved';

        if (availability === 'true') {
            query.availableSlots = { $exists: true, $ne: [] };
        }

        const doctors = await Doctor.find(query).select('-password -__v');
        res.json(doctors);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('-password -__v');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateAvailability = async (req, res) => {
    try {
        const { availableSlots } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(req.user._id, { availableSlots }, { new: true }).select('-password -__v');
        res.json(doctor);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
