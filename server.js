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
  collection: "sessions",
  uri: process.env.MONGODB_URL,
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

app.get("/courseList", (req, res) => {
  res.status(200).send({
    message: [
      {
        id: "f7de2f5d-5a42-5a24-9fa7-b8f0ac71d4eb",
        title: "Use Canva to submit stylish images and videos.",
        time: "8h 11m",
        imageUrl:
          "https://img-c.udemycdn.com/course/240x135/2561116_bb5d_3.jpg",
      },
      {
        id: "a54ff818-9aa6-5ea2-b53f-9e631a07e4e3",
        title: "Trading Mastery: A Guide to Intraday, Positional, and Invest",
        time: "24h 12m",
        imageUrl:
          "https://img-c.udemycdn.com/course/240x135/3771430_b8b3_3.jpg",
      },
      {
        id: "8a62214d-d28a-5b1d-a47f-b5a15c5810d8",
        title: "Web Developer Basics",
        time: "4h 51m",
        imageUrl:
          "https://img-c.udemycdn.com/course/240x135/3974902_b46b_2.jpg",
      },
      {
        id: "0bd69a01-dfa1-5f27-9de5-291b5419769c",
        title: "Selenium Automation in Excel",
        time: "12h 12m",
        imageUrl: "https://img-c.udemycdn.com/course/240x135/4281946_15ba.jpg",
      },
      {
        id: "079adb0d-714b-5d3c-863d-2a4802877061",
        title: "Web Developer Basics",
        time: "12h 12m",
        imageUrl:
          "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291cnNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: "cb08668f-23c8-5c7f-b364-7ed7955d4707",
        title: "UI/UX Design",
        time: "12h 12m",
        imageUrl:
          "https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGNvdXJzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: "1c79ae5d-5e02-5898-bfa3-7135adb12b28",
        title: "MERN - stack",
        time: "12h 12m",
        imageUrl:
          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvdXJzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: "d26a3d52-158b-541b-b1cc-80b4ebe24f0d",
        title: "Selenium Automation in Excel",
        time: "12h 12m",
        imageUrl:
          "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvdXJzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      },
    ],
  });
});

app.post("/googleAuth", (req, res, next) => {
  const data = req.body;
  console.log(data);
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
