const { supabase, getClientForUser } = require('../config/supabase');

// Helper to format Supabase profile to expected frontend shape
const formatUserProfile = (profile) => {
  return {
    _id: profile.id,
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    subscriptionPlan: profile.plan,
    familyMembers: profile.family_members || [],
    medicalProfile: {
      bloodGroup: profile.blood_group || '',
      allergies: profile.allergies || '',
      medications: profile.medications || '',
      doctorContact: profile.doctor_contact || '',
      preferredHospital: profile.preferred_hospital || ''
    },
    createdAt: profile.created_at
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Sign up user via Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name: name
        }
      }
    });

    if (signUpError) {
      return res.status(400).json({ success: false, message: signUpError.message });
    }

    const { user, session } = signUpData;

    if (!user) {
      return res.status(400).json({ success: false, message: 'Registration failed' });
    }

    // Construct profile in-memory for the registration response to bypass unauthenticated RLS read locks
    const profile = {
      id: user.id,
      email: user.email,
      full_name: name,
      plan: 'Free',
      family_members: [],
      blood_group: '',
      allergies: '',
      medications: '',
      doctor_contact: '',
      preferred_hospital: '',
      created_at: user.created_at || new Date().toISOString()
    };

    // Generate response token (use Supabase access_token or fallback)
    const token = session?.access_token || 'dummy_token_awaiting_email_verification';

    res.status(201).json({
      success: true,
      token,
      user: formatUserProfile(profile)
    });
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
    // 1. Sign in via Supabase Auth
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      return res.status(401).json({ success: false, message: loginError.message });
    }

    const { user, session } = data;

    // 2. Fetch public user profile using the user-scoped client to satisfy RLS!
    const userClient = getClientForUser(session.access_token);
    const { data: profile, error: profileError } = await userClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    // 3. Create login alert notification & write audit log (using user scoped client)
    await userClient.from('notifications').insert({
      user_id: user.id,
      title: 'New Login Detected',
      message: `Successful login from browser at ${new Date().toLocaleString()}`,
      type: 'security'
    });

    await userClient.from('audit_logs').insert({
      user_id: user.id,
      action: 'User Logged In'
    });

    res.json({
      success: true,
      token: session.access_token,
      user: formatUserProfile(profile)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const { data: profile, error } = await req.supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    res.json({
      success: true,
      user: formatUserProfile(profile)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update medical profile
// @route   PUT /api/auth/medical
// @access  Private
const updateMedicalProfile = async (req, res) => {
  const { bloodGroup, allergies, medications, doctorContact, preferredHospital } = req.body;

  try {
    const { data: profile, error: updateError } = await req.supabase
      .from('users')
      .update({
        blood_group: bloodGroup,
        allergies,
        medications,
        doctor_contact: doctorContact,
        preferred_hospital: preferredHospital
      })
      .eq('id', req.user.id)
      .select('*')
      .single();

    if (updateError || !profile) {
      return res.status(404).json({ success: false, message: 'Failed to update profile' });
    }

    // Add info notification & audit log
    await req.supabase.from('notifications').insert({
      user_id: req.user.id,
      title: 'Medical Profile Updated',
      message: 'Your emergency medical card has been updated successfully.',
      type: 'info'
    });

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: 'Updated Medical Profile'
    });

    res.json({
      success: true,
      user: formatUserProfile(profile)
    });
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
    const { data: profile, error: updateError } = await req.supabase
      .from('users')
      .update({
        plan,
        family_members: plan === 'Family' ? familyMembers : []
      })
      .eq('id', req.user.id)
      .select('*')
      .single();

    if (updateError || !profile) {
      return res.status(404).json({ success: false, message: 'Failed to update subscription' });
    }

    // Add notification & audit log
    await req.supabase.from('notifications').insert({
      user_id: req.user.id,
      title: `Plan Upgraded to ${plan}`,
      message: `Thank you for subscribing! Your account is now active on the ${plan} plan.`,
      type: 'payment'
    });

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: `Upgraded Subscription to ${plan}`
    });

    res.json({
      success: true,
      user: formatUserProfile(profile)
    });
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
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({
      success: true,
      message: 'Password reset link sent to your email successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    // If the request is authenticated via Bearer token, we can update the user directly
    if (req.supabase) {
      const { error } = await req.supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.json({
        success: true,
        message: 'Password has been updated successfully.'
      });
    }

    // Otherwise return custom message
    res.status(400).json({
      success: false,
      message: 'Please log in to update your password, or use the direct reset link sent to your email.'
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
