const express = require('express');
const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    login,
    signup,
    exportEmployees
} = require('../controllers/employeeController');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/signup', signup);

router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/export', exportEmployees); // New export route
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;