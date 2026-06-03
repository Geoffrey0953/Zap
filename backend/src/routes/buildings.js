const express = require('express');
const router = express.Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require('../controllers/buildingController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET /api/buildings — public
router.get('/', getAll);

// GET /api/buildings/:id — public
router.get('/:id', getOne);

// POST /api/buildings — admin only
router.post('/', verifyToken, requireAdmin, create);

// PUT /api/buildings/:id — admin only
router.put('/:id', verifyToken, requireAdmin, update);

// DELETE /api/buildings/:id — admin only
router.delete('/:id', verifyToken, requireAdmin, remove);

module.exports = router;