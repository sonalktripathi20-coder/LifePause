const Contact = require('../models/Contact');
const Notification = require('../models/Notification');

// @desc    Get contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id });
    res.json({ success: true, count: contacts.length, data: contacts });
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
      const count = await Contact.countDocuments({ owner: req.user._id });
      if (count >= 1) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan limit reached (Max 1 trusted contact). Please upgrade to Premium for unlimited contacts.'
        });
      }
    }

    const contact = await Contact.create({
      owner: req.user._id,
      name,
      email,
      phone,
      relationship,
      permission,
      isVerified: false // Needs invitation verification
    });

    // Create verification alert notification
    await Notification.create({
      owner: req.user._id,
      title: 'Invitation Sent',
      message: `An invitation was sent to ${name} (${email}) to verify their emergency contact authorization.`,
      type: 'info'
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    if (contact.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    if (contact.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await contact.deleteOne();

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
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    if (contact.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    contact.isVerified = true;
    await contact.save();

    // Create verified alert notification
    await Notification.create({
      owner: req.user._id,
      title: 'Emergency Contact Verified',
      message: `${contact.name} has successfully verified their contact details and access rights.`,
      type: 'security'
    });

    res.json({ success: true, data: contact });
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
