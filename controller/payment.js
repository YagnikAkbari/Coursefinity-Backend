const Course = require("../model/course");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.payment = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).send({ code: 404, message: "Course not found!" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.coursePrice * 80 * 100,
      currency: "inr",
      description: "This Is Indian Payment Method",
      automatic_payment_methods: {
        enabled: true,
      },
      shipping: {
        name: 'Yagnik Akbari',
        address: {
          line1: 'Chandralock Society',
          postal_code: '380052',
          city: 'Ahmedabad',
          state: 'GJ',
          country: 'IN',
        },
      },
      // add details to define different users seprately (email, username, other data.)
      metadata: {
        courseId,        
      },
    });

    res.status(200).send({
      code: 200,
      data: {
        clientSecret: paymentIntent.client_secret,
      },
      message: "Payment intent successfully.",
    });
  } catch (err) {
    console.log(err);
  }
};
