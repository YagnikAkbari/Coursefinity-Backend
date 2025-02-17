const jwt = require("jsonwebtoken");
const learner = require("../../model/learner");

const checkLearner = async (req, res, next) => {
  try {
    
    const token = req.headers?.authorization?.split(" ")[1] ?? null;
    if (!token) {
      return res.status(401).send({ message: "Unauthenticated." });
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!user?.id) {
      return res.status(401).send({ message: "Unauthenticated." });
    }
    const student = await learner.findOne({ email: user?.email });
    if (!student) {
      return res.status(401).send({ message: "Unauthenticated." });
    }
    
    req.learner = student;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkLearner };
