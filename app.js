import express from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';
import pkg from 'multer';
import fs from 'fs';
const multer = pkg;

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });
app.use(express.static('public'));

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }
  
  const filePath = file.path;
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', fs.createReadStream(filePath));

  try {
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });
    const img = await response.text();
    fs.unlinkSync(filePath);
    res.status(200).json({ url: img });
  } catch (error) {
    fs.unlinkSync(filePath);
    res.status(412).json({ error: 'Upload failed' });
  }
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
