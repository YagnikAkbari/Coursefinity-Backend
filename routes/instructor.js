const express = require("express");
const router = express.Router();
const courseController = require("../controller/course");
const authController = require("../controller/auth");
const multer = require("multer");
const path = require("path");
const { uploadImage } = require("../controller/upload/image");
const common = require("../middlewares/index");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get(
  "/mycreatedcourses",
  common.roleBasedMiddleware("instructor"),
  courseController.getUserCreatedCourses
);
router.post(
  "/createCourse",
  common.roleBasedMiddleware("instructor"),
  courseController.createCourse
);
router.post(
  "/uploadThumbnail",
  common.roleBasedMiddleware("instructor"),
  upload.single("image"),
  uploadImage
);
router.delete(
  "/deletecourse/:id",
  common.roleBasedMiddleware("instructor"),
  courseController.deleteCourse
);
router.get(
  "/instructorDetails",
  common.roleBasedMiddleware("instructor"),
  authController.getInstructorDetails
);

module.exports = router;
