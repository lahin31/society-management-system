const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const redis = require("redis");

const Student = require("../models/student");
const genAccTkn = require("../helpers/genAccessToken");
const emailUtils = require("../utils/sendEmail");

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

exports.updateStudentInfo = async (req, res) => {
  try {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const id = req.body.id;
    const batch = req.body.batch;
    const department = req.body.department;
    var file = req.files !== null ? req.files.file : "";
    var oldPassword = "";
    var newPassword = "";

    const studentId = req.body.userId;

    const student = await Student.findById({ _id: studentId });

    if (req.body.oldPassword && req.body.newPassword) {
      oldPassword = req.body.oldPassword;
      newPassword = await bcrypt.hash(req.body.newPassword, 12);
      const isEqual = await bcrypt.compare(oldPassword, student.password);
      if (!isEqual) {
        return res.status(500).json({
          error: "Please put correct password",
        });
      }
    }

    if (!student) {
      return res.status(404).json({
        error: "Need a valid student id",
      });
    }

    const student_update = await Student.updateOne(
      { _id: studentId },
      {
        $set: {
          name,
          username,
          email,
          id,
          batch,
          department,
          ...(req.files !== null && {
            profile_picture: file.name.replace(" ", ""),
          }),
          ...(newPassword !== "" && { password: newPassword }),
        },
      }
    );

    if (file !== "") {
      file.mv(
        `${__dirname}/../../client/public/uploads/${file.name.replace(
          " ",
          ""
        )}`,
        (err) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          }
          return res.status(200).json({
            message: "Successfully Updated",
          });
        }
      );
    } else {
      return res.status(200).json({
        message: "Successfully Updated",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.studentForgetPassword = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(200).json({
        error: "Please provide an email",
      });
    }

    const student = await Student.findOne({
      email,
    });

    if (!student) {
      return res.status(200).json({
        error: "Email doesn't exist",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    await student.updateOne({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    });

    const emailOptions = {
      from: `${process.env.EMAIL_ADDRESS}`,
      to: `${student.email}`,
      service: "gmail",
      subject: "Link to reset password",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link or paste into your browser to complete the process within one hour of receiving it:
        http://localhost:3000/reset/${token}
        If you did not request this, please skip this your email and your password will remain unchanged.`,
    };

    if (emailUtils.sendEmail(emailOptions) === "success") {
      return res.status(200).json({
        message: "recovery email sent",
      });
    } else {
      return res.status(500);
    }
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.checkResetToken = async (req, res) => {
  try {
    const token = req.params.token;
    const student = await Student.findOne({ resetPasswordToken: token });
    if (!student) {
      return res.status(500).json({
        err: "Something went wrong",
      });
    }
    return res.status(200).json({
      token,
      studentId: student._id,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.handleResetPassword = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await Student.findOneAndUpdate(
      { _id: req.body.studentId },
      { password: hashedPassword },
      { upsert: true },
      function (err) {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        return res.status(200).json({
          message: "password updated",
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.generateToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (refreshToken === null) {
      return res.status(401);
    }

    client.get("refreshTokens", function (err, result) {
      if (result && !JSON.parse(result).includes(refreshToken)) {
        return res.status(403);
      }
    });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403);

      const accessToken = genAccTkn.generateAccessToken();
      return res.status(200).json({
        message: "success",
        accessToken,
      });
    });
  } catch (err) {
    return res.status(500).json({
      err: err,
    });
  }
};

exports.fetchJoiningStudents = async (req, res) => {
  try {
    const joiningStudents = JSON.parse(req.body.joiningStudents);

    const students = []

    for(let i = 0; i < joiningStudents.length; i++) {
      let student = await Student.findById({
        _id: joiningStudents[i]
      })
      students.push(student)
    }

    return res.status(200).json({
      students
    })

  } catch (err) {
    return res.status(500).json({
      err: err,
    });
  }
}