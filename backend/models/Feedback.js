const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      required: true,
      unique: true,
    },

    predictedClass: {
      type: String,
      required: true,
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      required: true,
    },

    correctClass: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending-verification",
        "approved",
        "rejected",
      ],
      default: "pending-verification",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Feedback",
  feedbackSchema
);