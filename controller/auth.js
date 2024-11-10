const bcrypt = require("bcryptjs");
const Joi = require("joi");
const Learner = require("../model/learner");
const Instructor = require("../model/instructor");

const signupSchema = Joi.object({
  name: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  cpassword: Joi.ref("password"),
}).with("password", "cpassword");

exports.learnerSignUp = async (req, res, next) => {
  try {
    const { name, email, password, cpassword } = req.body;
    const { error } = signupSchema.validate({
      name,
      email,
      password,
      cpassword,
    });

    if (error) {
      return res.status(400).send({
        code: 400,
        message: "Name, Email and password are required",
        errors: error,
      });
    }

    const existingUser = await Learner.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: "Email already registered, Please signin." });
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
    return res.status(201).send({
      message: "Learner Registered!",
      code: 201,
      data: { role: "learner" },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.instructorSignUp = async (req, res, next) => {
  try {
    const { name, email, password, cpassword } = req.body;

    const { error } = signupSchema.validate({
      name,
      email,
      password,
      cpassword,
    });

    if (error) {
      return res.status(400).send({
        code: 400,
        message: "Name, Email and password are required",
        errors: error,
      });
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
    return res.status(201).send({
      message: "Instructor Registered!",
      code: 201,
      data: { role: "instructor" },
    });
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
      return res
        .status(400)
        .send({ code: 400, message: "Please register first!" });
    }

    const doMatch = await bcrypt.compare(password, learner.password);
    if (doMatch) {
      req.session.userId = learner._id;
      req.session.isLoggedIn = true;
      req.session.learner = learner;
      console.log("Cookies", req.session);
      await req.session.save();

      res.status(200).send({
        code: 200,
        message: "Login Successfully",
        data: {
          role: "learner",
        },
      });
      console.log("resheaders", res.getHeaders());
    } else {
      console.log("Error");
      return res
        .status(400)
        .send({ code: 400, message: "Invalid credentials" });
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
        .send({ code: 400, message: "Email and password are required" });
    }

    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      return res
        .status(400)
        .send({ code: 400, message: "Please register first!" });
    }

    const doMatch = await bcrypt.compare(password, instructor.password);
    if (doMatch) {
      req.session.userId = instructor._id;
      req.session.isLoggedIn = true;
      req.session.instructor = instructor;

      await req.session.save();

      return res.status(200).send({
        code: 200,
        message: "Login Successfully",
        data: {
          role: "instructor",
        },
      });
    } else {
      console.log("Error");
      return res
        .status(400)
        .send({ code: 400, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.clearCookie("coursefinity.sid", { path: "/" });
    res
      .status(200)
      .send({ code: 200, message: "Session destroyed and cookie removed." });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    if (req?.query?.role) {
      if (req?.query?.role === "learner" && req?.session.learner) {
        return res
          .status(200)
          .send({ code: 200, message: "Authenticated User." });
      } else if (req?.query?.role === "instructor" && req?.session.instructor) {
        return res
          .status(200)
          .send({ code: 200, message: "Authenticated User." });
      }
    } else {
      res.status(401).send({ code: 401, message: "UnAuthenticated User." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.getUserDetails = async (req, res, next) => {
  try {
    const learnerId = req.session.learner._id;
    const response = await Learner.find({ _id: learnerId });

    res.status(200).send({
      code: 200,
      data: { name: response[0]?.name, email: response[0]?.email },
      message: "User Fetched Successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
exports.getInstructorDetails = async (req, res, next) => {
  try {
    const instructorId = req.session.instructor._id;
    const response = await Instructor.find({ _id: instructorId });

    res.status(200).send({
      code: 200,
      data: { name: response[0]?.name, email: response[0]?.email },
      message: "User Fetched Successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.sendResetPasswordMail = async (req, res, next) => {
  const { email } = req.body;
  const { role } = req?.query;
  if (role === "learner") {
    const learner = await Learner.findOne({ email });
    if (!learner) {
      return res.status(404).send({ message: "Learner not found" });
    }
  } else if (role === "instructor") {
    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      return res.status(404).send({ message: "Instructor not found" });
    }
  } else {
    return res.status(404).send({ message: "Role not found" });
  }

  res.status(200).send({ code: 200, message: "email send successful." });
};
exports.resetUserPassword = (req, res, next) => {
  const data = req.body;
  if (data.pass !== data.cpass) {
    return res.status(400).send({ message: "passowrd not matched!" });
  }
  res.status(200).send({ message: "passowrd change successful." });
};
