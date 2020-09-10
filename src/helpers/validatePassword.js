exports.validatePassword = (password, confirm_password) => {
  let errors = [];

  if (password !== confirm_password) {
    errors.push("Password and Confirm Password not matched");
    return errors;
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (/^\s/.test(password) || /\s$/.test(password)) {
    errors.push("Password must not start or end with a whitespace character");
  }

  if (/(.)\1{3,}/.test(password)) {
    errors.push(
      "Password must not repeat the same character in a row 4 or more times"
    );
  }

  if (errors.length <= 0) return false;
  return errors;
};
