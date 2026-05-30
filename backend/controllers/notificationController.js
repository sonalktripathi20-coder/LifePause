// Helper to format Supabase notification to expected frontend shape
const formatNotification = (n) => {
  return {
    _id: n.id,
    id: n.id,
    owner: n.user_id,
    title: n.title,
    message: n.message,
    type: n.type,
    isRead: n.is_read,
    createdAt: n.created_at
  };
};

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const { data: notifications, error } = await req.supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const formatted = notifications.map(formatNotification);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { data: notification, error } = await req.supabase
      .from('notifications')
      .update({
        is_read: true
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !notification) {
      return res.status(404).json({ success: false, message: 'Notification not found or unauthorized' });
    }

    res.json({ success: true, data: formatNotification(notification) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const clearNotification = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('notifications')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: 'Notification cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotification
};
