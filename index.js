require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');

const app = express();
const port = 5000;

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId:process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
});

// Set storage for uploaded files
const storage = multer.memoryStorage();

// Initialize multer middleware
const upload = multer({ storage });

// Serve the HTML form for file upload
app.get('/', (req, res) => {
  res.send("working");
});

// Handle file upload
app.post('/fileupload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded!');
  }

  // Upload file to S3 bucket
  const params = {
    Bucket: 'prachi-store-1',
    Key: `${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file to S3:', err);
      return res.status(500).send('Error uploading file to S3');
    }
    console.log('File uploaded to S3:', data.Location);
    res.send('File uploaded successfully and stored in S3!');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
