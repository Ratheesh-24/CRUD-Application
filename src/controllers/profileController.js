const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        
        const profile = await prisma.employee.findUnique({
            where: { id: employeeId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                mobileNo: true,
                address: true,
                department: true,
                designation: true,
                dateOfJoining: true,
                emergencyContact: true,
                bloodGroup: true,
                linkedIn: true,
                profileImage: true,
                // Exclude password field for security
            }
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        const {
            firstName,
            lastName,
            mobileNo,
            address,
            department,
            designation,
            dateOfJoining,
            emergencyContact,
            bloodGroup,
            linkedIn,
            profileImage
        } = req.body;

        // Check if employee exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { id: employeeId }
        });

        if (!existingEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update profile
        const updatedProfile = await prisma.employee.update({
            where: { id: employeeId },
            data: {
                firstName,
                lastName,
                mobileNo,
                address,
                department,
                designation,
                dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
                emergencyContact,
                bloodGroup,
                linkedIn,
                profileImage
            }
        });

        res.json({
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ 
                message: 'Mobile number already exists for another employee' 
            });
        }
        res.status(500).json({ message: 'Error updating profile' });
    }
};

module.exports = {
    getProfile,
    updateProfile
}; 