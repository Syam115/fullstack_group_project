const express = require('express');
const router = express.Router();
const {
    addPrescription,
    getAppointmentPrescription,
    getMyPrescriptions
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, Role } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/mine', protect, authorize(Role.PATIENT, Role.DOCTOR), getMyPrescriptions);
router.get('/appointment/:appointmentId', protect, authorize(Role.PATIENT, Role.DOCTOR, Role.ADMIN), getAppointmentPrescription);
router.post('/', protect, authorize(Role.DOCTOR), upload.single('prescriptionFile'), addPrescription);

module.exports = router;
