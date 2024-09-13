import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';

const app = express();
const upload = multer();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', req.file.buffer, req.file.originalname);

  try {
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });
    const imageUrl = await response.text();
    res.send(imageUrl);  // Send back the image URL
  } catch (error) {
    console.error('Error uploading to Catbox:', error);
    res.status(500).send('Upload failed');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
