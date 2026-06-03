const SavedLocation = require('../models/SavedLocation');
const Building = require('../models/Building');

// ---------------------------------------------------------------------------
// GET /api/saved — current user's saved locations, populate building details
// ---------------------------------------------------------------------------
const getSaved = async (req, res, next) => {
  try {
    const saved = await SavedLocation.find({ userId: req.user._id })
      .sort({ savedAt: -1 })
      .lean();

    // Populate building details manually (since buildingId is a String, not ObjectId ref)
    const buildingIds = saved.map((s) => s.buildingId);
    const buildings = await Building.find({ id: { $in: buildingIds } }).lean();
    const buildingMap = {};
    buildings.forEach((b) => {
      buildingMap[b.id] = b;
    });

    const data = saved.map((s) => ({
      ...s,
      building: buildingMap[s.buildingId] || null,
    }));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// POST /api/saved — save a building to the user's list
// ---------------------------------------------------------------------------
const addSaved = async (req, res, next) => {
  try {
    const { buildingId, list } = req.body;

    // Validation
    if (!buildingId || !list) {
      return res.status(400).json({
        success: false,
        error: 'buildingId and list are required.',
      });
    }

    // Verify the building exists
    const building = await Building.findOne({ id: buildingId.toLowerCase() });
    if (!building) {
      return res.status(404).json({
        success: false,
        error: 'Building not found.',
      });
    }

    // Check for duplicate save (same user, same building, same list)
    const existing = await SavedLocation.findOne({
      userId: req.user._id,
      buildingId: buildingId.toLowerCase(),
      list,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'This building is already saved to that list.',
      });
    }

    const saved = await SavedLocation.create({
      userId: req.user._id,
      buildingId: buildingId.toLowerCase(),
      list,
    });

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// DELETE /api/saved/:id — owner only
// ---------------------------------------------------------------------------
const removeSaved = async (req, res, next) => {
  try {
    const saved = await SavedLocation.findById(req.params.id);

    if (!saved) {
      return res.status(404).json({
        success: false,
        error: 'Saved location not found.',
      });
    }

    // Check ownership
    if (saved.userId.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own saved locations.',
      });
    }

    await saved.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSaved, addSaved, removeSaved };