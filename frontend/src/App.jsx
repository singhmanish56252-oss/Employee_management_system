import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, GuestRoute } from './routes/ProtectedRoute';

// Public Pages
import PublicHome from './pages/public/Home';
import ApplyJob from './pages/public/ApplyJob';
import Login from './pages/Login';

// Settings & Profile
import Settings from './pages/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import Jobs from './pages/admin/Jobs';
import Applications from './pages/admin/Applications';
import Attendance from './pages/admin/Attendance';
import Payroll from './pages/admin/Payroll';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import Profile from './pages/employee/Profile';

// Unauthorized
const Unauthorized = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-primary)', textAlign:'center' }}>
    <div style={{ fontSize:80, marginBottom:20 }}>🚫</div>
    <h1 style={{ fontSize:32, fontWeight:900, marginBottom:12 }}>Access Denied</h1>
    <p style={{ color:'var(--text-secondary)', marginBottom:28 }}>You don't have permission to view this page.</p>
    <a href="/login" style={{ padding:'12px 28px', background:'var(--accent)', borderRadius:10, fontWeight:700, color:'#fff', textDecoration:'none' }}>Go to Login</a>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background:'#1a1a2e', color:'#e8e8f0', border:'1px solid #2a2a4a' },
            success: { iconTheme: { primary:'#00d4aa', secondary:'#fff' } },
            error: { iconTheme: { primary:'#ff6b6b', secondary:'#fff' } }
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/jobs/:id" element={<ApplyJob />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Shared Routes */}
          <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><Settings /></ProtectedRoute>} />
          <Route path="/hr/settings" element={<ProtectedRoute roles={['hr']}><Settings /></ProtectedRoute>} />
          <Route path="/employee/settings" element={<ProtectedRoute roles={['employee']}><Settings /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute roles={['admin']}><Employees /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute roles={['admin']}><Jobs /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute roles={['admin']}><Applications /></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute roles={['admin']}><Attendance /></ProtectedRoute>} />
          <Route path="/admin/payroll" element={<ProtectedRoute roles={['admin']}><Payroll /></ProtectedRoute>} />

          {/* HR */}
          <Route path="/hr/dashboard" element={<ProtectedRoute roles={['admin','hr']}><HRDashboard /></ProtectedRoute>} />
          <Route path="/hr/employees" element={<ProtectedRoute roles={['admin','hr']}><Employees /></ProtectedRoute>} />
          <Route path="/hr/jobs" element={<ProtectedRoute roles={['admin','hr']}><Jobs /></ProtectedRoute>} />
          <Route path="/hr/applications" element={<ProtectedRoute roles={['admin','hr']}><Applications /></ProtectedRoute>} />
          <Route path="/hr/attendance" element={<ProtectedRoute roles={['admin','hr']}><Attendance /></ProtectedRoute>} />
          <Route path="/hr/payroll" element={<ProtectedRoute roles={['admin','hr']}><Payroll /></ProtectedRoute>} />

          {/* Employee */}
          <Route path="/employee/dashboard" element={<ProtectedRoute roles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee/profile" element={<ProtectedRoute roles={['employee']}><Profile /></ProtectedRoute>} />
          <Route path="/employee/attendance" element={<ProtectedRoute roles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee/payslips" element={<ProtectedRoute roles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee/leave" element={<ProtectedRoute roles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
