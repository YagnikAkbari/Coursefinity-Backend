const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Learner = require("./model/learner");
const Instructor = require("./model/instructor");

const MONGODB_URL =
  "mongodb+srv://YagnikAkbari12:Ppsv%402020@cluster0.dq3pwce.mongodb.net/CourseFinityDB?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
const app = express();

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
app.use(express.json());

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

mongoose
  .connect(MONGODB_URL)
  .then((db) => {
    app.listen(5050);
    console.log("Database is Connected.");
  })
  .catch((err) => {
    console.log(err);
    console.log("Database not connected!");
  });
