const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("mongoose");
const cors = require("cors");
const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const path = require("path");
const Course = require("./model/course");

require("dotenv").config();

const mongodb_url = process.env.MONGODB_URL;
// const store = new MongoDBStore({
//   uri: mongodb_url,
//   collection: "sessions",
// });

mongoose.set("strictQuery", false);
const app = express();
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const paymentRoutes = require("./routes/payment");
const instructorRoute = require("./routes/instructor");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    let event;
    console.log("request", request.headers);
    console.log("---------------------------");
    
    console.log('request sign', request.headers["stripe-signature"])

    // const learnerSession = request.learner._id;
    
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          process.env.ENDPOINT_SECRET
        );
        console.log("request endpoint", process.env.ENDPOINT_SECRET);
        
      } catch (err) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    

    console.log("event-log", event);

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("event-success", event);
        const paymentIntent = event.data.object;

        // add logic for adding purchased courseId to user's my courses array
        const user = await Learner.findOne({
          email: paymentIntent.metadata.email,
        });
        console.log("useruser", user);

        // user.courseId = user.courseId.push(paymentIntent.metadata.courseId);

        // Course.findByIdAndUpdate(
        //   {
        //     _id: learnerSession,
        //   },
        //   { myCourses: user.courseId }
        // ).then(() => {
        //   console.log("Added");
        // });

        await user.save();
        break;
      case "payment_intent.created":
        console.log("requeste----", request.body.toString());

        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    response.send();
  }
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/videos", express.static(path.join(__dirname, "videos")));

// const upload1 = multer({ dest: "videos/", fieldname: "file" });

// app.use(
//   session({
//     name: "coursefinity.sid",
//     secret: process.env.SESSION_SECRET || "TopSecretHashKey396455jfhSfhvn8",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24,
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//     },
//   })
// );

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
    app.listen(process.env.PORT || 8080);
    console.log(`Database is Connected. ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log(err);
    console.log("Database not connected!");
  });
