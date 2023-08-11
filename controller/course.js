const Course = require("../model/course");
const mongoose = require("mongoose");

exports.getCourses = (req, res, next) => {
  Course.find()
    .then((courses) => {
      return res.status(200).send({ message: courses });
    })
    .catch((err) => {
      console.error("Failed to find Courses", err);
      res.status(500).send({ message: "Error while fetching courses." });
    });
};

exports.getCourseById = async (req, res, next) => {
  try {
    const courseId = req.body.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).send({ message: "Invalid course ID format." });
    }

    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).send({ message: "Course not found." });
    }

    return res.status(200).send({ message: course });
  } catch (err) {
    console.error("Error fetching course by ID:", err);
    return res
      .status(500)
      .send({ message: "Error while fetching course by ID." });
  }
};
