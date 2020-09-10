const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const studentsController = require("../controllers/student");

router.post("/student-registration", authController.createStudent);
router.post("/student-login", authController.postLogin);
router.post("/activate-account", authController.activateAccount);
router.post("/deactivate-account", authController.deactivateAccount);
router.post("/fetch-authenticate-user", authController.fetchAuthenticateUser);
router.post(
  "/reset/student-reset-password",
  studentsController.handleResetPassword
);
router.get("/check-reset-token/:token", studentsController.checkResetToken);
router.post(
  "/student-forget-password",
  studentsController.studentForgetPassword
);
router.get("/confirmation/:token", authController.confirmingAccount);

router.put("/update-student-info", studentsController.updateStudentInfo);

module.exports = router;
