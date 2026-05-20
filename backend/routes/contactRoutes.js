const express = require('express');
const router = express.Router();
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  verifyContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes

router.route('/')
  .get(getContacts)
  .post(createContact);

router.route('/:id')
  .put(updateContact)
  .delete(deleteContact);

router.put('/:id/verify', verifyContact);

module.exports = router;
