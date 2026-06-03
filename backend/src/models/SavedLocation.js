const mongoose = require('mongoose');

const savedLocationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    buildingId: {
      type: String,
      required: [true, 'Building id (slug) is required'],
      lowercase: true,
      trim: true,
    },
    list: {
      type: String,
      required: [true, 'List category is required'],
      trim: true,
      enum: ['Study', 'Food', 'Outdoor', 'Other'],
    },
  },
  {
    timestamps: { createdAt: 'savedAt', updatedAt: true },
  }
);

// Remove __v from JSON output (match Building model style)
savedLocationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('SavedLocation', savedLocationSchema);