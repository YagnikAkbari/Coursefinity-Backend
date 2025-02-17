const jwt = require("jsonwebtoken");
const Instructor = require("../../model/instructor");

const checkInstructor = async (req, res, next) => {
  try {

    const token = req.headers?.authorization?.split(" ")[1] ?? null;
    if (!token) {
      return res.status(401).send({ message: "Unauthenticated." });
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!user?.id) {
      return res.status(401).send({ message: "Unauthenticated." });
    }

    const instructor = await Instructor.findOne({ email: user?.email });
    if (!instructor) {
      return res.status(404).send({ message: "Instructor not found" });
    }
    
    req.instructor = instructor;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkInstructor;
