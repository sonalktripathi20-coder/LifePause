const express = require('express');
const router = express.Router();
const {
  getVaultItems,
  createVaultItem,
  updateVaultItem,
  deleteVaultItem,
  toggleFavorite,
  toggleArchive
} = require('../controllers/vaultController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes

router.route('/')
  .get(getVaultItems)
  .post(createVaultItem);

router.route('/:id')
  .put(updateVaultItem)
  .delete(deleteVaultItem);

router.put('/:id/favorite', toggleFavorite);
router.put('/:id/archive', toggleArchive);

module.exports = router;
