const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment");
const common = require("../middlewares/index");

router.post(
  "/create-payment-intent",
  common?.roleBasedMiddleware("learner"),
  paymentController.payment
);

module.exports = router;
