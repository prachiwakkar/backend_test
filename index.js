const express = require('express');
const multer = require('multer');
const path = require('path');


const app = express();
const port = 5000;

app.use("/uploads",express.static('uploads'));


// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer middleware
const upload = multer({ storage });

// Serve the HTML form for file upload
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file upload
app.post('api/uploads', upload.single('file'), (req, res) => {
  if (req.file) {
    res.send('File uploaded successfully!');
  } else {
    res.status(400).send('No file uploaded!');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
