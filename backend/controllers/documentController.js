// Helper to format Supabase document to expected frontend shape
const formatDocument = (d) => {
  return {
    _id: d.id,
    id: d.id,
    owner: d.user_id,
    title: d.title,
    category: d.category,
    fileName: d.file_name,
    fileUrl: d.file_url,
    expiryDate: d.expiry_date,
    notes: d.notes,
    createdAt: d.created_at
  };
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const { data: docs, error } = await req.supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const formatted = docs.map(formatDocument);
    res.json({ success: true, count: formatted.length, data: formatted });
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
      const { count, error: countError } = await req.supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        return res.status(400).json({ success: false, message: countError.message });
      }

      if (count >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan limit reached (Max 2 documents). Please upgrade to Premium for unlimited storage.'
        });
      }
    }

    const { data: doc, error } = await req.supabase
      .from('documents')
      .insert({
        user_id: req.user.id,
        title,
        category,
        file_name: fileName,
        file_url: `/uploads/${fileName}`, // Simulated path
        expiry_date: expiryDate || null,
        notes: notes || ''
      })
      .select('*')
      .single();

    if (error || !doc) {
      return res.status(400).json({ success: false, message: error?.message || 'Failed to create document' });
    }

    // Create notifications for expiration alert if expiryDate is set & audit log
    if (expiryDate) {
      await req.supabase.from('notifications').insert({
        user_id: req.user.id,
        title: 'Document Expiry Registered',
        message: `We will notify you before your document "${title}" expires on ${new Date(expiryDate).toLocaleDateString()}`,
        type: 'expiry'
      });
    }

    await req.supabase.from('audit_logs').insert({
      user_id: req.user.id,
      action: `Created Document ${title}`
    });

    res.status(201).json({ success: true, data: formatDocument(doc) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res) => {
  const { title, category, fileName, expiryDate, notes } = req.body;

  try {
    const { data: doc, error } = await req.supabase
      .from('documents')
      .update({
        title,
        category,
        file_name: fileName,
        expiry_date: expiryDate || null,
        notes: notes || ''
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !doc) {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized' });
    }

    res.json({ success: true, data: formatDocument(doc) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('documents')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

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
