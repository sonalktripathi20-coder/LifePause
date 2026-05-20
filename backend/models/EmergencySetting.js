const mongoose = require('mongoose');

const EmergencySettingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  inactivityDays: {
    type: Number,
    default: 30
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  automaticTriggerEnabled: {
    type: Boolean,
    default: false
  },
  emergencyNote: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Inactive', 'Countdown', 'Triggered'],
    default: 'Inactive'
  },
  countdownStart: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmergencySetting', EmergencySettingSchema);
