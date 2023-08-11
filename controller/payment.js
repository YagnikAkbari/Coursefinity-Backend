// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51NdZ2MSHE4fCvIOP5lHpHlFNjafdRxAXShEa3mEJ7rOmJTf492HcZwra4EzM2OyQDHlMzHJK2p65ELrNnM8kBqxk00jtrxVDsU"
);

exports.payment = async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: items * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
