const express = require("express")
const cors = require("cors")
require('dotenv').config(); 
const nodemailer = require("nodemailer");
const { isValidDomain } = require("./utils/checkMail");

const app = express();
app.use(cors());
app.use(express.json());

const sendEmail = async (body) => {
    try {
      // Set up the email transporter
      const transporter = nodemailer.createTransport({
        service: "gmail", // Or your preferred email service
        auth: {
          user:process.env.EMAIL, // Replace with your email
          pass: process.env.APP_PASSWORD, // Replace with your email password or app password
        },
      });

  
      // Admin Email
      const adminEmailOptions = {
        from: process.env.EMAIL, // Replace with your email
        to: process.env.ADMIN_EMAIL, // Replace with admin's email
        subject: "New Message From INTELLECTRA Website",
        html:  body
      };
  


      const info = await transporter.sendMail(adminEmailOptions);
      console.log("Email sent:", info.response);

    return { success: true, response: info.response };
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };
app.post("/api/sendMail", async (req, res) => {
  try {
    
    
    const { to, body } = req.body;
    
            // Email validation (simple regex for format)
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(to)) {
             return res.status(400).json({
                 success: false,
                 data: [],
                 message: "Please provide a valid email address.",
                 status: 422
             });
         }
        const emailExists = await isValidDomain(to);
        if (!emailExists) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "The domain of this email address is not valid or doesn't exist.",
                status: 422,
            });
        }
        const result = await sendEmail(body);
        if (!result.success) {
          return res.status(500).json({
            success: false,
            error: "Failed to send email",
            details: result.error.message,
          });
        }

        res.status(200).json({
          success: true,
          message: "Email 11 sent successfully",
          response: result.response,
        });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ 
        success : false,
        error: "Failed to send email", 
        details: err.message });
  }
});

app.listen(5001, () => console.log("Server running on port 5001"));