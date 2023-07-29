const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");

const Learner = require("./model/authLearner");

dotenv.config({ path: "./.env" });

mongoose.set("strictQuery", false);
const app = express();
app.set("view engine", "ejs");
app.use(express.json());

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
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

app.use(express.json());
app.use(authRoutes);

app.use((req, res, next) => {
  if (!req.session.login) {
    return next();
  }

  Learner.findById(req.session.login._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.post("/logout", (req, res) => {
  res.status(200).send({ message: "logout" });
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
