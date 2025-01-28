const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const projectController = {
    // Get all projects
    getAllProjects: async (req, res) => {
        try {
            const projects = await prisma.project.findMany({
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });
            res.json({ success: true, data: projects });
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch projects' });
        }
    },

    // Get project by ID
    getProjectById: async (req, res) => {
        try {
            const { id } = req.params;
            const project = await prisma.project.findUnique({
                where: { id: parseInt(id) },
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });

            if (!project) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }

            res.json({ success: true, data: project });
        } catch (error) {
            console.error('Error fetching project:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch project' });
        }
    },

    // Create new project
    createProject: async (req, res) => {
        try {
            const { name, description, startDate, endDate, status, employeeId } = req.body;

            // Validate required fields
            if (!name || !startDate || !endDate || !status || !employeeId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Missing required fields' 
                });
            }

            // Check if employee exists
            const employee = await prisma.employee.findUnique({
                where: { id: parseInt(employeeId) }
            });

            if (!employee) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Employee not found' 
                });
            }

            const project = await prisma.project.create({
                data: {
                    name,
                    description,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    status,
                    employeeId: parseInt(employeeId)
                }
            });

            res.status(201).json({ success: true, data: project });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ success: false, message: 'Failed to create project' });
        }
    },

    // Update project
    updateProject: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, startDate, endDate, status, employeeId } = req.body;

            // Check if project exists
            const existingProject = await prisma.project.findUnique({
                where: { id: parseInt(id) }
            });

            if (!existingProject) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Project not found' 
                });
            }

            const updatedProject = await prisma.project.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    description,
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                    status,
                    employeeId: employeeId ? parseInt(employeeId) : undefined
                }
            });

            res.json({ success: true, data: updatedProject });
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ success: false, message: 'Failed to update project' });
        }
    },

    // Delete project
    deleteProject: async (req, res) => {
        try {
            const { id } = req.params;

            // Check if project exists
            const existingProject = await prisma.project.findUnique({
                where: { id: parseInt(id) }
            });

            if (!existingProject) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Project not found' 
                });
            }

            await prisma.project.delete({
                where: { id: parseInt(id) }
            });

            res.json({ success: true, message: 'Project deleted successfully' });
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ success: false, message: 'Failed to delete project' });
        }
    }
};

module.exports = projectController; 