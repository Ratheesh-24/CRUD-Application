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

// Let Render assign its own port
const PORT = process.env.PORT || 10000;  // Using a higher port number

app.listen(PORT, '0.0.0.0', () => {    // Added 0.0.0.0 to listen on all network interfaces
    console.log(`Server listening on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
    process.exit(1);
});