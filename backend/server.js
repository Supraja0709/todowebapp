const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://supraja0709.github.io',
    /\.vercel\.app$/ // Matches any vercel subdomains for previews
  ],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Todo Web App backend is running. Try /api' });
});

// Health check route
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Todo Web App API is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 5000;

// Export the app for Vercel
module.exports = app;

// Only listen if this file is run directly (local development)
if (require.main === module) {
  db.getConnection()
    .then(connection => {
      console.log('Connected to MySQL database');
      connection.release();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Failed to connect to MySQL database:', err.message);
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (DB Connection Failed)`);
      });
    });
}

