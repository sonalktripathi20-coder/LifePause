// Helper to format Supabase emergency setting to expected frontend shape
const formatEmergencySettings = (s) => {
  return {
    _id: s.id,
    id: s.id,
    owner: s.user_id,
    inactivityDays: s.inactivity_days,
    lastActiveDate: s.last_active_date,
    automaticTriggerEnabled: s.emergency_enabled,
    emergencyNote: s.emergency_note,
    status: s.status,
    countdownStart: s.countdown_start,
    createdAt: s.created_at
  };
};

// @desc    Get emergency settings
// @route   GET /api/emergency/settings
// @access  Private
const getEmergencySettings = async (req, res) => {
  try {
    let { data: settings, error } = await req.supabase
      .from('emergency_settings')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (!settings) {
      // Lazy initialization if trigger somehow didn't catch it
      const { data: newSettings, error: createError } = await req.supabase
        .from('emergency_settings')
        .insert({
          user_id: req.user.id,
          inactivity_days: 30,
          emergency_enabled: false,
          emergency_note: 'This is my emergency release note. In case of inactivity, please share my digital vault access with my trusted contacts.'
        })
        .select('*')
        .single();

      if (createError) {
        return res.status(400).json({ success: false, message: createError.message });
      }
      settings = newSettings;
    }

    res.json({ success: true, data: formatEmergencySettings(settings) });
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
    // Gate premium feature: inactivity automation is only for Premium and Family plans
    if (automaticTriggerEnabled === true && req.user.subscriptionPlan === 'Free') {
      return res.status(403).json({
        success: false,
        message: 'Inactivity automation is a Premium feature. Please upgrade to enable automatic emergency triggers.'
      });
    }

    // Build fields to update
    const updates = {};
    if (inactivityDays !== undefined) updates.inactivity_days = inactivityDays;
    if (automaticTriggerEnabled !== undefined) updates.emergency_enabled = automaticTriggerEnabled;
    if (emergencyNote !== undefined) updates.emergency_note = emergencyNote;
    updates.last_active_date = new Date().toISOString();

    const { data: settings, error } = await req.supabase
      .from('emergency_settings')
      .update(updates)
      .eq('user_id', req.user.id)
      .select('*')
      .single();

    if (error || !settings) {
      return res.status(404).json({ success: false, message: 'Settings not found or unauthorized' });
    }

    await req.supabase.from('notifications').insert({
      user_id: req.user.id,
      title: 'Emergency Settings Updated',
      message: 'Your emergency triggers and inactivity parameters have been successfully configured.',
      type: 'security'
    });

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: 'Updated Emergency Settings'
    });

    res.json({ success: true, data: formatEmergencySettings(settings) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger countdown workflow (simulated or actual)
// @route   POST /api/emergency/trigger-countdown
// @access  Private
const triggerCountdown = async (req, res) => {
  try {
    const { data: settings, error } = await req.supabase
      .from('emergency_settings')
      .update({
        status: 'Countdown',
        countdown_start: new Date().toISOString()
      })
      .eq('user_id', req.user.id)
      .select('*')
      .single();

    if (error || !settings) {
      return res.status(404).json({ success: false, message: 'Settings not found or unauthorized' });
    }

    await req.supabase.from('notifications').insert({
      user_id: req.user.id,
      title: 'Emergency Countdown Started',
      message: 'Inactivity threshold exceeded. Emergency countdown initiated. Check in now to cancel.',
      type: 'emergency'
    });

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: 'Countdown Triggered due to inactivity'
    });

    res.json({ success: true, data: formatEmergencySettings(settings) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger SOS emergency mode immediately
// @route   POST /api/emergency/trigger-sos
// @access  Private
const triggerSOS = async (req, res) => {
  try {
    const { data: settings, error } = await req.supabase
      .from('emergency_settings')
      .update({
        status: 'Triggered',
        countdown_start: null
      })
      .eq('user_id', req.user.id)
      .select('*')
      .single();

    if (error || !settings) {
      return res.status(404).json({ success: false, message: 'Settings not found or unauthorized' });
    }

    // Notify user
    await req.supabase.from('notifications').insert({
      user_id: req.user.id,
      title: 'EMERGENCY SOS TRIGGERED',
      message: 'Your LifePause emergency protocol has been activated. Trusted contacts are being alerted.',
      type: 'emergency'
    });

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: 'SOS ACTIVATED BY USER'
    });

    // Simulated alerts sent to contacts
    const { data: contacts } = await req.supabase
      .from('contacts')
      .select('*');

    if (contacts) {
      for (const c of contacts) {
        if (c.permission === 'Emergency Access' || c.permission === 'Full Access') {
          console.log(`[ALERT] Alerting contact ${c.contact_name} (${c.email}): Emergency SOS activated by user ${req.user.name}.`);
        }
      }
    }

    res.json({ success: true, data: formatEmergencySettings(settings) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel emergency mode / check-in
// @route   POST /api/emergency/cancel
// @access  Private
const cancelSOS = async (req, res) => {
  try {
    const { data: settings, error } = await req.supabase
      .from('emergency_settings')
      .update({
        status: 'Inactive',
        countdown_start: null,
        last_active_date: new Date().toISOString()
      })
      .eq('user_id', req.user.id)
      .select('*')
      .single();

    if (error || !settings) {
      return res.status(404).json({ success: false, message: 'Settings not found or unauthorized' });
    }

    await req.supabase.from('notifications').insert({
      user_id: req.user.id,
      title: 'Emergency State Cancelled',
      message: 'You checked in successfully. LifePause emergency trigger reset to inactive.',
      type: 'security'
    });

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: 'Check-in: SOS Cancelled'
    });

    res.json({ success: true, data: formatEmergencySettings(settings) });
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
