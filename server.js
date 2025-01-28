const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store emails in memory
const emailStore = new Map();

// Generate email
app.post("/api/generate-email", (req, res) => {
  try {
    const randomString = Math.random().toString(36).substring(2, 10);
    const tempEmail = `${randomString}@tempemail.com`;
    emailStore.set(tempEmail, []);
    res.json({ email: tempEmail });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate email" });
  }
});

// Receive email
app.post("/api/emails", (req, res) => {
  try {
    const { to, from, subject, content } = req.body;
    
    if (!emailStore.has(to)) {
      return res.status(404).json({ error: "Email address not found" });
    }

    const newEmail = {
      id: Date.now().toString(),
      sender: from,
      subject,
      content,
      preview: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
      time: new Date().toLocaleString(),
      read: false
    };

    emailStore.get(to).push(newEmail);
    res.json({ message: "Email received successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to process email" });
  }
});

// Get inbox
app.get("/api/emails/:email", (req, res) => {
  try {
    const userEmail = req.params.email;
    const inbox = emailStore.get(userEmail) || [];
    res.json(inbox);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inbox" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});