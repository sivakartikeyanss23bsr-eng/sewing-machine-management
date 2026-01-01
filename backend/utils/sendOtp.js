const nodemailer = require("nodemailer");

const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your-app-password"
    }
  });

  await transporter.sendMail({
    from: "Sewing Machine App",
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP is ${otp}`
  });
};

module.exports = sendOtp;
