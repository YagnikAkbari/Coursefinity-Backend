const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authlearnerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  favouriteCourses: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
  ],

  myCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
  ],
});

module.exports = mongoose.model("Learner", authlearnerSchema);
