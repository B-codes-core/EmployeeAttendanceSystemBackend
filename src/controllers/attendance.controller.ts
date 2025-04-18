import { Request, Response } from 'express';
import pool from '../config/db';
import { Attendance } from '../models/Attendance';
import { CheckInDTO, CheckOutDTO } from '../models/Attendance';

// See how queries are sent to DB
// Check if functionality of all the APIs is correct (What the API is actually doing)
// https://claude.ai/chat/653b5064-44e4-4a47-a895-96c62f50e9e9
// Remove all comments

// POST /api/attendance/checkin
export const checkInEmployee = async (req: Request, res: Response): Promise<void> => {
    const { employee_name, employee_id, department }: CheckInDTO = req.body;

    if (!employee_name || !employee_id || !department) {
        res.status(400).json({ message: 'One or more required fields are missing' });
        return;
    }

    try {
        // Prevent duplicate check-in on same day
        const [records] = await pool.query(
            `SELECT * FROM attendance 
       WHERE employee_id = ? AND DATE(check_in_time) = CURDATE()`,
            [employee_id]
        );

        if ((records as Attendance[]).length > 0) {
            res.status(409).json({ message: 'Already checked in today.' });
            return;
        }

        await pool.query(
            `INSERT INTO attendance (employee_name, employee_id, department) 
       VALUES (?, ?, ?)`,
            [employee_name, employee_id, department]
        );

        res.status(201).json({ message: 'Check-in successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error });
    }
};

// POST /api/attendance/checkout
export const checkOutEmployee = async (req: Request, res: Response): Promise<void> => {
    const { employee_id }: CheckOutDTO = req.body;

    if (!employee_id) {
        res.status(400).json({ message: 'Employee ID is required.' });
    }

    try {
        const [records] = await pool.query(
            `SELECT * FROM attendance 
       WHERE employee_id = ? AND DATE(check_in_time) = CURDATE() AND check_out_time IS NULL`,
            [employee_id]
        );

        if ((records as Attendance[]).length === 0) {
            res.status(404).json({ message: 'Employee has not checked in today.' });
            return;
        }

        await pool.query(
            `UPDATE attendance SET check_out_time = CURRENT_TIMESTAMP 
       WHERE employee_id = ? AND DATE(check_in_time) = CURDATE()`,
            [employee_id]
        );

        res.status(200).json({ message: 'Check-out successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error });
    }
};

// GET /api/attendance
export const getAllAttendance = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [records] = await pool.query(`SELECT * FROM attendance ORDER BY check_in_time DESC`);
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance.', error });
    }
};

// GET /api/attendance/:employeeId
export const getAttendanceByEmployeeId = async (req: Request, res: Response): Promise<void> => {
    const { employeeId } = req.params;

    try {
        const [records] = await pool.query(
            `SELECT * FROM attendance WHERE employee_id = ? ORDER BY check_in_time DESC`,
            [employeeId]
        );

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching records.', error });
    }
};

// GET /api/attendance/reports/all
// Try to change to api/reports if possible.
// CHANGE THIS SHIT. IT SHOULD RETURN BY FILTER. USE QUERY PARAMS. SEE HOW TO FILTER IN THE DEMO CODE
// WTH is this doing
export const getAttendanceReport = async (req: Request, res: Response): Promise<void> => {
    const { name, department, from, to } = req.query;

    let query = `SELECT * FROM attendance WHERE 1 = 1`;
    const params: any[] = [];

    if (name) {
        query +=  `AND employee_name LIKE ?`;
        params.push(`%${name}%`);
    }

    if (department) {
        query +=  `AND department = ?`;
        params.push(department);
    }

    if (from && to) {
        query +=  `AND DATE(check_in_time) BETWEEN ? AND ?`;
        params.push(from, to);
    }

    try {
        const [rows] = await pool.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report.', error });
    }
};


