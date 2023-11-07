const Course = require("../model/course");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.payment = async (req, res) => {
  const { courseId, email } = req.body;

  const course = await Course.findOne({ _id: courseId });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: course.coursePrice * 80 * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      courseId,
      email,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
