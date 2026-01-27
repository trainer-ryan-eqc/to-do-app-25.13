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
        pass: process.env.GMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER, // your email address
      to: process.env.MAIL_RECIPIENT, // any email
      subject: `New message from ${name}`,
      html: `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          background-color: #f4f6f8;
          padding: 30px;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          ">

            <div style="
              background-color: #0f172a;
              color: #ffffff;
              padding: 20px 24px;
            ">
              <h2 style="
                margin: 0;
                font-size: 20px;
                font-weight: 600;
              ">
                📩 New Contact Form Message
              </h2>
            </div>

            <div style="padding: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #334155;">Name</td>
                  <td style="padding: 8px 0; color: #475569;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #334155;">Email</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">
                      ${email}
                    </a>
                  </td>
                </tr>
              </table>

              <div style="
                margin-top: 24px;
                padding: 16px;
                background-color: #f8fafc;
                border-left: 4px solid #2563eb;
                border-radius: 4px;
              ">
                <p style="
                  margin: 0 0 8px;
                  font-weight: 600;
                  color: #334155;
                ">
                  Message
                </p>
                <p style="
                  margin: 0;
                  color: #475569;
                  line-height: 1.6;
                  white-space: pre-line;
                ">
                  ${message}
                </p>
              </div>
            </div>

            <div style="
              padding: 16px 24px;
              background-color: #f1f5f9;
              font-size: 12px;
              color: #64748b;
              text-align: center;
            ">
              This message was sent from your website contact form.
            </div>

          </div>
        </div>
        `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Email sending failed!" });
  }
});

module.exports = router;
