const Queue = require("bull");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const Learner = require("../model/learner");
const Instructor = require("../model/instructor");
const { redisClient } = require("../config/redisClient");
const { resetPasswordEmailTemplate } = require("../utils/contants");
const { sendMail } = require("../utils/mail");
const crypto = require("crypto");
const { generateJwtToken } = require("../utils/getToken");
const emailQueue = new Queue("emails");
emailQueue.process(async (job) => {
  const { email, content } = job.data;
  await sendMail(email, content);
});

function generateAccessToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

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
      const token = generateJwtToken({
        id: learner?._id,
        email: learner?.email,
      });
      res.cookie("coursefinity.id", token, {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });
      res.status(200).send({
        code: 200,
        message: "Login Successfully",
        data: {
          role: "learner",
          authToken: token,
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
      const token = generateJwtToken({
        id: instructor?._id,
        email: instructor?.email,
      });
      res.cookie("coursefinity.id", token, {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });
      return res.status(200).send({
        code: 200,
        message: "Login Successfully",
        data: {
          role: "instructor",
          authToken: token,
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
    if (req.session) {
      await req.session.destroy();
    }
    res.clearCookie("coursefinity.sid", { path: "/" });
    res
      .status(200)
      .send({ code: 200, message: "Session destroyed and cookie removed." });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const learnerId = req.learner._id;
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
    const instructorId = req?.instructor._id;
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
  try {
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
    const client = redisClient();
    const tokenKey = `${email}`;
    const accessToken = generateAccessToken();
    const hashedToken = hashToken(accessToken);
    await client.set(
      tokenKey,
      `${JSON.stringify({ hashedToken, accessToken, email, role })}`
    );
    await client.pexpire(accessToken, 3_600_000);
    await client.set(accessToken, `${email}`);
    await client.pexpire(tokenKey, 3_600_000);

    // avg time (0.25sec)250ms
    // emailQueue.add({
    //   email,
    //   content: resetPasswordEmailTemplate(accessToken, role),
    // });
    // avg time 3.5sec
    await sendMail(email, resetPasswordEmailTemplate(accessToken, role));
    res.status(200).send({ code: 200, message: "Email sent successfully." });
  } catch (err) {
    console.log("ERROR:RESETPASSWORDMAIL:-", err);
    return res.status(500).send({ message: err?.message });
  }
};

exports.resetUserPassword = async (req, res, next) => {
  try {
    const { pass, cpass, token, role } = req.body;

    if (!pass || !cpass) {
      return res.status(400).send({ message: "Password required!" });
    } else if (pass !== cpass) {
      return res.status(400).send({ message: "passowrd not matched!" });
    } else if (!token) {
      return res.status(400).send({ message: "Token is required!" });
    }
    
    const client = redisClient();
    const senderEmail = await client.get(token);
    
    if (!senderEmail) {
      return res
        .status(400)
        .send({ message: "Invalid Token! Please send request again" });
    }
    const resetData = await client.get(senderEmail);
    
    if (!resetData?.accessToken || resetData?.accessToken !== token) {
      return res
        .status(400)
        .send({ message: "Invalid Token! Please send request again" });
    }

    const hashedPassword = await bcrypt.hash(pass, 12);

    const updatePassword = async (model, email, hashedPassword) => {
      return model.findOneAndUpdate(
        { email },
        { $set: { password: hashedPassword } },
        { new: true }
      );
    };

    let updateResponse;
    if (role === "learner" && resetData.role === role) {
      updateResponse = await updatePassword(
        Learner,
        senderEmail,
        hashedPassword
      );
    } else if (role === "instructor" && resetData.role === role) {
      updateResponse = await updatePassword(
        Instructor,
        senderEmail,
        hashedPassword
      );
    } else {
      return res.status(400).send({ message: "Role not found or mismatched!" });
    }

    if (!updateResponse) {
      return res.status(404).send({ message: "User not found!" });
    }
    
    const deletableTokens = [token, senderEmail];
    await client.del(...deletableTokens);

    

    return res
      .status(200)
      .send({ code: 200, message: "passowrd change successful." });
  } catch (err) {
    console.log("ERROR:RESET PASSWORD:-", err);

    return res.status(500).send({ message: err?.message });
  }
};
