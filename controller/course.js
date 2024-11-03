const Course = require("../model/course");
const mongoose = require("mongoose");
const Learner = require("../model/learner");
const Instructor = require("../model/instructor");

exports.getCourses = (req, res, next) => {
  Course.find()
    .then((courses) => {
      return res
        .status(200)
        .send({ data: courses, message: "Course Fetched Succesfully." });
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

exports.postFavouriteCourse = async (req, res, next) => {
  try {
    const loggedInUserId = req.session.learner;

    const { courseId } = req.body;

    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

    const updatedUser = await Learner.findByIdAndUpdate(
      loggedInUserId,
      { $addToSet: { favouriteCourses: courseId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(201).send({ message: "Added to favourite" });
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: "Error processing request" });
  }
};

exports.getUserCourses = async (req, res, next) => {
  try {
    const userId = req.session.learner._id;

    const response = await Learner.findById(userId).populate("myCourses");

    res.status(200).send({
      message: "User Purchasd Course Successfully.",
      data: response?.myCourses,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUserCreatedCourses = async (req, res, next) => {
  try {
    const instructorId = req.session.instructor._id;
    const response = await Instructor.find({ _id: instructorId }).populate(
      "myCourses"
    );

    const myCourseList = response[0].myCourses;

    res
      .status(200)
      .send({ data: myCourseList, message: "Data Fetched Successfully." });
  } catch (err) {
    console.log(err);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const data = req.body;

    const session_instructor = req.session.instructor;
    const modules = data.courseModules;

    const course = new Course({
      courseTitle: data.courseTitle,
      courseAuthor: session_instructor,
      courseImageUrl: "",
      coursePrice: data.coursePrice,
      courseDescription: data.courseDescription,
      courseLanguage: data.courseLanguage,
      courseDuration: data.courseDuration,
      courseModules: modules,
      courseCategory: data.courseCategory,
      courseAuthorImage:
        "https://images.unsplash.com/photo-1692182549439-2a78c119dc40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60",
      courseAuthorName: session_instructor.name,
      courseIntroVideoUrl: "Introducing FigJam AI.mp4",
    });

    const result = await course.save();
    console.log("Course uploaded!.");
    if (result) {
      const recentCourseId = result._id;
      const updatedUser = await Instructor.findByIdAndUpdate(
        session_instructor._id,
        { $addToSet: { myCourses: recentCourseId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
      }

      return res
        .status(201)
        .send({ message: "Added to my Course!", courseId: result._id });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({ message: "Error processing new course!" });
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const session_instructor_id = req.session.instructor._id;
    const courseId = req.body.id;
    const instructor = await Instructor.findOne({ _id: session_instructor_id });

    if (!instructor) {
      return res.status(404).send({ message: "Instructor not found." });
    }

    const courseIndex = instructor.myCourses.indexOf(courseId);

    if (courseIndex === -1) {
      return res
        .status(404)
        .send({ message: "Course not found in instructor's myCourses." });
    }

    instructor.myCourses.splice(courseIndex, 1);

    await instructor.save();

    response = await Course.updateOne(
      { _id: courseId },
      {
        deletedAt: Date.now(),
      }
    );

    if (response?.modifiedCount === 1) {
      res.status(200).send({ message: "Course deleted successfully." });
      return;
    } else {
      return res.status(404).send({ message: "Course not found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

exports.getFavouriteCourse = async (req, res, next) => {
  try {
    const learnerId = req.session.learner._id;
    const response = await Learner.find({ _id: learnerId }).populate(
      "favouriteCourses"
    );
    const favouriteCourseList = response[0].favouriteCourses;

    res.status(200).send({
      data: favouriteCourseList,
      message: "Favourite Course Fetched Successfully.",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getFavouriteCourseIds = async (req, res, next) => {
  try {
    const learnerId = req.session.learner._id;
    const response = await Learner.find({ _id: learnerId });
    const favouriteCourseList = response[0].favouriteCourses;

    res.status(200).send({
      data: favouriteCourseList,
      message: "Favourite Course IDs Fetched Successfully.",
    });
  } catch (err) {
    console.log(err);
  }
};
