const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment");
const { checkLearner } = require("../middlewares/learnerMiddlewares/auth");

router.use(checkLearner);
router.post("/create-payment-intent", paymentController.payment);

module.exports = router;
