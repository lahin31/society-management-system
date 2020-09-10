const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const compression = require("compression");

require("dotenv").config();

const db = require("./config/db");
const studentRoutes = require("./routings/student");
const societyRoutes = require("./routings/society");
const tokenRoutes = require("./routings/token");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(fileUpload());
app.use(compression());

app.use("/students", studentRoutes);
app.use("/society", societyRoutes);
app.use("/token", tokenRoutes);

// database connection
db.makeDb();

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(process.env.port || 4000);
