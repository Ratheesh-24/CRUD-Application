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

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Add this before your routes
app.use(express.static(path.join(__dirname, 'employee-frontend/dist')));

// Add this after your API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'employee-frontend/dist/index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
    process.exit(1);
});