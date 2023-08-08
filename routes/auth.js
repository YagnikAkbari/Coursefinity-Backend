const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

router.post("/learnerSignUp", authController.learnerSignUp);
router.post("/learnerSignIn", authController.learnerSignIn);
router.post("/instructorSignUp", authController.instructorSignUp);
router.post("/instructorSignIn", authController.instructorSignIn);
router.post("/logout", authController.postLogout);

module.exports = router;
