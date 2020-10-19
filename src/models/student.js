const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  account_confirmation: {
    type: String,
    required: false,
  },
  accountConfirmationToken: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpiration: {
    type: String,
    required: false,
  },
  profile_picture: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  std_id: {
    type: String,
    required: true,
  },
  registered_societies: [],
  joined_events: {
    type: Array,
    "default": []
  }
});

module.exports = mongoose.model("Student", studentSchema);
