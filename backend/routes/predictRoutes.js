const express = require("express");

const multer = require("multer");

const predictionController =
require("../controllers/predictController");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage
});

router.post(
    "/",
    upload.single("image"),
    predictionController.predict
);

module.exports = router;