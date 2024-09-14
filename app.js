import express from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';
import pkg  from 'formidable';
import fs from 'fs';
import path from 'path';

const { IncomingForm } = pkg;
const app = express();
const port = 3000;

app.use(express.static('public'));
app.post('/upload', (req, res) => {
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).send('Error parsing form data');
      return;
    }

    const file = files.file[0];
    const fileName = 'temp.jpg';
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', fs.createReadStream(file.filepath), fileName);
    try {
      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData
      });
      const img = await response.text();
      fs.unlinkSync(file.filepath);
      res.status(200).json({
        url: img
      });
    } catch (error) {
      fs.unlinkSync(file.filepath);
      res.status(412).json({
        error: 'Upload failed'
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
