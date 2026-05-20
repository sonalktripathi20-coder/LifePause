const User = require('../models/User');
const EmergencySetting = require('../models/EmergencySetting');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'lifepause_jwt_secret_token_key_998877', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      // Initialize Emergency Settings for this user
      await EmergencySetting.create({
        owner: user._id,
        inactivityDays: 30,
        automaticTriggerEnabled: false,
        emergencyNote: 'This is my emergency release note. In case of inactivity, please share my digital vault access with my trusted contacts.'
      });

      // Add a welcome notification
      await Notification.create({
        owner: user._id,
        title: 'Welcome to LifePause!',
        message: 'Get started by completing your emergency onboarding steps.',
        type: 'info'
      });

      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          subscriptionPlan: user.subscriptionPlan,
          familyMembers: user.familyMembers,
          medicalProfile: user.medicalProfile,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Create a login alert notification
      await Notification.create({
        owner: user._id,
        title: 'New Login Detected',
        message: `Successful login from browser at ${new Date().toLocaleString()}`,
        type: 'security'
      });

      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          subscriptionPlan: user.subscriptionPlan,
          familyMembers: user.familyMembers,
          medicalProfile: user.medicalProfile,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update medical profile
// @route   PUT /api/auth/medical
// @access  Private
const updateMedicalProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.medicalProfile = {
        bloodGroup: req.body.bloodGroup || user.medicalProfile.bloodGroup,
        allergies: req.body.allergies || user.medicalProfile.allergies,
        medications: req.body.medications || user.medicalProfile.medications,
        doctorContact: req.body.doctorContact || user.medicalProfile.doctorContact,
        preferredHospital: req.body.preferredHospital || user.medicalProfile.preferredHospital
      };

      const updatedUser = await user.save();

      // Add a notification about updating the medical profile
      await Notification.create({
        owner: user._id,
        title: 'Medical Profile Updated',
        message: 'Your emergency medical card has been updated successfully.',
        type: 'info'
      });

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          subscriptionPlan: updatedUser.subscriptionPlan,
          familyMembers: updatedUser.familyMembers,
          medicalProfile: updatedUser.medicalProfile,
          createdAt: updatedUser.createdAt
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update subscription plan
// @route   PUT /api/auth/subscription
// @access  Private
const updateSubscription = async (req, res) => {
  const { plan, familyMembers } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.subscriptionPlan = plan;
      if (plan === 'Family' && familyMembers) {
        user.familyMembers = familyMembers;
      } else if (plan !== 'Family') {
        user.familyMembers = [];
      }

      const updatedUser = await user.save();

      // Notification
      await Notification.create({
        owner: user._id,
        title: `Plan Upgraded to ${plan}`,
        message: `Thank you for subscribing! Your account is now active on the ${plan} plan.`,
        type: 'payment'
      });

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          subscriptionPlan: updatedUser.subscriptionPlan,
          familyMembers: updatedUser.familyMembers,
          medicalProfile: updatedUser.medicalProfile,
          createdAt: updatedUser.createdAt
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account with that email' });
    }
    // Simulate reset token sending
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email. (Simulated Reset Code: RESET123)'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    if (code !== 'RESET123') {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMedicalProfile,
  updateSubscription,
  forgotPassword,
  resetPassword
};
