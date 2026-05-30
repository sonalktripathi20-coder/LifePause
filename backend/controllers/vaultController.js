// Helper to format Supabase vault item to expected frontend shape
const formatVaultItem = (item) => {
  return {
    _id: item.id,
    id: item.id,
    owner: item.user_id,
    title: item.title,
    category: item.category,
    content: item.content,
    isFavorite: item.is_favorite,
    isArchived: item.is_archived,
    createdAt: item.created_at
  };
};

// @desc    Get all vault items for logged-in user
// @route   GET /api/vault
// @access  Private
const getVaultItems = async (req, res) => {
  try {
    const { data: items, error } = await req.supabase
      .from('vault_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const formatted = items.map(formatVaultItem);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new vault item
// @route   POST /api/vault
// @access  Private
const createVaultItem = async (req, res) => {
  const { title, category, content } = req.body;

  try {
    // Check subscription plan limits (enforced on Free plans)
    if (req.user.subscriptionPlan === 'Free') {
      const { count, error: countError } = await req.supabase
        .from('vault_items')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        return res.status(400).json({ success: false, message: countError.message });
      }

      if (count >= 5) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan limit reached (Max 5 vault items). Please upgrade to Premium for unlimited items.'
        });
      }
    }

    const { data: item, error } = await req.supabase
      .from('vault_items')
      .insert({
        user_id: req.user.id,
        title,
        category,
        content
      })
      .select('*')
      .single();

    if (error || !item) {
      return res.status(400).json({ success: false, message: error?.message || 'Failed to create vault item' });
    }

    res.status(201).json({ success: true, data: formatVaultItem(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vault item
// @route   PUT /api/vault/:id
// @access  Private
const updateVaultItem = async (req, res) => {
  try {
    // Read the fields from body
    const { title, category, content } = req.body;

    const { data: item, error } = await req.supabase
      .from('vault_items')
      .update({
        title,
        category,
        content
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !item) {
      return res.status(404).json({ success: false, message: 'Vault item not found or unauthorized' });
    }

    res.json({ success: true, data: formatVaultItem(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete vault item
// @route   DELETE /api/vault/:id
// @access  Private
const deleteVaultItem = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('vault_items')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: 'Vault item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite status
// @route   PUT /api/vault/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    // Get existing item status
    const { data: existing, error: fetchError } = await req.supabase
      .from('vault_items')
      .select('is_favorite')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, message: 'Vault item not found or unauthorized' });
    }

    const { data: item, error } = await req.supabase
      .from('vault_items')
      .update({
        is_favorite: !existing.is_favorite
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !item) {
      return res.status(400).json({ success: false, message: error?.message || 'Failed to toggle favorite' });
    }

    res.json({ success: true, data: formatVaultItem(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle archive status
// @route   PUT /api/vault/:id/archive
// @access  Private
const toggleArchive = async (req, res) => {
  try {
    // Get existing item status
    const { data: existing, error: fetchError } = await req.supabase
      .from('vault_items')
      .select('is_archived')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, message: 'Vault item not found or unauthorized' });
    }

    const { data: item, error } = await req.supabase
      .from('vault_items')
      .update({
        is_archived: !existing.is_archived
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !item) {
      return res.status(400).json({ success: false, message: error?.message || 'Failed to toggle archive' });
    }

    res.json({ success: true, data: formatVaultItem(item) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVaultItems,
  createVaultItem,
  updateVaultItem,
  deleteVaultItem,
  toggleFavorite,
  toggleArchive
};
