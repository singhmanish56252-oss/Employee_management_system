import API from './axios';

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const updatePassword = (data) => API.put('/auth/update-password', data);
export const getAllUsers = () => API.get('/auth/users');
export const toggleUser = (id) => API.put(`/auth/users/${id}/toggle`);

// Employees
export const getEmployees = (params) => API.get('/employees', { params });
export const getEmployee = (id) => API.get(`/employees/${id}`);
export const createEmployee = (data) => API.post('/employees', data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const getDepartments = () => API.get('/employees/departments');
export const uploadDocument = (id, data) => API.post(`/employees/${id}/documents`, data);

// Jobs
export const getJobs = (params) => API.get('/jobs', { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Applications
export const getApplications = (params) => API.get('/applications', { params });
export const submitApplication = (data) => API.post('/applications', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}`);

// Attendance
export const markAttendance = (data) => API.post('/attendance', data);
export const getAttendance = (params) => API.get('/attendance', { params });
export const updateAttendance = (id, data) => API.put(`/attendance/${id}`, data);
export const applyLeave = (data) => API.post('/attendance/leave', data);
export const getLeaves = (params) => API.get('/attendance/leaves', { params });
export const updateLeave = (id, data) => API.put(`/attendance/leave/${id}`, data);

// Payroll
export const processPayroll = (data) => API.post('/payroll/process', data);
export const getPayroll = (params) => API.get('/payroll', { params });
export const getPayslip = (id) => API.get(`/payroll/${id}`);
export const updatePayroll = (id, data) => API.put(`/payroll/${id}`, data);
export const markPaid = (id) => API.put(`/payroll/${id}/pay`);

// Dashboard
export const getAdminDashboard = () => API.get('/dashboard/admin');
export const getHRDashboard = () => API.get('/dashboard/hr');
export const getEmployeeDashboard = () => API.get('/dashboard/employee');

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllRead = () => API.put('/notifications/read-all');
