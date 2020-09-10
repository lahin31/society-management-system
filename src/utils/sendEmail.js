const nodeMailer = require("nodemailer");

exports.sendEmail = (options) => {
  const transporter = nodeMailer.createTransport({
    service: options.service,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  transporter.sendMail(mailOptions);
  return "success";
};
