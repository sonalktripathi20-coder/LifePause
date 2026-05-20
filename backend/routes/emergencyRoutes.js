const express = require('express');
const router = express.Router();
const {
  getEmergencySettings,
  updateEmergencySettings,
  triggerCountdown,
  triggerSOS,
  cancelSOS
} = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes

router.route('/settings')
  .get(getEmergencySettings)
  .put(updateEmergencySettings);

router.post('/trigger-countdown', triggerCountdown);
router.post('/trigger-sos', triggerSOS);
router.post('/cancel', cancelSOS);

module.exports = router;
