const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Subscription', 'Passport', 'Insurance', 'License', 'Bills', 'Other'],
    default: 'Other'
  },
  dueDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
