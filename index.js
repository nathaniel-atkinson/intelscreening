const express = require('express');
const path = require('path');

const app = express();
const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 8000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
