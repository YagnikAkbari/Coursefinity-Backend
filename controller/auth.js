const bcrypt = require("bcryptjs");
const Learner = require("../model/learner");
const Instructor = require("../model/instructor");

exports.learnerSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .send({ message: "Name, Email and password are required" });
    }

    const existingUser = await Learner.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send({ message: "Email already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const learner = new Learner({
      name: name,
      email: email,
      password: hashedPassword,
      myCourses: [],
    });

    await learner.save();
    console.log("Learner Registered.");
    return res
      .status(201)
      .send({ message: "Learner Registered!", role: "learner" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.instructorSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .send({ message: "Name, Email and passwords are required" });
    }

    const existingUser = await Instructor.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: "Email already registered with us." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const instructor = new Instructor({
      name: name,
      email: email,
      password: hashedPassword,
      myCourses: [],
    });

    await instructor.save();
    console.log("Instructor Registered.");
    return res
      .status(201)
      .send({ message: "Instructor Registered!", role: "instructor" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.learnerSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const learner = await Learner.findOne({ email });
    if (!learner) {
      return res.status(401).send({ message: "Please register first!" });
    }

    const doMatch = await bcrypt.compare(password, learner.password);
    if (doMatch) {
      console.log("Login");
      req.session.isLoggedIn = true;
      req.session.learner = learner;
      await req.session.save();

      return res.status(200).send({
        message: "Login Successfully",
        role: "learner",
      });
    } else {
      console.log("Error");
      return res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.instructorSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      return res.status(401).send({ message: "Please register first!" });
    }

    const doMatch = await bcrypt.compare(password, instructor.password);
    if (doMatch) {
      console.log("Instructor Login");
      req.session.isLoggedIn = true;
      req.session.instructor = instructor;

      await req.session.save();

      return res.status(200).send({
        message: "Login Successfully",
        role: "instructor",
      });
    } else {
      console.log("Error");
      return res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    return res.status(200).send({ message: "logout" });
  });
};
