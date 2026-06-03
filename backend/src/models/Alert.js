const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: {
        values: ['info', 'warning', 'success'],
        message: 'Alert type must be info, warning, or success.',
      },
      required: [true, 'Alert type is required'],
    },
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Remove __v from JSON output
alertSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Alert', alertSchema);