const Course = require("../../model/course");

const uploadImage = async (req, res, next) => {
  const imageUrl = req.file ? req.file.path : "";

  const courseId = req.body.courseId;

  const response = await Course.findByIdAndUpdate(
    {
      _id: courseId,
    },
    { courseImageUrl: imageUrl }
  );

  if (response) {
    res.status(200).send({
      message: "Image Uploaded Successfully.",
    });
  } else {
    console.log("Error");
  }
};

module.exports = { uploadImage };
