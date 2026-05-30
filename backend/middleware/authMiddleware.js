const { getClientForUser } = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({ success: false, message: 'Not authorized, invalid token format' });
      }

      // Get scoped Supabase client for this user to verify their token
      const client = getClientForUser(token);
      
      // Get user from Supabase Auth using their token
      const { data: { user }, error } = await client.auth.getUser();

      if (error || !user) {
        return res.status(401).json({ success: false, message: 'Not authorized, session invalid or expired' });
      }

      // Fetch user profile details from public.users table
      const { data: profile, error: profileError } = await client
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        // If the public profile doesn't exist yet, construct a temporary one from the auth user
        req.user = {
          id: user.id,
          _id: user.id, // Backwards compatibility for mongoose _id
          name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
          email: user.email,
          subscriptionPlan: 'Free',
          familyMembers: [],
          medicalProfile: {
            bloodGroup: '',
            allergies: '',
            medications: '',
            doctorContact: '',
            preferredHospital: ''
          }
        };
      } else {
        // Map database fields to backend Mongoose expected shape to prevent breaking frontend
        req.user = {
          id: profile.id,
          _id: profile.id, // For existing frontend code expecting user._id
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
      }

      // Store token and scoped client on request
      req.token = token;
      req.supabase = client;

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
