const express = require("express");
const router = express.Router();
const checkInstructor = require("../middlewares/instructorMiddlewares/auth");
const courseController = require("../controller/course");
const authController = require("../controller/auth");
const multer = require("multer");
const { uploadImage } = require("../controller/upload/image");

const upload = multer({ dest: "images/", fieldname: "image" });
router.use(checkInstructor);
router.get("/mycreatedcourses", courseController.getUserCreatedCourses);
router.post("/createCourse", courseController.createCourse);
router.post("/uploadThumbnail", upload.single("image"), uploadImage);
router.delete("/deletecourse", courseController.deleteCourse);
router.get("/instructorDetails", authController.getInstructorDetails);

module.exports = router;
