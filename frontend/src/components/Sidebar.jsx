import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Briefcase, ClipboardList,
  Calendar, DollarSign, Bell, Settings, LogOut,
  ChevronLeft, ChevronRight, Menu, X, UserCircle
} from 'lucide-react';

const adminNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Employees', path: '/admin/employees' },
  { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
  { icon: ClipboardList, label: 'Applications', path: '/admin/applications' },
  { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
  { icon: DollarSign, label: 'Payroll', path: '/admin/payroll' },
  { icon: Users, label: 'Users', path: '/admin/users' },
];

const hrNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/hr/dashboard' },
  { icon: Users, label: 'Employees', path: '/hr/employees' },
  { icon: Briefcase, label: 'Jobs', path: '/hr/jobs' },
  { icon: ClipboardList, label: 'Applications', path: '/hr/applications' },
  { icon: Calendar, label: 'Attendance', path: '/hr/attendance' },
  { icon: DollarSign, label: 'Payroll', path: '/hr/payroll' },
];

const employeeNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/employee/dashboard' },
  { icon: UserCircle, label: 'My Profile', path: '/employee/profile' },
  { icon: Calendar, label: 'Attendance', path: '/employee/attendance' },
  { icon: DollarSign, label: 'Payslips', path: '/employee/payslips' },
  { icon: ClipboardList, label: 'Leave', path: '/employee/leave' },
];

const navMap = { admin: adminNav, hr: hrNav, employee: employeeNav };
const colorMap = { admin: '#6c63ff', hr: '#00d4aa', employee: '#ff6b6b' };

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = navMap[user?.role] || [];
  const accentColor = colorMap[user?.role] || '#6c63ff';

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="sidebar-inner">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: accentColor }}>
          <span>EMS</span>
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-title">EMS Pro</span>
            <span className="sidebar-role" style={{ color: accentColor }}>{user?.role?.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: accentColor }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-email">{user?.email}</p>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            style={({ isActive }) => isActive ? { borderLeft: `3px solid ${accentColor}`, color: accentColor, background: `${accentColor}15` } : {}}
            title={collapsed ? label : ''}
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <NavLink to={`/${user?.role}/settings`} className="sidebar-link" title={collapsed ? 'Settings' : ''}>
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button className="sidebar-link sidebar-logout" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Desktop sidebar */}
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside className={`sidebar sidebar-mobile ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <button className="sidebar-close-btn" onClick={() => setMobileOpen(false)}>
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
