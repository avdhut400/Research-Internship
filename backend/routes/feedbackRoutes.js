const express = require("express");
const multer = require("multer");

const {
  createFeedback,
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} = require(
  "../controllers/feedbackController"
);
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    callback
  ) => {
    if (!allowedTypes.includes(file.mimetype)) {
      callback(
        new Error(
          "Only JPEG, PNG and WEBP images are allowed"
        )
      );

      return;
    }

    callback(null, true);
  },
});

router.post(
  "/",
  upload.single("image"),
  createFeedback
);

router.get("/", adminAuth, getAllFeedback);

router.patch(
  "/:id/status",
  adminAuth,
  updateFeedbackStatus
);

router.delete(
  "/:id",
  adminAuth,
  deleteFeedback
);

module.exports = router;