const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// Validation function to check required fields
const validateTimesheetData = ({ employeeId, date, hoursWorked, taskDetails }) => {
  if (!employeeId || !date || !hoursWorked || !taskDetails) {
    return 'All fields (employeeId, date, hoursWorked, taskDetails) are required.';
  }
  if (isNaN(parseInt(employeeId, 10))) {
    return 'employeeId must be a valid number.';
  }
  if (isNaN(parseFloat(hoursWorked))) {
    return 'hoursWorked must be a valid number.';
  }
  return null;
};

// Create a new timesheet
const createTimesheet = async (req, res) => {
  const { employeeId, date, hoursWorked, taskDetails } = req.body;
  const validationError = validateTimesheetData({ employeeId, date, hoursWorked, taskDetails });

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const timesheet = await prisma.timesheet.create({
      data: {
        employeeId: parseInt(employeeId, 10),
        date: new Date(date),
        hoursWorked: parseFloat(hoursWorked),
        taskDetails,
      },
    });
    res.status(200).json({ success: true, data: timesheet });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all timesheets
const getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await prisma.timesheet.findMany();
    res.status(200).json({ success: true, data: timesheets });
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get timesheets by employeeId
const getTimesheetByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;

  if (!employeeId || isNaN(parseInt(employeeId))) {
    return res.status(400).json({ error: 'Invalid or missing employeeId' });
  }

  try {
    const timesheets = await prisma.timesheet.findMany({
      where: {
        employeeId: parseInt(employeeId),
      },
      orderBy: {
        date: 'desc',
      },
    });
    res.status(200).json(timesheets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a timesheet
const updateTimesheet = async (req, res) => {
  const { id } = req.params;
  const { employeeId, date, hoursWorked, taskDetails } = req.body;

  try {
    // Convert id to number and verify it exists
    const timesheetId = parseInt(id, 10);
    if (isNaN(timesheetId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid timesheet ID format' 
      });
    }

    // Check if timesheet exists
    const existingTimesheet = await prisma.timesheet.findUnique({
      where: { id: timesheetId }
    });

    if (!existingTimesheet) {
      return res.status(404).json({ 
        success: false, 
        error: 'Timesheet not found' 
      });
    }

    // Prepare update data
    const updateData = {
      date: date ? new Date(date) : undefined,
      hoursWorked: hoursWorked ? parseFloat(hoursWorked) : undefined,
      taskDetails: taskDetails || undefined,
      employeeId: employeeId ? parseInt(employeeId, 10) : undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const updatedTimesheet = await prisma.timesheet.update({
      where: { id: timesheetId },
      data: updateData
    });

    res.status(200).json({ 
      success: true, 
      data: updatedTimesheet 
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Delete a timesheet
const deleteTimesheet = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ success: false, error: 'Invalid or missing timesheet ID' });
  }

  try {
    await prisma.timesheet.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ success: true, message: 'Timesheet deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Export all functions
module.exports = {
  createTimesheet,
  getAllTimesheets,
  getTimesheetByEmployeeId,
  updateTimesheet,
  deleteTimesheet,
};
