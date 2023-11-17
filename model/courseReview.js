const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseReviewSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  reviewerName: {
    type: String,
    required: true,
  },

  reviewRating: {
    type: Number,
    required: true,
  },

  reviewText: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CourseReview", courseReviewSchema);
