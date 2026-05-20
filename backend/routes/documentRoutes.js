const express = require('express');
const router = express.Router();
const {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes

router.route('/')
  .get(getDocuments)
  .post(createDocument);

router.route('/:id')
  .put(updateDocument)
  .delete(deleteDocument);

module.exports = router;
