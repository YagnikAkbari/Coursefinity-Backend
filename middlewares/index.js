const checkInstructor = require("./instructorMiddlewares/auth");
const { checkLearner } = require("./learnerMiddlewares/auth");

exports.roleBasedMiddleware = function roleBasedMiddleware(role) {
  return (req, res, next) => {
    if (role === "learner") {
      return checkLearner(req, res, next);
    } else if (role === "instructor") {
      return checkInstructor(req, res, next);
    } else {
      return res.status(403).json({ error: "Access denied" });
    }
  };
};
