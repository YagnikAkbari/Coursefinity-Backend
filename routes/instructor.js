const express = require("express");
const router = express.Router();
const checkInstructor = require("../middlewares/instructorMiddlewares/auth");
const courseController = require("../controller/course");
const authController = require("../controller/auth");
const multer = require("multer");
const { uploadImage } = require("../controller/upload/image");
const common = require("../middlewares/index");

const upload = multer({ dest: "images/", fieldname: "image" });

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
  "/deletecourse",
  common.roleBasedMiddleware("instructor"),
  courseController.deleteCourse
);
router.get(
  "/instructorDetails",
  common.roleBasedMiddleware("instructor"),
  authController.getInstructorDetails
);

module.exports = router;
