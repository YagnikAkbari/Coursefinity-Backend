const Course = require("../../model/course");

const uploadImage = async (req, res, next) => {
  const courseId = req.body.courseId;
  if (!req.file) {
    return res.status(400).send({
      code: 400,
      message: "File is Required!",
    });
  }
  if (!courseId) {
    return res.status(400).send({
      code: 400,
      message: "courseId is Required!",
    });
  }
  const imageUrl = req.file ? req.file.path : "";

  const response = await Course.findByIdAndUpdate(
    {
      _id: courseId,
    },
    { courseImageUrl: imageUrl },
    {
      new: true,
    }
  );

  if (response) {
    res.status(200).send({
      code: 200,
      message: "Image Uploaded Successfully.",
      data: response,
    });
  } else {
    res.status(404).send({
      code: 404,
      message: "Course Not Found.",
    });
  }
};

module.exports = { uploadImage };
