const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");

require("dotenv").config();

const mongodb_url = process.env.MONGODB_URL;
const store = new MongoDBStore({
  uri: mongodb_url,
  collection: "sessions",
});

mongoose.set("strictQuery", false);
const app = express();

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const paymentRoutes = require("./routes/payment");
const instructorRoute = require("./routes/instructor");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/videos", express.static(path.join(__dirname, "videos")));

// const upload1 = multer({ dest: "videos/", fieldname: "file" });

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
    origin: process.env.ALLOW_ORIGIN || "*",
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

app.use(
  session({
    name: "coursefinity.sid",
    secret: process.env.SESSION_SECRET || "TopSecretHashKey396455jfhSfhvn8",
    secure: true,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    },
  })
);

app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Coursefinity Backend is running..." });
});

app.use(authRoutes);
app.use(courseRoutes);
app.use(paymentRoutes);
app.use(instructorRoute);

app.post("/uploadModules", (req, res, next) => {
  const courseId = req.body;

  console.log(courseId);
});

app.post("/googleAuth", (req, res, next) => {
  const data = req.body;
});

mongoose
  .connect(mongodb_url)
  .then((db) => {
    app.listen(process.env.PORT || 5050);
    console.log(`Database is Connected. ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log(err);
    console.log("Database not connected!");
  });

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (request, response) => {
//     let event = request.body;
//     const learnerSession = req.session.learner._id;
//     if (process.env.ENDPOINT_SECRET) {
//       const signature = request.headers["stripe-signature"];
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature,
//           process.env.ENDPOINT_SECRET
//         );
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message);
//         return response.sendStatus(400);
//       }
//     }

//     switch (event.type) {
//       case "payment_intent.succeeded":
//         console.log("success");
//         const paymentIntent = event.data.object;

//         // add logic for adding purchased courseId to user's my courses array
//         const user = await Learner.findOne({
//           email: paymentIntent.metadata.email,
//         });
//         user.courseId = user.courseId.push(paymentIntent.metadata.courseId);

//         Course.findByIdAndUpdate(
//           {
//             _id: learnerSession,
//           },
//           { myCourses: user.courseId }
//         ).then(() => {
//           console.log("Added");
//         });

//         await user.save();
//         break;
//       default:
//         console.log(`Unhandled event type ${event.type}.`);
//     }

//     response.send();
//   }
// );
