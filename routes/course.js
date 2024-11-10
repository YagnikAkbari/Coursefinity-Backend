const express = require("express");
const router = express.Router();
const courseController = require("../controller/course");
const common = require("../middlewares/index");

router.get("/courseList", courseController.getCourses);
router.get("/course/:id", courseController.getCourseById);

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

router.delete(
  "/removefavouriteCourse/:id",
  common.roleBasedMiddleware("learner"),
  courseController.removeFavouriteCourse
);

module.exports = router;
