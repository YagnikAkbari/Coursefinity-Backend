const Instructor = require("../../model/instructor");

const checkInstructor = async (req, res, next) => {
  console.log("instructor middleware trigger");
  if (!req.session.instructor) {
    return res.status(401).send({ message: "Unauthenticated." });
  }

  try {
    const instructor = await Instructor.findById(req.session.instructor);
    if (!instructor) {
      res.clearCookie("coursefinity.sid", { path: "/" });
      return res.status(404).send({ message: "Instructor not found" });
    }
    req.instructor = instructor;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkInstructor;
