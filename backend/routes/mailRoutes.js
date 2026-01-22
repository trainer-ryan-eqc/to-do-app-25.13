require("dotenv").config();
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");


router.post("/send-email", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // gmail email address
        pass: process.env.GMAIL_PASS // app password
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER, // your email address
      to: process.env.MAIL_RECIPIENT,  // any email
      subject: `New message from ${name}`,
      text: `
      Name: ${name}
      Email: ${email}
      \n
      Message: ${message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent successfully!" });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Email sending failed!" });
  }
});


module.exports = router;