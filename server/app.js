const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Default route to test API
app.get('/', (req, res) => {
  res.send('✅ Rajasekhar & Associates API is running!');
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const newEntry = { name, email, message, submittedAt: new Date().toISOString() };

  const filePath = path.join(__dirname, 'data', 'contacts.json');

  fs.readFile(filePath, 'utf-8', (err, data) => {
    let contacts = [];
    if (!err && data) {
      try {
        contacts = JSON.parse(data);
      } catch (e) {
        contacts = [];
      }
    }

    contacts.push(newEntry);

    fs.writeFile(filePath, JSON.stringify(contacts, null, 2), (err) => {
      if (err) {
        console.error("❌ Failed to save contact:", err);
        return res.status(500).json({ success: false, message: "Error saving contact." });
      }

      res.json({ success: true, message: "Form submitted and saved!" });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
