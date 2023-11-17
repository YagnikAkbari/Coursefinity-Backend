const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseTitle: {
    type: String,
  },

  courseDescription: {
    type: String,
  },

  courseAuthor: {
    type: Schema.Types.ObjectId,
    ref: "Instructor",
  },

  courseImageUrl: {
    type: String,
  },

  courseIntroVideoUrl: {
    type: String,
  },

  coursePrice: {
    type: Number,
  },

  courseLanguage: {
    type: String,
  },

  courseDuration: {
    type: String,
  },

  courseCategory: {
    type: String,
  },

  courseAuthorImage: {
    type: String,
  },

  courseAuthorName: {
    type: String,
  },

  courseModules: [
    {
      moduleTitle: {
        type: String,
      },
      moduleDescription: {
        type: String,
      },
      moduleDuration: {
        type: String,
      },
      moduleType: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
