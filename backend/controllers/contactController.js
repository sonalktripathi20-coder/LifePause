// Helper to format Supabase contact to expected frontend shape
const formatContact = (c) => {
  return {
    _id: c.id,
    id: c.id,
    owner: c.user_id,
    name: c.contact_name,
    email: c.email,
    phone: c.phone,
    relationship: c.relationship,
    permission: c.permission,
    isVerified: c.is_verified,
    createdAt: c.created_at
  };
};

// @desc    Get contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    const { data: contacts, error } = await req.supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const formatted = contacts.map(formatContact);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create contact
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res) => {
  const { name, email, phone, relationship, permission } = req.body;

  try {
    // Check subscription plan limits (Free: 1 trusted contact)
    if (req.user.subscriptionPlan === 'Free') {
      const { count, error: countError } = await req.supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        return res.status(400).json({ success: false, message: countError.message });
      }

      if (count >= 1) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan limit reached (Max 1 trusted contact). Please upgrade to Premium for unlimited contacts.'
        });
      }
    }

    const { data: contact, error } = await req.supabase
      .from('contacts')
      .insert({
        user_id: req.user.id,
        contact_name: name,
        email,
        phone: phone || '',
        relationship: relationship || '',
        permission,
        is_verified: false
      })
      .select('*')
      .single();

    if (error || !contact) {
      return res.status(400).json({ success: false, message: error?.message || 'Failed to create contact' });
    }

    // Create verification alert notification & audit log
    await req.supabase.from('notifications').insert({
      user_id: req.user.id,
      title: 'Invitation Sent',
      message: `An invitation was sent to ${name} (${email}) to verify their emergency contact authorization.`,
      type: 'info'
    });

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: `Created Contact ${name}`
    });

    res.status(201).json({ success: true, data: formatContact(contact) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
  const { name, email, phone, relationship, permission } = req.body;

  try {
    const { data: contact, error } = await req.supabase
      .from('contacts')
      .update({
        contact_name: name,
        email,
        phone,
        relationship,
        permission
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !contact) {
      return res.status(404).json({ success: false, message: 'Contact not found or unauthorized' });
    }

    res.json({ success: true, data: formatContact(contact) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('contacts')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: 'Contact removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate contact verification
// @route   PUT /api/contacts/:id/verify
// @access  Private
const verifyContact = async (req, res) => {
  try {
    const { data: contact, error } = await req.supabase
      .from('contacts')
      .update({
        is_verified: true
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !contact) {
      return res.status(404).json({ success: false, message: 'Contact not found or unauthorized' });
    }

    // Create verified alert notification
    await req.supabase.from('notifications').insert({
      user_id: req.user.id,
      title: 'Emergency Contact Verified',
      message: `${contact.contact_name} has successfully verified their contact details and access rights.`,
      type: 'security'
    });

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: `Verified Contact ${contact.contact_name}`
    });

    res.json({ success: true, data: formatContact(contact) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  verifyContact
};
