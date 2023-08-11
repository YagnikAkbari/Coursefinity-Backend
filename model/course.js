const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseTitle: {
    type: String,
    required: true,
  },

  courseDescription: {
    type: String,
    required: true,
  },

  courseAuthor: {
    type: Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },

  courseImageUrl: {
    type: String,
    required: true,
  },

  courseIntroVideoUrl: {
    type: String,
    required: true,
  },

  courseTotalQuiz: {
    type: Number,
    required: true,
  },

  courseTotalAssignment: {
    type: Number,
    required: true,
  },

  coursePrice: {
    type: Number,
    required: true,
  },

  courseLanguage: {
    type: String,
    required: true,
  },

  courseDuration: {
    type: Number,
    required: true,
  },

  courseCategory: {
    type: String,
    required: true,
  },

  courseAuthorImage: {
    type: String,
    required: true,
  },

  courseModules: [
    {
      moduleTitle: {
        type: String,
        required: true,
      },
      moduleDescription: {
        type: String,
        required: true,
      },
      moduleDuration: {
        type: String,
        required: true,
      },
      moduleType: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
