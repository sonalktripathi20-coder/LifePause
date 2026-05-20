const Document = require('../models/Document');
const Notification = require('../models/Notification');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ owner: req.user._id });
    res.json({ success: true, count: docs.length, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new document
// @route   POST /api/documents
// @access  Private
const createDocument = async (req, res) => {
  const { title, category, fileName, expiryDate, notes } = req.body;

  try {
    // Check subscription plan limits (Free: 2 documents)
    if (req.user.subscriptionPlan === 'Free') {
      const count = await Document.countDocuments({ owner: req.user._id });
      if (count >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan limit reached (Max 2 documents). Please upgrade to Premium for unlimited storage.'
        });
      }
    }

    const doc = await Document.create({
      owner: req.user._id,
      title,
      category,
      fileName,
      expiryDate,
      notes,
      fileUrl: `/uploads/${fileName}` // Simulated path
    });

    // Create notifications for expiration alert if expiryDate is set
    if (expiryDate) {
      await Notification.create({
        owner: req.user._id,
        title: 'Document Expiry Registered',
        message: `We will notify you before your document "${title}" expires on ${new Date(expiryDate).toLocaleDateString()}`,
        type: 'expiry'
      });
    }

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res) => {
  try {
    let doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (doc.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    doc = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (doc.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await doc.deleteOne();

    res.json({ success: true, message: 'Document removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument
};
