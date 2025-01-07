const express = require('express');
const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    login,
    signup,
} = require('../controllers/employeeController');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// Protected routes
router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;