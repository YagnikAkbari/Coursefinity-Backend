const Course = require("../model/course");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.payment = async (req, res) => {
  try{
    const { courseId } = req.body;

  const course = await Course.findOne({ _id: courseId });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: course.coursePrice * 80 * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    // add details to define different users seprately (email, username, other data.)
    metadata: {
      courseId,
    },
  });

  res.status(200).send({
    data: {
      clientSecret: paymentIntent.client_secret,
    },
    message: "Payment intent successfully.",
  });
  }catch (err) {
    console.log(err);
  }
};
