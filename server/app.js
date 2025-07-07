const express = require('express');
const cors = require('cors'); // ✅ Add this
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(cors()); // ✅ Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('✅ Rajasekhar & Associates API is running!');
});

// Contact form POST API
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const newEntry = {
    name,
    email,
    message,
    submittedAt: new Date().toISOString()
  };

  const filePath = path.join(__dirname, 'data', 'contacts.json');

  // Check if file exists
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

      console.log("✅ Contact saved successfully.");
      res.json({ success: true, message: "Form submitted and saved!" });
    });
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
