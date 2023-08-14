const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Learner = require("./model/learner");
const Instructor = require("./model/instructor");
const path = require("path");

require("dotenv").config();

mongoose.set("strictQuery", false);
const app = express();

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const paymentRoutes = require("./routes/payment");

const store = new MongoDBStore({
  collection: "sessions",
  uri: process.env.MONGODB_URL,
});
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;
    // Otherwise use the basic event deserialized with JSON.parse
    if (process.env.ENDPOINT_SECRET) {
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          process.env.ENDPOINT_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(paymentIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    response.send();
  }
);

app.use(express.static(path.resolve(__dirname, "build")));

app.use(express.json());
app.use(
  session({
    secret: "My Secret",
    resave: true,
    saveUninitialized: false,
    store: store,
    cookie: {
      expires: 600000,
    },
  })
);

app.use(authRoutes);
app.use(courseRoutes);
app.use(paymentRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.resolve("build", "index.html"));
});

app.use((req, res, next) => {
  if (!req.session.learner) {
    return next();
  }

  Learner.findById(req.session.learner._id)
    .then((learner) => {
      if (!learner) {
        return next();
      }
      req.user = learner;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });

  Instructor.findById(req.session.learner._id)
    .then((instructor) => {
      if (!instructor) {
        return next();
      }
      req.user = instructor;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.post("/googleAuth", (req, res, next) => {
  const data = req.body;
  console.log(data);
});

app.post("/resetEmail", (req, res, next) => {
  const data = req.body;
  console.log(data);
  res.status(200).send({ message: "email send successful." });
});

app.post("/resetPassword", (req, res, next) => {
  const data = req.body;
  console.log(data);
  if (data.pass !== data.cpass) {
    return res.status(400).send({ message: "passowrd not matched!" });
  }
  res.status(200).send({ message: "passowrd change successful." });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then((db) => {
    app.listen(5050);
    console.log("Database is Connected.");
  })
  .catch((err) => {
    console.log(err);
    console.log("Database not connected!");
  });
