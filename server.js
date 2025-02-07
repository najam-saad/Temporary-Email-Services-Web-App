const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const nodemailer = require("nodemailer");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors());

let emailStore = {};

// Function to delete expired emails
function deleteExpiredEmails() {
  const now = Date.now();
  for (const email in emailStore) {
    if (emailStore[email].expiresAt < now) {
      delete emailStore[email];
    }
  }
}
setInterval(deleteExpiredEmails, 60000); // Runs every minute

// WebSocket connection
wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("close", () => console.log("Client disconnected"));
});

// Route to generate temporary email
app.post("/api/create-temp-email", (req, res) => {
  const { email, expireTime } = req.body;
  if (!email || !expireTime) {
    return res.status(400).json({ error: "Missing email or expireTime" });
  }
  const expiration = Date.now() + expireTime * 60000;
  emailStore[email] = { messages: [], expiresAt: expiration };

  res.json({ email, expiresAt: expiration });
});

// Route to fetch inbox
app.get("/api/inbox/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const response = await axios.get(`https://api.improvmx.com/v3/emails/${email}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.IMPROVMX_API_KEY).toString("base64")}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching emails: ", error);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

// Mock receiving an email (In real-world, use a webhook)
app.post("/api/receive-email", (req, res) => {
  const { email, from, subject, content } = req.body;
  if (!email || !from || !subject || !content) {
    return res.status(400).json({ error: "Missing email details" });
  }
  if (emailStore[email]) {
    const message = { from, subject, content, receivedAt: Date.now() };
    emailStore[email].messages.push(message);
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ email, message }));
      }
    });
  }
  res.json({ message: "Email received" });
});

// SMTP Configuration for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, content } = req.body;
    if (!to || !subject || !content) {
      return res.status(400).json({ error: "Missing email fields" });
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: content,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
