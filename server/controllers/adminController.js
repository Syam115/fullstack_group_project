const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

exports.getStats = async (req, res) => {
    try {
        const [
            patients,
            doctors,
            pendingDoctors,
            appointments,
            pendingAppointments,
            confirmedAppointments,
            completedAppointments,
            hospitals,
            recentAppointments
        ] = await Promise.all([
            User.countDocuments({ role: 'patient' }),
            Doctor.countDocuments({ approvalStatus: 'Approved' }),
            Doctor.countDocuments({ approvalStatus: 'Pending' }),
            Appointment.countDocuments(),
            Appointment.countDocuments({ status: 'Pending' }),
            Appointment.countDocuments({ status: 'Confirmed' }),
            Appointment.countDocuments({ status: 'Completed' }),
            Hospital.countDocuments(),
            Appointment.find({})
                .populate('patientId', 'name email')
                .populate('doctorId', 'name specialization approvalStatus')
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        res.json({
            totals: {
                patients,
                doctors,
                pendingDoctors,
                appointments,
                pendingAppointments,
                confirmedAppointments,
                completedAppointments,
                hospitals
            },
            appointments: recentAppointments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select('-password').sort({ createdAt: -1 });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateDoctorApproval = async (req, res) => {
    try {
        const { approvalStatus } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(approvalStatus)) {
            return res.status(400).json({ message: 'Invalid approval status' });
        }

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { approvalStatus },
            { new: true }
        ).select('-password');

        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listPatients = async (req, res) => {
    try {
        const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find({}).sort({ hospitalName: 1 });
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createHospital = async (req, res) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).json(hospital);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.json(hospital);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.json({ message: 'Hospital deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
