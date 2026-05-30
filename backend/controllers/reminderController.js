// Helper to format Supabase reminder to expected frontend shape
const formatReminder = (r) => {
  return {
    _id: r.id,
    id: r.id,
    owner: r.user_id,
    title: r.title,
    category: r.category,
    dueDate: r.due_date,
    notes: r.notes,
    completed: r.completed,
    createdAt: r.created_at
  };
};

// @desc    Get reminders
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
  try {
    const { data: reminders, error } = await req.supabase
      .from('reminders')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const formatted = reminders.map(formatReminder);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res) => {
  const { title, category, dueDate, notes } = req.body;

  try {
    // Check subscription plan limits (Free: 3 reminders)
    if (req.user.subscriptionPlan === 'Free') {
      const { count, error: countError } = await req.supabase
        .from('reminders')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        return res.status(400).json({ success: false, message: countError.message });
      }

      if (count >= 3) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan limit reached (Max 3 active reminders). Please upgrade to Premium for unlimited trackers.'
        });
      }
    }

    const { data: reminder, error } = await req.supabase
      .from('reminders')
      .insert({
        user_id: req.user.id,
        title,
        category: category || 'Other',
        due_date: dueDate,
        notes: notes || '',
        completed: false
      })
      .select('*')
      .single();

    if (error || !reminder) {
      return res.status(400).json({ success: false, message: error?.message || 'Failed to create reminder' });
    }

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: `Created Reminder ${title}`
    });

    res.status(201).json({ success: true, data: formatReminder(reminder) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res) => {
  const { title, category, dueDate, notes, completed } = req.body;

  try {
    const { data: reminder, error } = await req.supabase
      .from('reminders')
      .update({
        title,
        category,
        due_date: dueDate,
        notes,
        completed
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found or unauthorized' });
    }

    // Notify user if completed
    if (completed === true) {
      await req.supabase.from('notifications').insert({
        user_id: req.user.id,
        title: 'Reminder Completed',
        message: `Your tracking task "${reminder.title}" was marked completed.`,
        type: 'info'
      });
    }

    res.json({ success: true, data: formatReminder(reminder) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('reminders')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: 'Reminder removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder
};
