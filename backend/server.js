const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Log the origin for debugging
    console.log('Incoming request from origin:', origin);

    // List of allowed origins
    const allowed = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:4173',
      'https://supraja0709.github.io'
    ];

    if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.warn('CORS Blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
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

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    env: process.env.NODE_ENV || 'development',
    db: db.pool ? 'connected' : 'check server logs'
  });
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

