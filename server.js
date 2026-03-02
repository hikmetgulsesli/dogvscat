const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3526;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Vote storage (in-memory)
let votes = {
  dog: 0,
  cat: 0
};

// API: Get votes
app.get('/api/votes', (req, res) => {
  res.json(votes);
});

// API: Vote for dog
app.post('/api/vote/dog', (req, res) => {
  votes.dog++;
  res.json(votes);
});

// API: Vote for cat
app.post('/api/vote/cat', (req, res) => {
  votes.cat++;
  res.json(votes);
});

// API: Reset votes
app.post('/api/votes/reset', (req, res) => {
  votes = { dog: 0, cat: 0 };
  res.json(votes);
});

app.listen(PORT, () => {
  console.log(`🐕 Dog vs Cat 🐈 server running on http://localhost:${PORT}`);
});
