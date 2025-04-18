import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import attendanceRoutes from './routes/attendance.routes';

dotenv.config({
  path: path.resolve(__dirname, './config/.env') // Adjust if .env is outside src/
});

const app = express();

// ✅ Middleware
app.use(express.json()); // Parse application/json
app.use(express.urlencoded({ extended: true })); // Optional: parse URL-encoded form data

// ✅ Routes
app.use('/api/attendance', attendanceRoutes);

// ✅ Root route
app.get('/', (_req, res) => {
  res.send('Employee Attendance API is running.');
});

export default app;
