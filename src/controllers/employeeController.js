const {PrismaClient} =require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");
const json2csv = require('json2csv').parse;

const prisma = new PrismaClient();

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"});
};

//Get all the Employees
const getEmployees=async(req,res)=>{
    try {
        const {
            page = 1,
            limit = 6,
            sortBy = 'name',
            sortOrder = 'asc',
            search = '',
            filterBy = 'all'
        } = req.query;

        // Convert page and limit to numbers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build search query
        let searchQuery = {};
        
        if (search) {
            searchQuery = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { mobileNo: { contains: search, mode: 'insensitive' } }
                ]
            };
        }

        // Build filter query
        let filterQuery = {};
        switch (filterBy) {
            case 'recent':
                filterQuery = {
                    orderBy: {
                        createdAt: 'desc'
                    }
                };
                break;
            case 'oldest':
                filterQuery = {
                    orderBy: {
                        createdAt: 'asc'
                    }
                };
                break;
            case 'name':
                filterQuery = {
                    orderBy: {
                        name: sortOrder
                    }
                };
                break;
            case 'email':
                filterQuery = {
                    orderBy: {
                        email: sortOrder
                    }
                };
                break;
            default:
                filterQuery = {
                    orderBy: {
                        [sortBy]: sortOrder
                    }
                };
        }

        // Combine queries
        const query = {
            where: searchQuery,
            ...filterQuery,
            skip,
            take: limitNum
        };

        // Get total count
        const total = await prisma.employee.count({
            where: searchQuery
        });

        // Get filtered and paginated results
        const employees = await prisma.employee.findMany(query);

        // Calculate total pages
        const totalPages = Math.ceil(total / limitNum);

        return res.status(200).json({
            success: true,
            data: {
                employees,
                pagination: {
                    total,
                    pages: totalPages,
                    currentPage: pageNum,
                    limit: limitNum
                }
            }
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching employees',
            error: error.message
        });
    }
};

//Get Employee by ID
const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Convert id to integer since Prisma expects an integer for ID
        const employeeId = parseInt(id, 10);

        // Validate if id is a valid number
        if (isNaN(employeeId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID'
            });
        }

        const employee = await prisma.employee.findUnique({
            where: {
                id: employeeId
            }
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error('Error fetching employee:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching employee',
            error: error.message
        });
    }
};

//Update Employee 

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobileNo } = req.body;

        // Validate required fields
        if (!name || !email || !mobileNo) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Convert id to number
        const employeeId = parseInt(id);

        // Check if employee exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { id: employeeId }
        });

        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Check if email is taken by another employee
        const emailCheck = await prisma.employee.findFirst({
            where: {
                email,
                NOT: {
                    id: employeeId
                }
            }
        });

        if (emailCheck) {
            return res.status(400).json({
                success: false,
                message: 'Email is already taken by another employee'
            });
        }

        // Update employee
        const updatedEmployee = await prisma.employee.update({
            where: { id: employeeId },
            data: {
                name,
                email,
                mobileNo
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: updatedEmployee
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating employee',
            error: error.message
        });
    }
};

//Delete Employee

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employeeId = parseInt(id);

        // Check if employee exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { id: employeeId }
        });

        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Delete employee
        await prisma.employee.delete({
            where: { id: employeeId }
        });

        return res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting employee',
            error: error.message
        });
    }
};


// Authentication
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const employee = await prisma.employee.findUnique({ where: { email } });
        
        if (!employee || !(await bcrypt.compare(password, employee.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(employee.id);
        res.status(200).json({
            success: true,
            data: {
                token,
                employee: {
                    id: employee.id,
                    name: employee.name,
                    email: employee.email
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
  
  const signup = async (req, res) => {
    const { name, mobileNo, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = await prisma.employee.create({
            data: { name, mobileNo, email, password: hashedPassword },
        });
        const token = generateToken(newEmployee.id);
        res.status(201).json({ token, employee: newEmployee });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  };

// Add input validation
const validateEmployeeInput = (data) => {
    const { name, mobileNo, email } = data;
    if (!name || !mobileNo || !email) {
        throw new Error('All fields are required');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
    }
};

// Modified createEmployee function
const createEmployee = async (req, res) => {
    try {
        const { name, email, mobileNo } = req.body;

        // Validate required fields
        if (!name || !email || !mobileNo) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if employee with same email exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { email }
        });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this email already exists'
            });
        }

        // Create new employee without password
        const newEmployee = await prisma.employee.create({
            data: {
                name,
                email,
                mobileNo
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: newEmployee
        });
    } catch (error) {
        console.error('Error creating employee:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating employee',
            error: error.message
        });
    }
};

// Add export functionality
const exportEmployees = async (req, res) => {
    try {
        // Fetch all employees
        const employees = await prisma.employee.findMany();

        if (!employees || employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No employees found to export'
            });
        }

        try {
            // Define fields for CSV
            const fields = ['name', 'email', 'mobileNo'];
            const opts = { fields };

            // Convert to CSV
            const csvString = json2csv(employees, opts);

            // Set response headers for CSV download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=employees-${Date.now()}.csv`);

            return res.send(csvString);
        } catch (csvError) {
            console.error('CSV Generation Error:', csvError);
            return res.status(500).json({
                success: false,
                message: 'Error generating CSV file'
            });
        }
    } catch (error) {
        console.error('Export Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error exporting employees'
        });
    }
};

module.exports ={
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    login,
    signup,
    exportEmployees
}