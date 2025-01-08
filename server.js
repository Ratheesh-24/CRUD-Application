const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://crud-application-a3g2.onrender.com', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Routes
const employeeRoutes = require('./src/routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'employee-frontend/dist')));

// API routes go here

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'employee-frontend/dist/index.html'));
});

// Error handler
app.use(errorHandler);

// Try these options one at a time:

// Option 1: Use a higher port number
const PORT = process.env.PORT || 10000;

// Option 2: Remove the semicolon if it exists in your port number
// const PORT = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
    process.exit(1);
});