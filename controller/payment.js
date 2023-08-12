const Course = require("../model/course");
const stripe = require("stripe")(
  "sk_test_51NdZ2MSHE4fCvIOP5lHpHlFNjafdRxAXShEa3mEJ7rOmJTf492HcZwra4EzM2OyQDHlMzHJK2p65ELrNnM8kBqxk00jtrxVDsU"
);

exports.payment = async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findOne({ _id: courseId });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: course.coursePrice * 80 * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
