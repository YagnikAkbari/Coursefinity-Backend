const express = require("express");
const multer = require("multer");
const router = express.Router();
const { uploadAsset } = require("../controller/upload/assets");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post("/upload/assets", upload.single("image"), uploadAsset);
module.exports = router;
