const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const common = require("../middlewares/index");

router.post("/learnerSignUp", authController.learnerSignUp);
router.post("/learnerSignIn", authController.learnerSignIn);
router.post("/instructorSignUp", authController.instructorSignUp);
router.post("/instructorSignIn", authController.instructorSignIn);
router.post("/resetEmail", authController.sendResetPasswordMail);
router.post("/resetPassword", authController.resetUserPassword);

router.post("/logout", authController.postLogout);

router.get(
  "/userDetails",
  common.roleBasedMiddleware("learner"),
  authController.getUserDetails
);
router.get("/check/auth", authController.checkAuth);

module.exports = router;
