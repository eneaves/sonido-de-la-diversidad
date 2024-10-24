const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post('/api/like', (req, res) => {
  const { songName, artistName, isLiked } = req.body;
  console.log(`Song: ${songName}, Artist: ${artistName}, Liked: ${isLiked}`);
  
  // Aquí puedes guardar el "like" en una base de datos si lo deseas

  res.status(200).json({ message: 'Like status received' });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
