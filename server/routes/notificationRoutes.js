const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markNotificationRead,
    processReminders
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, Role } = require('../middleware/roleMiddleware');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markNotificationRead);
router.post('/process-reminders', protect, authorize(Role.ADMIN), processReminders);

module.exports = router;
