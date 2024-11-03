const express = require("express");
const router = express.Router();
const courseController = require("../controller/course");
const common = require("../middlewares/index");

router.get("/courseList", courseController.getCourses);
router.post("/courseById", courseController.getCourseById);

router.post(
  "/addFavouriteCourse",
  common.roleBasedMiddleware("learner"),
  courseController.postFavouriteCourse
);
router.get(
  "/mycourses",
  common.roleBasedMiddleware("learner"),
  courseController.getUserCourses
);

router.get(
  "/favouriteCourseList",
  common.roleBasedMiddleware("learner"),
  courseController.getFavouriteCourse
);
router.get(
  "/favouriteCourseIdList",
  common.roleBasedMiddleware("learner"),
  courseController.getFavouriteCourseIds
);

module.exports = router;
