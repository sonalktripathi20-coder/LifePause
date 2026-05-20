const mongoose = require('mongoose');

const VaultItemSchema = new mongoose.Schema({
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
    enum: ['Passwords', 'Financial', 'Notes', 'Documents', 'Emergency Instructions'],
    required: true
  },
  content: {
    // Stores JSON fields, e.g. { username, password, pin, notes, secretQuestions }
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VaultItem', VaultItemSchema);
