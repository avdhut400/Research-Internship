const express = require("express");

const multer = require("multer");
const userAuth = require("../middleware/userAuth");
const predictionController =
require("../controllers/predictController");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage
});

router.post(
    "/",
    userAuth,
    upload.single("image"),
    predictionController.predict
);

module.exports = router;