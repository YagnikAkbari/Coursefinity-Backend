const Course = require("../model/course");
const mongoose = require("mongoose");
const Learner = require("../model/learner");
const Instructor = require("../model/instructor");

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();

    // Successful response with courses data
    return res.status(200).send({
      code: 200,
      data: courses,
      message: "Courses fetched successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      code: 500,
      message:
        "An error occurred while fetching courses. Please try again later.",
    });
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const courseId = req?.params?.id ?? null;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(404)
        .send({ code: 404, message: "Invalid course ID format." });
    }

    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).send({ code: 404, message: "Course not found." });
    }

    return res.status(200).send({
      data: course,
      message: "Course Fetched Successfully.",
      code: 200,
    });
  } catch (err) {
    console.error("Error fetching course by ID:", err);
    return res
      .status(500)
      .send({ message: "Error while fetching course by ID." });
  }
};

exports.postFavouriteCourse = async (req, res, next) => {
  try {
    const loggedInUserId = req.learner;

    const { courseId } = req.body;

    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).send({ code: 404, message: "Course not found" });
    }

    await Learner.findByIdAndUpdate(
      loggedInUserId,
      { $addToSet: { favouriteCourses: courseId } },
      { new: true }
    );

    res.status(201).send({ message: "Added to favourite", code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error processing request" });
  }
};

exports.removeFavouriteCourse = async (req, res, next) => {
  try {
    const loggedInUserId = req.learner;
    const courseId = req?.params?.id ?? null;

    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).send({ code: 404, message: "Course not found" });
    }

    await Learner.findByIdAndUpdate(
      loggedInUserId,
      { $pull: { favouriteCourses: courseId } },
      { new: true }
    );

    res.status(200).send({ message: "Removed from favorites", code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error processing request" });
  }
};

exports.getUserCourses = async (req, res, next) => {
  try {
    const userId = req.learner._id;

    const response = await Learner.findById(userId).populate("myCourses");

    res.status(200).send({
      code: 200,
      message: "User Purchasd Course Successfully.",
      data: response?.myCourses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error processing request" });
  }
};

exports.getUserCreatedCourses = async (req, res, next) => {
  try {
    const instructorId = req?.instructor._id;
    const response = await Instructor.find({ _id: instructorId }).populate(
      "myCourses"
    );

    const myCourseList = response[0].myCourses;

    res.status(200).send({
      code: 200,
      data: myCourseList,
      message: "Data Fetched Successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error processing request" });
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const data = req.body;

    const session_instructor = req?.instructor;
    const modules = data.courseModules;

    const course = new Course({
      courseTitle: data.courseTitle,
      courseAuthor: session_instructor,
      courseImageUrl: data.courseImageUrl,
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
      await Instructor.findByIdAndUpdate(
        session_instructor._id,
        { $addToSet: { myCourses: recentCourseId } },
        { new: true }
      );

      return res.status(201).send({
        code: 201,
        message: "Added to my Course!",
        courseId: result._id,
      });
    } else {
      const error = new Error("Error Creating Courses.");
      error.code = "NOT_FOUND_ERROR";
      throw error;
    }
  } catch (err) {
    if (err?.code === "NOT_FOUND_ERROR") {
      return res.status(404).send({ code: 404, message: err?.message });
    }
    res.status(500).send({ message: "Error processing new course!" });
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const session_instructor_id = req?.instructor._id;
    const courseId = req.params.id;
    const instructor = await Instructor.findOne({ _id: session_instructor_id });

    const courseIndex = instructor?.myCourses?.indexOf(courseId);

    if (courseIndex === -1) {
      return res.status(404).send({
        code: 404,
        message: "Course not found in instructor's created Courses.",
      });
    }

    instructor?.myCourses?.splice(courseIndex, 1);

    await instructor.save();

    const response = await Course.updateOne(
      { _id: courseId },
      {
        deletedAt: Date.now(),
      }
    );

    if (response?.modifiedCount === 1) {
      return res
        .status(200)
        .send({ code: 200, message: "Course deleted successfully." });
    } else {
      return res.status(404).send({ code: 404, message: "Course not Found!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

exports.getFavouriteCourse = async (req, res, next) => {
  try {
    const learnerId = req.learner._id;
    const response = await Learner.find({ _id: learnerId }).populate(
      "favouriteCourses"
    );
    const favouriteCourseList = response[0].favouriteCourses;

    res.status(200).send({
      code: 200,
      data: favouriteCourseList,
      message: "Favourite Course Fetched Successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

exports.getFavouriteCourseIds = async (req, res, next) => {
  try {
    const learnerId = req.learner._id;
    const response = await Learner.find({ _id: learnerId });
    const favouriteCourseList = response[0].favouriteCourses;

    res.status(200).send({
      code: 200,
      data: favouriteCourseList,
      message: "Favourite Course IDs Fetched Successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error." });
  }
};
