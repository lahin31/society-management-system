const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const studentsController = require("../controllers/student");
const checkAuth = require("../middlewares/check-auth");

router.get("/check-reset-token/:token", studentsController.checkResetToken);
router.get("/confirmation/:token", authController.confirmingAccount);
router.get("/email-confirmation/:token", authController.emailConfirmation);

router.post("/student-registration", authController.createStudent);
router.post("/student-login", authController.postLogin);
router.post("/activate-account", authController.activateAccount);
router.post("/deactivate-account", authController.deactivateAccount);
router.post("/fetch-authenticate-user", authController.fetchAuthenticateUser);
router.post("/reset/student-reset-password", studentsController.handleResetPassword);
router.post("/student-forget-password", studentsController.studentForgetPassword);
router.post("/fetch_joining_students", checkAuth, studentsController.fetchJoiningStudents);
router.post("/update-student-info", studentsController.updateStudentInfo);
router.post("/contact_us", checkAuth, studentsController.contactUs);

module.exports = router;
