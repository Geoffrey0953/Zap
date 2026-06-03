const Building = require('../models/Building');

// ---------------------------------------------------------------------------
// GET /api/buildings — public, return all buildings
// ---------------------------------------------------------------------------
const getAll = async (req, res, next) => {
  try {
    const buildings = await Building.find().sort({ name: 1 });
    res.json({ success: true, count: buildings.length, data: buildings });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// GET /api/buildings/:id — public, return single building by slug
// ---------------------------------------------------------------------------
const getOne = async (req, res, next) => {
  try {
    const building = await Building.findOne({ id: req.params.id });
    if (!building) {
      return res.status(404).json({
        success: false,
        error: 'Building not found.',
      });
    }
    res.json({ success: true, data: building });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// POST /api/buildings — requireAdmin
// ---------------------------------------------------------------------------
const create = async (req, res, next) => {
  try {
    const { id, name, abbr, category, lat, lng, hours, description, departments, image } = req.body;

    // Validation — required fields
    const missing = [];
    if (!name) missing.push('name');
    if (!abbr) missing.push('abbr');
    if (!category) missing.push('category');
    if (lat == null) missing.push('lat');
    if (lng == null) missing.push('lng');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}.`,
      });
    }

    // Auto-generate id slug from name if not provided
    const buildingId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check for duplicate id
    const existing = await Building.findOne({ id: buildingId });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Building with id "${buildingId}" already exists.`,
      });
    }

    const building = await Building.create({
      id: buildingId,
      name,
      abbr,
      category,
      lat,
      lng,
      hours: hours || '',
      description: description || '',
      departments: departments || [],
      image: image || null,
    });

    res.status(201).json({ success: true, data: building });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// PUT /api/buildings/:id — requireAdmin
// ---------------------------------------------------------------------------
const update = async (req, res, next) => {
  try {
    const building = await Building.findOne({ id: req.params.id });
    if (!building) {
      return res.status(404).json({
        success: false,
        error: 'Building not found.',
      });
    }

    const { name, abbr, category, lat, lng, hours, description, departments, image } = req.body;

    // Validate required fields if provided
    if (name !== undefined && !name) {
      return res.status(400).json({ success: false, error: 'name cannot be empty.' });
    }
    if (abbr !== undefined && !abbr) {
      return res.status(400).json({ success: false, error: 'abbr cannot be empty.' });
    }
    if (category !== undefined && !category) {
      return res.status(400).json({ success: false, error: 'category cannot be empty.' });
    }
    if (lat !== undefined && lat == null) {
      return res.status(400).json({ success: false, error: 'lat cannot be null.' });
    }
    if (lng !== undefined && lng == null) {
      return res.status(400).json({ success: false, error: 'lng cannot be null.' });
    }

    // Update only provided fields
    if (name !== undefined) building.name = name;
    if (abbr !== undefined) building.abbr = abbr;
    if (category !== undefined) building.category = category;
    if (lat !== undefined) building.lat = lat;
    if (lng !== undefined) building.lng = lng;
    if (hours !== undefined) building.hours = hours;
    if (description !== undefined) building.description = description;
    if (departments !== undefined) building.departments = departments;
    if (image !== undefined) building.image = image;

    await building.save();

    res.json({ success: true, data: building });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// DELETE /api/buildings/:id — requireAdmin
// ---------------------------------------------------------------------------
const remove = async (req, res, next) => {
  try {
    const building = await Building.findOneAndDelete({ id: req.params.id });
    if (!building) {
      return res.status(404).json({
        success: false,
        error: 'Building not found.',
      });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, update, remove };