const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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

// IMPORTANT: Remove the '0.0.0.0' and just use PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
    process.exit(1);
});