const fs = require('fs');
const path = require('path');

const files = {
  'server.js': `const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/notifications', require('./routes/notificationRoutes'));
// app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));

app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));\n`,

  'controllers/doctorController.js': `const Doctor = require('../models/Doctor');
exports.getDoctors = async (req, res) => {
    try {
        const { specialization } = req.query;
        let query = {};
        if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
        const doctors = await Doctor.find(query).select('-__v');
        res.json(doctors);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateAvailability = async (req, res) => {
    try {
        const { availableSlots } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(req.user._id, { availableSlots }, { new: true });
        res.json(doctor);
    } catch (err) { res.status(500).json({ message: err.message }); }
};\n`,

  'controllers/appointmentController.js': `const Appointment = require('../models/Appointment');
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
};\n`,

  'routes/doctorRoutes.js': `const express = require('express'); const router = express.Router();
const { getDoctors, getDoctorById, updateAvailability } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, Role } = require('../middleware/roleMiddleware');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/availability', protect, authorize(Role.DOCTOR), updateAvailability);
module.exports = router;\n`,

  'routes/appointmentRoutes.js': `const express = require('express'); const router = express.Router();
const { bookAppointment, getPatientHistory, updateStatus } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, Role } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize(Role.PATIENT), bookAppointment);
router.get('/history', protect, authorize(Role.PATIENT), getPatientHistory);
router.put('/:id/status', protect, updateStatus);
module.exports = router;\n`,

  'routes/adminRoutes.js': `const express = require('express'); const router = express.Router(); module.exports = router;\n`,
  'middleware/errorMiddleware.js': `module.exports = (err, req, res, next) => { res.status(500).json({ message: err.message }); };\n`
};

Object.keys(files).forEach(f => {
  const filePath = path.join(__dirname, 'server', f);
  fs.writeFileSync(filePath, files[f]);
});
console.log("Backend logic builder complete.");
