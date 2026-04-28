const express = require('express'); const router = express.Router();
const { getDoctors, getDoctorById, updateAvailability } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, Role } = require('../middleware/roleMiddleware');

router.get('/', getDoctors);
router.put('/availability', protect, authorize(Role.DOCTOR), updateAvailability);
router.get('/:id', getDoctorById);
module.exports = router;
