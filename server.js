// server.js
import express from "express";
import cors from "cors";
import { getAccessToken, sendMail } from "./utils/helper.js"; // add .js if missing

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/sendMail", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const { to, subject, body } = req.body;
    const response = await sendMail(accessToken, to, subject, body);
    res.status(200).json({  
        success : true,
        message: "Email sent successfully",
        status: response.status,
        data: response.data,
     });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ 
        success : false,
        error: "Failed to send email", 
        details: err.message });
  }
});

app.listen(5001, () => console.log("Server running on port 5000"));