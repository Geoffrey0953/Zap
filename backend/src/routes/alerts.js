const express = require('express');
const router = express.Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require('../controllers/alertController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET /api/alerts — public; query ?active=true optional
router.get('/', getAll);

// GET /api/alerts/:id — public
router.get('/:id', getOne);

// POST /api/alerts — admin only
router.post('/', verifyToken, requireAdmin, create);

// PUT /api/alerts/:id — admin only
router.put('/:id', verifyToken, requireAdmin, update);

// DELETE /api/alerts/:id — admin only
router.delete('/:id', verifyToken, requireAdmin, remove);

module.exports = router;