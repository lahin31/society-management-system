const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
// const redis = require("redis");

const Student = require("../../models/student");
const genAccTkn = require("../../helpers/genAccessToken");
const emailUtils = require("../../utils/sendEmail");

// const REDIS_PORT = process.env.REDIS_PORT || 6379;

// const client = redis.createClient(REDIS_PORT);

let refreshTokens = [];

exports.registration = async (student_info) => {
  const {
    name,
    username,
    email,
    department,
    std_id,
    batch,
    password,
    confirm_password,
    profile_picture,
  } = student_info;
  // checking for existing user email
  const existingUser = await Student.findOne({
    email,
  });

  if (existingUser) {
    return {
      error: "Sorry email already registered",
    };
  }
  // checking for existing student id
  const existingUserByStdId = await Student.findOne({
    std_id,
  });
  if (existingUserByStdId) {
    return {
      error: "Sorry id already registered",
    };
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const student = new Student({
    name,
    username,
    email,
    department,
    std_id,
    batch,
    profile_picture,
    password: hashedPassword,
  });

  await student.save();

  const existing_student = await Student.findOne({
    std_id,
  });

  const token = crypto.randomBytes(20).toString("hex");

  await existing_student.updateOne({
    accountConfirmationToken: token,
  });

  const emailConfirmationOptions = {
    from: `${process.env.EMAIL_ADDRESS}`,
    to: existing_student.email,
    service: "gmail",
    subject: "Please confirm your email...",
    text: `Before we can get started, we have to confirm your email address. Just click here: http://localhost:3000/email-confirmation/${token}`
  }
  
  if(emailUtils.sendEmail(emailConfirmationOptions) === "success") {
    const emailOptions = {
      from: existing_student.email,
      to: `${process.env.EMAIL_ADDRESS}`,
      service: "gmail",
      subject: "Confirmation for a new student...",
      text: `Someone is requested to register. His/her name is ${existing_student.name}. Check full details http://localhost:3000/confirmation/${token}`,
    };
  
    if (emailUtils.sendEmail(emailOptions) === "success") {
      return {
        message: "User Created",
      };
    } else {
      return {
        error: "Something went wrong",
      };
    }
  }
};

exports.Login = async (email, password) => {
  const student = await Student.findOne({
    email,
  });

  if (!student) {
    return {
      error: "Email or Password isn't matched",
    };
  }

  if (student.account_confirmation !== "activated") {
    return {
      error: "Your account is not activated yet",
    };
  }

  const isEqual = await bcrypt.compare(password, student.password);

  if (!isEqual) {
    return {
      error: "Email or Password isn't matched",
    };
  }

  const token = genAccTkn.generateAccessToken(student);
  const refreshToken = jwt.sign(
    {
      userId: student._id,
      email: student.email,
    },
    process.env.REFRESH_TOKEN_SECRET
  );
  // saving refresh tokens in an array
  refreshTokens.push(refreshToken);
  // client.setex("refreshTokens", 12000, JSON.stringify(refreshTokens));
  return {
    message: "Authenticate successfull",
    userId: student._id,
    accessToken: token,
    expiresIn: "168h",
    refreshToken,
  };
};
