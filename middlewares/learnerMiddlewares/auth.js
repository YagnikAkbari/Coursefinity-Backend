const jwt = require("jsonwebtoken");
const learner = require("../../model/learner");

const checkLearner = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1] ?? null;
    if (!token) {
      return res.status(401).send({ message: "Unauthenticated." });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        if (err?.name === "TokenExpiredError") {
          return res.status(401).json({ message: "JWT expired" });
        }
        return res
          .status(403)
          .json({ message: "Failed to authenticate token" });
      }
      if (!decode?.id) {
        return res.status(401).send({ message: "Unauthenticated." });
      }
      const student = await learner.findOne({ email: decode?.email });
      if (!student) {
        return res.status(401).send({ message: "Unauthenticated." });
      }
      req.learner = student;
      next();
    });
  } catch (error) {
    console.log("errorerror", error);

    next(error);
  }
};

module.exports = { checkLearner };
