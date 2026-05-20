const VaultItem = require('../models/VaultItem');
const User = require('../models/User');

// @desc    Get all vault items for logged-in user
// @route   GET /api/vault
// @access  Private
const getVaultItems = async (req, res) => {
  try {
    const items = await VaultItem.find({ owner: req.user._id });
    res.json({ success: true, count: items.length, data: items });
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
    // Check subscription plan limits
    if (req.user.subscriptionPlan === 'Free') {
      const count = await VaultItem.countDocuments({ owner: req.user._id });
      if (count >= 5) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan limit reached (Max 5 vault items). Please upgrade to Premium for unlimited items.'
        });
      }
    }

    const item = await VaultItem.create({
      owner: req.user._id,
      title,
      category,
      content
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vault item
// @route   PUT /api/vault/:id
// @access  Private
const updateVaultItem = async (req, res) => {
  try {
    let item = await VaultItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Vault item not found' });
    }

    // Verify ownership
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    item = await VaultItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete vault item
// @route   DELETE /api/vault/:id
// @access  Private
const deleteVaultItem = async (req, res) => {
  try {
    const item = await VaultItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Vault item not found' });
    }

    // Verify ownership
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await item.deleteOne();

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
    const item = await VaultItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Vault item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    item.isFavorite = !item.isFavorite;
    await item.save();

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle archive status
// @route   PUT /api/vault/:id/archive
// @access  Private
const toggleArchive = async (req, res) => {
  try {
    const item = await VaultItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Vault item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    item.isArchived = !item.isArchived;
    await item.save();

    res.json({ success: true, data: item });
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
