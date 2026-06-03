const express = require('express');
const router = express.Router();
const {
  getSaved,
  addSaved,
  removeSaved,
} = require('../controllers/savedLocationController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// GET /api/saved — current user's saved locations with building details
router.get('/', getSaved);

// POST /api/saved — save a building to a list
router.post('/', addSaved);

// DELETE /api/saved/:id — remove a saved location (owner only)
router.delete('/:id', removeSaved);

module.exports = router;