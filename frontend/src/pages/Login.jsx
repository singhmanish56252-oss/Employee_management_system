import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/services';
import toast from 'react-hot-toast';
import { Mail, Lock, Shield, Users, BarChart2, Zap } from 'lucide-react';

const DEMO = [
  { role: 'ADMIN', email: 'admin@ems.com', password: 'admin123', color: '#6c63ff' },
  { role: 'HR', email: 'hr@ems.com', password: 'hr123456', color: '#00d4aa' },
  { role: 'EMPLOYEE', email: 'emp@ems.com', password: 'emp12345', color: '#ff6b6b' },
];

const FEATURES = [
  { icon: <Users size={20} />, label: 'Employee Management', desc: 'Manage the entire workforce', color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
  { icon: <BarChart2 size={20} />, label: 'Analytics & Reports', desc: 'Real-time insights & dashboards', color: '#00d4aa', bg: 'rgba(0,212,170,0.1)' },
  { icon: <Shield size={20} />, label: 'Role-Based Access', desc: 'Admin, HR & Employee roles', color: '#ff9a3c', bg: 'rgba(255,154,60,0.1)' },
  { icon: <Zap size={20} />, label: 'Payroll Automation', desc: 'Auto salary computation', color: '#ffd93d', bg: 'rgba(255,217,61,0.1)' },
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data.token, data.user, data.employee);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      const routes = { admin: '/admin/dashboard', hr: '/hr/dashboard', employee: '/employee/dashboard' };
      navigate(routes[data.user.role] || '/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const fillDemo = (d) => setForm({ email: d.email, password: d.password });

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      {/* Left */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">EMS</div>
          <h1>EMS <span className="gradient-text">Pro</span></h1>
          <p>Enterprise Employee Management System</p>
        </div>
        <div className="auth-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="auth-feature">
              <div className="auth-feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
              <div><h4>{f.label}</h4><p>{f.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="auth-right">
        <div className="auth-form">
          <h2>Welcome Back 👋</h2>
          <p>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="auth-form-fields" style={{ marginTop: 32 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  className="auth-input"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  className="auth-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          {/* Demo Panel */}
          <div className="auth-demo-panel">
            <p>⚡ Quick Demo Login</p>
            {DEMO.map(d => (
              <button key={d.role} type="button" className="auth-demo-btn" onClick={() => fillDemo(d)}>
                <span>{d.email}</span>
                <span className="auth-demo-tag" style={{ background: `${d.color}20`, color: d.color }}>{d.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
