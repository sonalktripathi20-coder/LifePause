const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MedicalProfileSchema = new mongoose.Schema({
  bloodGroup: { type: String, default: '' },
  allergies: { type: String, default: '' },
  medications: { type: String, default: '' },
  doctorContact: { type: String, default: '' },
  preferredHospital: { type: String, default: '' }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['Free', 'Premium', 'Family'],
    default: 'Free'
  },
  familyMembers: [{
    type: String // Emails of family members
  }],
  medicalProfile: {
    type: MedicalProfileSchema,
    default: () => ({})
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
