const express = require('express');
const router = express.Router();
const {
    getStats,
    listDoctors,
    updateDoctorApproval,
    listPatients,
    listHospitals,
    createHospital,
    updateHospital,
    deleteHospital
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, Role } = require('../middleware/roleMiddleware');

router.get('/stats', protect, authorize(Role.ADMIN), getStats);
router.get('/doctors', protect, authorize(Role.ADMIN), listDoctors);
router.put('/doctors/:id/approval', protect, authorize(Role.ADMIN), updateDoctorApproval);
router.get('/patients', protect, authorize(Role.ADMIN), listPatients);
router.get('/hospitals', protect, authorize(Role.ADMIN), listHospitals);
router.post('/hospitals', protect, authorize(Role.ADMIN), createHospital);
router.put('/hospitals/:id', protect, authorize(Role.ADMIN), updateHospital);
router.delete('/hospitals/:id', protect, authorize(Role.ADMIN), deleteHospital);

module.exports = router;
//This file defines the admin-related API routes, including:
// dashboard stats
// doctor approval
// patient listing
// hospital CRUD operations
// Each route is protected by authentication and role-based 
// authorization middleware to ensure that only admins can access these endpoints.