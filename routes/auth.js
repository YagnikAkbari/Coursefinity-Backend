const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const common = require("../middlewares/index");

console.log("Time auth", Date.now());
router.post("/learnerSignUp", authController.learnerSignUp);
router.post("/learnerSignIn", authController.learnerSignIn);
router.post("/instructorSignUp", authController.instructorSignUp);
router.post("/instructorSignIn", authController.instructorSignIn);

router.post("/logout", authController.postLogout);

router.get(
  "/userDetails",
  common.roleBasedMiddleware("learner"),
  authController.getUserDetails
);

module.exports = router;
