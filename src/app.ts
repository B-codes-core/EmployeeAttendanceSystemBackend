import express from 'express';
import attendanceRoutes from './routes/attendance.routes';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/attendance', attendanceRoutes);

app.get('/', (_req, res) => {
  res.send('Employee Attendance API is running.');
});

export default app;
