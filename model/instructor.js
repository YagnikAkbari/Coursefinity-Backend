const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authInstructorSchema = new Schema({
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

  myCourses: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Instructor", authInstructorSchema);
