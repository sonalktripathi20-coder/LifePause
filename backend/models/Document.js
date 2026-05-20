const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
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
    enum: ['Identity', 'Insurance', 'Financial', 'Travel', 'Medical'],
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String, // Mock file URL or file size simulation info
    default: ''
  },
  expiryDate: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', DocumentSchema);
