const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
// const redis = require("redis");

const Student = require("../models/student");
const genAccTkn = require("../helpers/genAccessToken");
const emailUtils = require("../utils/sendEmail");

// const REDIS_PORT = process.env.REDIS_PORT || 6379;

// const client = redis.createClient(REDIS_PORT);

exports.updateStudentInfo = async (req, res) => {
  try {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const stdId = req.body.std_id;
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

    const another = await Student.find({ std_id: stdId });

    if(student.std_id !== stdId && another && another.length > 0) {
      return res
              .status(400)
              .json({
                error: "This id is not available"
              })
    }

    await Student.updateOne(
      { _id: studentId },
      {
        $set: {
          name,
          username,
          email,
          std_id: stdId,
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
          res.status(200).json({
            message: "Successfully Updated",
          });
        }
      );
    } else {
      res.status(200).json({
        message: "Successfully Updated",
      });
    }
  } catch (err) {
    res.status(500);
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
      subject: "Reset Password",
      text: `
        Recently a request was submitted to reset your password for our client area. If you did not request this, please ignore this email. It will expire and become useless in 2 hours time.
        To reset your password, please visit the url below:
        http://localhost:3000/reset/${token}
      `
    };

    if (emailUtils.sendEmail(emailOptions) === "success") {
      res.status(200).json({
        message: "recovery email sent",
      });
    } else {
      res.status(500);
    }
  } catch (err) {
    res.status(500);
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
    res.status(200).json({
      token,
      studentId: student._id,
    });
  } catch (err) {
    res.status(500);
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
        res.status(200).json({
          message: "password updated",
        });
      }
    );
  } catch (err) {
    res.status(500);
  }
};

exports.generateToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (refreshToken === null) {
      return res.status(401);
    }

    // client.get("refreshTokens", function (err, result) {
    //   if (result && !JSON.parse(result).includes(refreshToken)) {
    //     return res.status(403);
    //   }
    // });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403);

      const accessToken = genAccTkn.generateAccessToken();
      res.status(200).json({
        message: "success",
        accessToken
      });
    });
  } catch (err) {
    res.status(500);
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

    res.status(200).json({
      students
    });

  } catch (err) {
    res.status(500);
  }
}

exports.contactUs = async (req, res) => {
  try {
    const infoWithMsg = req.body.infoWithMsg;
    const emailOptions = {
      from: infoWithMsg.email,
      to: `${process.env.EMAIL_ADDRESS}`,
      service: "gmail",
      subject: "Message from " + infoWithMsg.name,
      text: `
        Name: ${infoWithMsg.name}
        Department: ${infoWithMsg.department}
        Batch: ${infoWithMsg.batch}
        Message: ${infoWithMsg.message}
      `
    };
  
    if (emailUtils.sendEmail(emailOptions) === "success") {
      res.status(200).json({
        message: "Message sent"
      })
    } else {
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  } catch(err) {
    res.status(500);
  }
}