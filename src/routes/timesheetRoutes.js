const express=require('express');   

const {createTimesheet,getTimesheetByEmployeeId,updateTimesheet,deleteTimesheet, getAllTimesheets}=require('../controllers/timesheetController');

const router=express.Router();

router.post('/',createTimesheet);   
router.get('/:employeeId',getTimesheetByEmployeeId);
router.get('/', getAllTimesheets);
router.put('/:id',updateTimesheet);
router.delete('/:id',deleteTimesheet);

module.exports=router;