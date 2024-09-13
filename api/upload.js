
import { IncomingForm } from 'formidable';
import fetch from 'node-fetch';
import FormData from 'form-data';

export default async (req, res) => {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).send('Error parsing form data');
        return;
      }

      const file = files.file[0];
      const formData = new FormData();
      formData.append('reqtype', 'fileupload');
      formData.append('fileToUpload', file.filepath, file.originalFilename);

      try {
        const response = await fetch('https://catbox.moe/user/api.php', {
          method: 'POST',
          body: formData
        });
        const imageUrl = await response.text();
        res.status(200).send(imageUrl);
      } catch (error) {
        console.error('Error uploading to Catbox:', error);
        res.status(500).send('Upload failed');
      }
    });
  } else {
    res.status(405).send('Method not allowed');
  }
};
