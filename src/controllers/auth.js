const validate = require("../helpers/validatePassword");
const AuthService = require("../services/authentications/auth");

const Student = require("../models/student");

exports.createStudent = async (req, res) => {
  try {
    const student = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      department: req.body.dept,
      std_id: req.body.id,
      batch: req.body.batch,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
      profile_picture: "",
      errors: validate.validatePassword(
        req.body.password,
        req.body.confirm_password
      ),
    };

    if (student.errors) {
      return res.status(401).json({ errors: student.errors });
    }

    const result = await AuthService.registration(student);
    if (result.error) {
      return res.status(500).json({
        error: result.error,
      });
    }

    if (result.message === "User Created") {
      res.status(200).json({
        message: result.message,
      });
    } else {
      res.status(500);
    }
  } catch (err) {
    res.status(500);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const result = await AuthService.Login(email, password);

    if (result.error && result.error !== "Your account is not activated yet") {
      return res.status(401).json({
        error: result.error,
      });
    } else if (
      result.error &&
      result.error === "Your account is not activated yet"
    ) {
      return res.status(404).json({
        error: result.error,
      });
    }

    const { message, userId, accessToken, expiresIn, refreshToken } = result;
    res.status(200).json({
      message,
      userId,
      accessToken,
      expiresIn,
      refreshToken,
    });
  } catch (err) {
    res.status(500);
  }
};

exports.confirmingAccount = async (req, res) => {
  try {
    const token = req.params.token;
    const student = await Student.findOne({ accountConfirmationToken: token });
    if (!student) {
      return res.status(500).json({
        error: "Not a valid token",
      });
    }
    if (student.account_confirmation === "activated") {
      return res.status(200).json({
        message: "Account is already activated",
      });
    } else if (student.account_confirmation === "deactivated") {
      return res.status(200).json({
        message: "Account is already deactivated",
      });
    }

    res.status(200).json({
      student,
    });
  } catch (err) {
    res.status(500);
  }
};

exports.emailConfirmation = async (req, res) => {
  try {
    const token = req.params.token;
    const student = await Student.findOne({ accountConfirmationToken: token });
    if (!student) {
      return res.status(500).json({
        error: "Not a valid token",
      });
    }
    await student.updateOne({
      email_confirmation: "confirmed"
    })
    res.status(200).json({
      status: "confirmed",
      student
    });
  } catch (err) {
    res.status(500);
  }
}

exports.activateAccount = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({
        error: "Valid token needed",
      });
    }

    const student = await Student.findOne({
      accountConfirmationToken: token,
    });

    if (!student) {
      return res.status(404).json({
        error: "No student found",
      });
    }

    await student.updateOne({
      account_confirmation: "activated",
    });

    res.status(200).json({
      message: "Account activated",
    });
  } catch (err) {
    res.status(500);
  }
};

exports.deactivateAccount = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(400).json({
        error: "Valid token needed",
      });
    }
    const student = await Student.findOne({
      accountConfirmationToken: token,
    });
    if (!student) {
      return res.status(404).json({
        error: "No student found",
      });
    }
    await student.updateOne({
      account_confirmation: "deactivated",
    });
    res.status(200).json({
      message: "Account Deactivated"
    });
  } catch (err) {
    res.status(500);
  }
};

exports.fetchAuthenticateUser = async (req, res) => {
  try {
    const studentId = req.body.userId;
    if (!studentId) {
      return res.status(404).json({
        error: "Need a valid student id",
      });
    }
    const student = await Student.findById({ _id: studentId });
    if (!student) {
      return res.status(404).json({
        error: "Need a valid user",
      });
    }
    res.status(200).json({
      student,
    });
  } catch (err) {
    res.status(500);
  }
};
