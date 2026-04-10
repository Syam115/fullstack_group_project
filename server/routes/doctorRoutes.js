const express = require('express'); const router = express.Router();
const { getDoctors, getDoctorById, updateAvailability } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, Role } = require('../middleware/roleMiddleware');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/availability', protect, authorize(Role.DOCTOR), updateAvailability);
module.exports = router;
