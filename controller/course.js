const Course = require("../model/course");

exports.getCourses = (req, res, next) => {
  Course.find()
    .then((courses) => {
      // console.log(courses);
      return res.status(200).send({ message: courses });
    })
    .catch((err) => {
      console.error("Failed to find Courses", err);
      res.status(500).send({ message: "Error while fetching courses." });
    });
};
