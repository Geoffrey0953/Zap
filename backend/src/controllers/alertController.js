const Alert = require('../models/Alert');

// ---------------------------------------------------------------------------
// GET /api/alerts — public; query ?active=true filters by active status
// ---------------------------------------------------------------------------
const getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.active === 'true') {
      filter.active = true;
    }
    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/alerts/:id — public
// ---------------------------------------------------------------------------
const getOne = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found.',
      });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// POST /api/alerts — requireAdmin
// ---------------------------------------------------------------------------
const create = async (req, res, next) => {
  try {
    const { type, title, message, active } = req.body;

    const missing = [];
    if (!type) missing.push('type');
    if (!title) missing.push('title');
    if (!message) missing.push('message');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}.`,
      });
    }

    const alert = await Alert.create({
      type,
      title,
      message,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// PUT /api/alerts/:id — requireAdmin (toggle active, edit fields)
// ---------------------------------------------------------------------------
const update = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found.',
      });
    }

    const { type, title, message, active } = req.body;

    if (type !== undefined) alert.type = type;
    if (title !== undefined) alert.title = title;
    if (message !== undefined) alert.message = message;
    if (active !== undefined) alert.active = active;

    await alert.save();

    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// DELETE /api/alerts/:id — requireAdmin
// ---------------------------------------------------------------------------
const remove = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found.',
      });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, update, remove };