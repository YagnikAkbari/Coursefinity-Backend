const learner = require("../../model/learner");

const checkLearner = async (req, res, next) => {
  console.log("learner middleware trigger");

  if (!req.session.learner) {
    return res.status(401).send({ message: "Unauthenticated." });
  }

  try {
    const student = await learner.findById(req.session.learner);
    if (!student) {
      return res.status(404).send({ message: "Learner not found" });
    }
    req.learner = student;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkLearner };
