const express = require("express");
const router = express.Router();
const courseController = require("../controller/course");
const authController = require("../controller/auth");
const multer = require("multer");
const path = require("path");
const common = require("../middlewares/index");

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
