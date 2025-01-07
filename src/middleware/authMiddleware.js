const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Not authorized, no token');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.employee = await prisma.employee.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true }
        });
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized' });
    }
};

module.exports = { protect };