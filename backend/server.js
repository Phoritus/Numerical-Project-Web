require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const corsOptions = require('./config/corOption');

const app = express();
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Numerical Methods API Server',
    status: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root Finding API Routes
app.use('/root-finding', require('./routes/rootFinding'));
// Linear Algebra Routes
app.use('/linear-algebra', require('./routes/linearAlgebra'));

// Error handling middleware
app.use((err, res) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;