const EmergencySetting = require('../models/EmergencySetting');
const Notification = require('../models/Notification');
const Contact = require('../models/Contact');

// @desc    Get emergency settings
// @route   GET /api/emergency/settings
// @access  Private
const getEmergencySettings = async (req, res) => {
  try {
    let settings = await EmergencySetting.findOne({ owner: req.user._id });
    if (!settings) {
      settings = await EmergencySetting.create({
        owner: req.user._id,
        inactivityDays: 30,
        automaticTriggerEnabled: false,
        emergencyNote: 'This is my emergency release note. In case of inactivity, please share my digital vault access with my trusted contacts.'
      });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update emergency settings
// @route   PUT /api/emergency/settings
// @access  Private
const updateEmergencySettings = async (req, res) => {
  const { inactivityDays, automaticTriggerEnabled, emergencyNote } = req.body;

  try {
    let settings = await EmergencySetting.findOne({ owner: req.user._id });
    if (!settings) {
      settings = new EmergencySetting({ owner: req.user._id });
    }

    // Gate premium feature: inactivity automation is only for Premium and Family plans
    if (automaticTriggerEnabled === true && req.user.subscriptionPlan === 'Free') {
      return res.status(403).json({
        success: false,
        message: 'Inactivity automation is a Premium feature. Please upgrade to enable automatic emergency triggers.'
      });
    }

    if (inactivityDays !== undefined) settings.inactivityDays = inactivityDays;
    if (automaticTriggerEnabled !== undefined) settings.automaticTriggerEnabled = automaticTriggerEnabled;
    if (emergencyNote !== undefined) settings.emergencyNote = emergencyNote;
    settings.lastActiveDate = Date.now(); // reset activity when settings are updated

    await settings.save();

    await Notification.create({
      owner: req.user._id,
      title: 'Emergency Settings Updated',
      message: 'Your emergency triggers and inactivity parameters have been successfully configured.',
      type: 'security'
    });

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger countdown workflow (simulated or actual)
// @route   POST /api/emergency/trigger-countdown
// @access  Private
const triggerCountdown = async (req, res) => {
  try {
    const settings = await EmergencySetting.findOne({ owner: req.user._id });
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Settings not found' });
    }

    settings.status = 'Countdown';
    settings.countdownStart = Date.now();
    await settings.save();

    await Notification.create({
      owner: req.user._id,
      title: 'Emergency Countdown Started',
      message: 'Inactivity threshold exceeded. Emergency countdown initiated. Check in now to cancel.',
      type: 'emergency'
    });

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger SOS emergency mode immediately
// @route   POST /api/emergency/trigger-sos
// @access  Private
const triggerSOS = async (req, res) => {
  try {
    const settings = await EmergencySetting.findOne({ owner: req.user._id });
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Settings not found' });
    }

    settings.status = 'Triggered';
    settings.countdownStart = null;
    await settings.save();

    // Notify user
    await Notification.create({
      owner: req.user._id,
      title: 'EMERGENCY SOS TRIGGERED',
      message: 'Your LifePause emergency protocol has been activated. Trusted contacts are being alerted.',
      type: 'emergency'
    });

    // Simulated alerts sent to contacts
    const contacts = await Contact.find({ owner: req.user._id });
    for (const c of contacts) {
      if (c.permission === 'Emergency Access' || c.permission === 'Full Access') {
        console.log(`[ALERT] Alerting contact ${c.name} (${c.email}): Emergency SOS activated by user ${req.user.name}.`);
      }
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel emergency mode / check-in
// @route   POST /api/emergency/cancel
// @access  Private
const cancelSOS = async (req, res) => {
  try {
    const settings = await EmergencySetting.findOne({ owner: req.user._id });
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Settings not found' });
    }

    settings.status = 'Inactive';
    settings.countdownStart = null;
    settings.lastActiveDate = Date.now();
    await settings.save();

    await Notification.create({
      owner: req.user._id,
      title: 'Emergency State Cancelled',
      message: 'You checked in successfully. LifePause emergency trigger reset to inactive.',
      type: 'security'
    });

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmergencySettings,
  updateEmergencySettings,
  triggerCountdown,
  triggerSOS,
  cancelSOS
};
