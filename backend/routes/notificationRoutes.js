const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes

router.route('/')
  .get(getNotifications);

router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', clearNotification);

module.exports = router;
