import { Router } from 'express';
import {
  checkInEmployee,
  checkOutEmployee,
  getAllAttendance,
  getAttendanceByEmployeeId,
  getAttendanceReport
} from '../controllers/attendance.controller';

const router = Router();

// POST /api/attendance/checkin
router.post('/checkin', checkInEmployee);

// POST /api/attendance/checkout
router.post('/checkout', checkOutEmployee);

// GET /api/attendance
router.get('/', getAllAttendance);

// GET /api/attendance/:employeeId
router.get('/:employeeId', getAttendanceByEmployeeId);

// GET /api/attendance/reports/all
router.get('/reports/all', getAttendanceReport);

export default router;
