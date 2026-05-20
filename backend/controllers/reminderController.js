const Reminder = require('../models/Reminder');
const Notification = require('../models/Notification');

// @desc    Get reminders
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ owner: req.user._id });
    res.json({ success: true, count: reminders.length, data: reminders });
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
      const count = await Reminder.countDocuments({ owner: req.user._id });
      if (count >= 3) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan limit reached (Max 3 active reminders). Please upgrade to Premium for unlimited trackers.'
        });
      }
    }

    const reminder = await Reminder.create({
      owner: req.user._id,
      title,
      category,
      dueDate,
      notes
    });

    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    if (reminder.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Notify user if completed
    if (req.body.completed === true) {
      await Notification.create({
        owner: req.user._id,
        title: 'Reminder Completed',
        message: `Your tracking task "${reminder.title}" was marked completed.`,
        type: 'info'
      });
    }

    res.json({ success: true, data: reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    if (reminder.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await reminder.deleteOne();

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
