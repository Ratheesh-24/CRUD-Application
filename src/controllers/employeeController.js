const {PrismaClient} =require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");

const prisma = new PrismaClient();

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"});
};

//Get all the Employees
const getEmployees=async(req,res)=>{
    try{
      const employees = await prisma.employee.findMany();
      res.status(200).json({
        success: true,
        data: employees
      });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Get Employee by ID
const getEmployeeById=async(req,res)=>{
    const {id}=req.params;
    try{
            const employee =await prisma.employee.findUnique({
            where:{id:parseInt(id)},
        });
           if(!employee)return res.status(404).json({error:"Employee not found"})
            res.status(200).json(employee);
    }catch(error){
        res.status(500).json({error :error.message});
    }
};

//Update Employee 

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, mobileNo, email } = req.body;
    try {
        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: { name, mobileNo, email },
        });
        
        res.status(200).json({
            success: true,
            data: updatedEmployee,
            message: 'Employee updated successfully'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

//Delete Employee

const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the employee first to check if they exist
        const employee = await prisma.employee.findUnique({ where: { id: parseInt(id) } });

        if (!employee) {
            // If the employee does not exist, return a 404 Not Found response
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Proceed with the deletion if the employee exists
        await prisma.employee.delete({ where: { id: parseInt(id) } });

        // Return a success message
        return res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        // Handle any errors that may occur during the operation
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the employee',
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
        validateEmployeeInput(req.body);
        const { name, mobileNo, email } = req.body;
        
        const existingEmployee = await prisma.employee.findFirst({
            where: {
                OR: [
                    { email },
                    { mobileNo }
                ]
            }
        });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Email or mobile number already exists'
            });
        }

        // Create employee without password
        const newEmployee = await prisma.employee.create({
            data: { 
                name, 
                mobileNo, 
                email,
                password: '' // or you could set a default password here if needed
            }
        });

        res.status(201).json({
            success: true,
            data: newEmployee
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
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
    signup
}