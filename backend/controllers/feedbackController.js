const Feedback = require("../models/Feedback");

const {
  uploadImageBuffer,
  deleteCloudinaryImage,
} = require("../utils/cloudinaryUpload");

exports.createFeedback = async (req, res) => {
  let uploadedPublicId = null;

  try {
    const {
      fileName,
      predictedClass,
      isCorrect,
      correctClass,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Feedback image is required",
      });
    }

    if (!predictedClass) {
      return res.status(400).json({
        success: false,
        message: "Predicted class is required",
      });
    }

    if (
      isCorrect !== "true" &&
      isCorrect !== "false"
    ) {
      return res.status(400).json({
        success: false,
        message: "isCorrect must be true or false",
      });
    }

    const feedbackIsCorrect =
      isCorrect === "true";

    if (!feedbackIsCorrect && !correctClass) {
      return res.status(400).json({
        success: false,
        message:
          "Correct class is required when prediction is incorrect",
      });
    }

    const finalCorrectClass =
      feedbackIsCorrect
        ? predictedClass
        : correctClass;

    const safeClassName =
      finalCorrectClass.replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      );

    const uploadResult =
      await uploadImageBuffer(
        req.file.buffer,
        `oil-adulteration-feedback/${safeClassName}`
      );

    uploadedPublicId = uploadResult.public_id;

    const feedback = await Feedback.create({
      originalFileName:
        fileName || req.file.originalname,

      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,

      predictedClass,
      isCorrect: feedbackIsCorrect,
      correctClass: finalCorrectClass,
    });

    return res.status(201).json({
      success: true,
      message:
        "Feedback image uploaded and metadata saved successfully",
      feedback,
    });
  } catch (error) {
    console.error(
      "Create feedback error:",
      error
    );

    /*
      Cloudinary upload झाला पण MongoDB save fail झाला,
      तर orphan image delete करतो.
    */
    if (uploadedPublicId) {
      try {
        await deleteCloudinaryImage(
          uploadedPublicId
        );
      } catch (deleteError) {
        console.error(
          "Cloudinary rollback failed:",
          deleteError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to save feedback",
    });
  }
};

exports.getAllFeedback = async (
  req,
  res
) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error(
      "Get feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load feedback",
    });
  }
};

exports.updateFeedbackStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending-verification",
      "approved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback status",
      });
    }

    const feedback =
      await Feedback.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Feedback status updated successfully",
      feedback,
    });
  } catch (error) {
    console.error(
      "Update feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update feedback status",
    });
  }
};

exports.deleteFeedback = async (
  req,
  res
) => {
  try {
    const feedback =
      await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    await deleteCloudinaryImage(
      feedback.imagePublicId
    );

    await feedback.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete feedback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete feedback",
    });
  }
};