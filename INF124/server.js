const express = require('express');
const path = require('path');

const app = express();
const buildPath = path.join(__dirname, 'build');
const PORT = process.env.PORT || 8080;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
