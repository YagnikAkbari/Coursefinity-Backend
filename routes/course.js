const express = require("express");
const router = express.Router();
const courseController = require("../controller/course");

router.get("/courseList", courseController.getCourses);
router.post("/courseById", courseController.getCourseById);

module.exports = router;
