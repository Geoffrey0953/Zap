const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Building id (slug) is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Building name is required'],
      trim: true,
    },
    abbr: {
      type: String,
      required: [true, 'Building abbreviation is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    hours: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    departments: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Remove __v from JSON output (match User model style)
buildingSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Building', buildingSchema);