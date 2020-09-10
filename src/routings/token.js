const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student");

router.post("/generate-access-token", studentController.generateToken);

module.exports = router;
