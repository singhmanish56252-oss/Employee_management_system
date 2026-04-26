const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
const allowedOrigins = [
  'http://localhost:5173',
  'https://singhmanish56252-oss.github.io'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('github.io')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/employees',  require('./routes/employeeRoutes'));
app.use('/api/jobs',       require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/payroll',    require('./routes/payrollRoutes'));
app.use('/api/dashboard',  require('./routes/dashboardRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'EMS Server Running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

// DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('❌ DB Error:', err); process.exit(1); });
