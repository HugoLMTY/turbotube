const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3069;

// Utilisation de cors pour gérer les requêtes CORS
app.use(cors());

// Utilisation de body-parser pour traiter le corps des requêtes POST
app.use(bodyParser.json());

app.post('/read', async (req, res) => {
  const filePath = req.body.path;

  if (!filePath) {
    return res.status(400).send('Path is required in the request body');
  }

  const fullPath = `../${filePath}`;
  console.log({ filePath, fullPath });

  const content = await fs.readFileSync(fullPath);
  console.log({ content });

  res.send(content);

  // fs.readFile(fullPath, 'utf8', (err, data) => {
  //   if (err) {
  //     return res.status(500).send(`Error reading file: ${err.message}`);
  //   }
  //   res.send(data);
  // });
});

app.listen(port, () => {
  console.log(`Mini API listening at http://localhost:${port}`);
});
