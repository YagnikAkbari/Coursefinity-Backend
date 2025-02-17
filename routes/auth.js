const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const common = require("../middlewares/index");
const Joi = require("joi");
const validateResetPasswordMail = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid("learner", "instructor").required(),
  });

  const { error } = schema.validate(
    { email: req.body.email, role: req.query.role },
    { abortEarly: false }
  );

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((err) => err.message),
    });
  }
  next();
};

router.post("/learnerSignUp", authController.learnerSignUp);
router.post("/learnerSignIn", authController.learnerSignIn);
router.post("/instructorSignUp", authController.instructorSignUp);
router.post("/instructorSignIn", authController.instructorSignIn);
router.post(
  "/resetEmail",
  validateResetPasswordMail,
  authController.sendResetPasswordMail
);
router.post("/resetPassword", authController.resetUserPassword);

router.post("/logout", authController.postLogout);

router.get(
  "/userDetails",
  common.roleBasedMiddleware("learner"),
  authController.getUserDetails
);

module.exports = router;
