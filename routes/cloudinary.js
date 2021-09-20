const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const { upload, remove } = require("../controllers/cloudinary");

router.post("/uploadImages", authCheck, adminCheck, upload);
router.post("/removeImage", authCheck, adminCheck, remove);

module.exports = router;
