const express = require('express'); const router = express.Router();
const { bookAppointment, getPatientHistory, updateStatus } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, Role } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize(Role.PATIENT), bookAppointment);
router.get('/history', protect, authorize(Role.PATIENT), getPatientHistory);
router.put('/:id/status', protect, updateStatus);
module.exports = router;
