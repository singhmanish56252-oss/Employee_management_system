import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register, socialLogin, sendOTP, verifyOTP } from '../api/services';
import toast from 'react-hot-toast';
import { 
  Mail, 
  Lock, 
  Shield, 
  Users, 
  BarChart2, 
  Zap, 
  UserPlus, 
  LogIn, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Key, 
  Clock, 
  RefreshCw, 
  ArrowLeft,
  LockKeyhole
} from 'lucide-react';

const ROLES = [
  { role: 'employee', label: 'Employee', icon: '👤', color: '#ff6b6b', desc: 'View your profile, attendance & payslips' },
  { role: 'hr', label: 'HR Manager', icon: '💼', color: '#00d4aa', desc: 'Manage employees, leave & payroll' },
  { role: 'admin', label: 'Admin', icon: '🔑', color: '#6c63ff', desc: 'Full system control & analytics' },
];

const FEATURES = [
  { icon: <Users size={20} />, label: 'Employee Hub', desc: 'Complete profile, documents & skills management', color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
  { icon: <BarChart2 size={20} />, label: 'Dynamic Reports', desc: 'Real-time corporate analytics & insights', color: '#00d4aa', bg: 'rgba(0,212,170,0.1)' },
  { icon: <Shield size={20} />, label: 'Granular Roles', desc: 'Secure custom access for Admin, HR & Employees', color: '#ff9a3c', bg: 'rgba(255,154,60,0.1)' },
  { icon: <Zap size={20} />, label: 'Automated Payroll', desc: 'One-click salary sheets & slips processing', color: '#ffd93d', bg: 'rgba(255,217,61,0.1)' },
];

// SVG Logins
const GoogleIcon = () => (
  <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.99 1 12 1 7.35 1 3.37 3.68 1.43 7.62l3.77 2.92C6.18 7.37 8.87 5.04 12 5.04z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-1.99 3.43-4.91 3.43-8.6z" />
    <path fill="#FBBC05" d="M5.2 14.54c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.43 7.02c-.93 1.9-1.43 4.02-1.43 6.18s.5 4.28 1.43 6.18l3.77-2.84z" />
    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.13 0-5.82-2.33-6.8-5.5l-3.77 2.92C3.37 20.32 7.35 23 12 23z" />
  </svg>
);

const GitHubIcon = () => (
  <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 23 23">
    <path fill="#F25022" d="M0 0h11v11H0z" />
    <path fill="#7FBA00" d="M12 0h11v11H12z" />
    <path fill="#00A4EF" d="M0 12h11v11H0z" />
    <path fill="#FFB900" d="M12 12h11v11H12z" />
  </svg>
);

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'otp'
  
  // Traditional states
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '', role: '' });
  const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lockout / Rate Limiting states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  
  // OTP States
  const [otpEmail, setOtpEmail] = useState('');
  const [otpRole, setOtpRole] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [demoOtpCode, setDemoOtpCode] = useState('');
  const otpInputRefs = useRef([]);

  // Simulated OAuth states
  const [oauthPopup, setOauthPopup] = useState(null); // { provider: 'google'|'github'|'microsoft' }
  const [oauthEmail, setOauthEmail] = useState('');
  const [oauthName, setOauthName] = useState('');
  const [oauthRole, setOauthRole] = useState('');
  const [oauthStep, setOauthStep] = useState(1); // 1: Choose email/login, 2: Select role (if registration required)
  const [pendingOauthData, setPendingOauthData] = useState(null);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Load rememberMe email
  useEffect(() => {
    const savedEmail = localStorage.getItem('ems_remembered_email');
    const savedRole = localStorage.getItem('ems_remembered_role');
    if (savedEmail) {
      setLoginForm(prev => ({ ...prev, email: savedEmail, role: savedRole || '' }));
      setRememberMe(true);
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimeLeft]);

  // OTP Countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const interval = setInterval(() => {
      setOtpCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCountdown]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (lockoutTimeLeft > 0) {
      return toast.error(`Account temporarily locked. Please wait ${lockoutTimeLeft}s.`);
    }

    if (!loginForm.role) return toast.error('Please select your role (Admin, HR, or Employee)');
    if ((!loginForm.email && !loginForm.name) || !loginForm.password) return toast.error('Please fill in all fields');
    
    setLoading(true);
    // Send name or email as the identifier
    const identifier = loginForm.email || loginForm.name;
    try {
      const { data } = await login({ ...loginForm, email: identifier });
      
      // Save Remember Me
      if (rememberMe) {
        localStorage.setItem('ems_remembered_email', loginForm.email);
        localStorage.setItem('ems_remembered_role', loginForm.role);
      } else {
        localStorage.removeItem('ems_remembered_email');
        localStorage.removeItem('ems_remembered_role');
      }

      loginUser(data.token, data.user, data.employee);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      setFailedAttempts(0);

      const routes = { admin: '/admin/dashboard', hr: '/hr/dashboard', employee: '/employee/dashboard' };
      navigate(routes[data.user.role] || '/login');
    } catch (err) {
      const remainingAttempts = 5 - (failedAttempts + 1);
      if (remainingAttempts <= 0) {
        setLockoutTimeLeft(30);
        setFailedAttempts(0);
        toast.error('Too many failed login attempts. Locked for 30 seconds.');
      } else {
        setFailedAttempts(prev => prev + 1);
        toast.error(err.response?.data?.message || `Login failed. ${remainingAttempts} attempts remaining.`);
      }
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signUpForm.role) return toast.error('Please select your role (Admin, HR, or Employee)');
    if (!signUpForm.name || !signUpForm.email || !signUpForm.password) {
      return toast.error('All fields are required');
    }
    if (signUpForm.password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
    setLoading(true);
    try {
      const { data } = await register({
        name: signUpForm.name,
        email: signUpForm.email.toLowerCase(),
        password: signUpForm.password,
        role: signUpForm.role
      });
      
      loginUser(data.token, data.user, null);
      toast.success(`Account created! Welcome, ${data.user.name} 🚀`);
      const routes = { admin: '/admin/dashboard', hr: '/hr/dashboard', employee: '/employee/dashboard' };
      navigate(routes[data.user.role] || '/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  // Magic Link OTP Handler
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!otpEmail) return toast.error('Email is required');
    if (!otpRole) return toast.error('Please select your role');
    
    setLoading(true);
    try {
      const { data } = await sendOTP({ email: otpEmail });
      toast.success(data.message || 'OTP sent successfully!');
      setOtpSent(true);
      setOtpCountdown(45);
      setOtpDigits(['', '', '', '', '', '']);
      if (data.demoCode) {
        setDemoOtpCode(data.demoCode);
      }
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP code.');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) return toast.error('Please enter the 6-digit OTP code');
    if (!otpRole) return toast.error('Please select your role');

    setLoading(true);
    try {
      const { data } = await verifyOTP({ email: otpEmail, code, role: otpRole });
      loginUser(data.token, data.user, data.employee);
      toast.success(`Welcome back, ${data.user.name}! 🚀`);
      const routes = { admin: '/admin/dashboard', hr: '/hr/dashboard', employee: '/employee/dashboard' };
      navigate(routes[data.user.role] || '/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally { setLoading(false); }
  };

  // 6-Digit OTP digits focusing logic
  const handleOtpDigitChange = (value, idx) => {
    if (isNaN(value)) return;
    const newDigits = [...otpDigits];
    newDigits[idx] = value.substring(value.length - 1);
    setOtpDigits(newDigits);

    // Auto focus next
    if (value && idx < 5) {
      otpInputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpInputRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && !isNaN(pastedData)) {
      const newDigits = pastedData.split('');
      setOtpDigits(newDigits);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Mock OAuth Execution
  const triggerOAuthLogin = (provider) => {
    setOauthPopup({ provider });
    setOauthStep(1);
    setOauthEmail('');
    setOauthName('');
    setOauthRole('');
    setPendingOauthData(null);
  };

  const handleOAuthSubmit = async () => {
    if (!oauthEmail) return toast.error('Email is required');
    
    setLoading(true);
    try {
      const providerId = providerMockIds[oauthPopup.provider] || 'social_' + Math.random().toString(36).slice(2, 11);
      const avatarUrl = oauthPopup.provider === 'github' 
        ? 'https://avatars.githubusercontent.com/u/9919?v=4' 
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80';

      const payload = {
        email: oauthEmail.toLowerCase(),
        name: oauthName || oauthEmail.split('@')[0],
        provider: oauthPopup.provider,
        providerId,
        avatar: avatarUrl,
        role: oauthRole || undefined
      };

      const { data } = await socialLogin(payload);
      
      if (data.requireRole) {
        // Step 2: Selecting Role required to complete registration
        setPendingOauthData(data);
        setOauthStep(2);
      } else {
        // Success login
        setOauthPopup(null);
        loginUser(data.token, data.user, data.employee);
        toast.success(`Signed in with ${oauthPopup.provider === 'google' ? 'Google' : oauthPopup.provider === 'github' ? 'GitHub' : 'Microsoft'} successfully!`);
        const routes = { admin: '/admin/dashboard', hr: '/hr/dashboard', employee: '/employee/dashboard' };
        navigate(routes[data.user.role] || '/login');
      }
    } catch (err) {
      toast.error('Social auth connection failed.');
    } finally { setLoading(false); }
  };

  const providerMockIds = {
    google: 'google_oauth_10928374981',
    github: 'github_oauth_883719472',
    microsoft: 'microsoft_oauth_4812398472'
  };

  /* Shared Role Selector Component */
  const RoleSelector = ({ selectedRole, onSelect }) => (
    <div className="form-group">
      <label className="form-label">Select Your Role</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {ROLES.map(r => {
          const isActive = selectedRole === r.role;
          return (
            <button
              key={r.role}
              type="button"
              onClick={() => onSelect(r.role)}
              style={{
                padding: '14px 8px',
                background: isActive ? `${r.color}15` : 'var(--bg-secondary)',
                border: isActive ? `2px solid ${r.color}` : '1px solid var(--border)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                boxShadow: isActive ? `0 4px 15px ${r.color}30` : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute', top: '6px', right: '6px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#fff', fontWeight: '700'
                }}>✓</span>
              )}
              <span style={{ fontSize: '22px' }}>{r.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'capitalize', color: isActive ? r.color : 'var(--text-primary)' }}>{r.label}</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.3' }}>{r.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      {/* Left Feature Section */}
      <div className="auth-left">
        <div className="auth-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="auth-brand-logo">EMS</div>
          <h1>EMS <span className="gradient-text">Pro</span></h1>
          <p>Enterprise Employee Management System</p>
        </div>
        <div className="auth-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="auth-feature" style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              padding: '16px', 
              borderRadius: '12px',
              border: '1px solid var(--border)',
              width: '100%',
              maxWidth: '400px'
            }}>
              <div className="auth-feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{f.label}</h4>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Login/Register Section */}
      <div className="auth-right">
        <div className="auth-form" style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          
          {/* Tab Toggler */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px', marginBottom: '28px', border: '1px solid var(--border)' }}>
            <button 
              type="button" 
              onClick={() => { setIsSignUp(false); setLoginMode('password'); }}
              style={{ 
                flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '600',
                background: (!isSignUp && loginMode === 'password') ? 'var(--accent)' : 'transparent',
                color: (!isSignUp && loginMode === 'password') ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <LogIn size={15} /> Sign In
            </button>
            <button 
              type="button" 
              onClick={() => { setIsSignUp(false); setLoginMode('otp'); }}
              style={{ 
                flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '600',
                background: (!isSignUp && loginMode === 'otp') ? 'var(--accent)' : 'transparent',
                color: (!isSignUp && loginMode === 'otp') ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <Key size={15} /> Magic OTP
            </button>
            <button 
              type="button" 
              onClick={() => { setIsSignUp(true); setLoginMode('password'); }}
              style={{ 
                flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '600',
                background: isSignUp ? 'var(--accent)' : 'transparent',
                color: isSignUp ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <UserPlus size={15} /> Sign Up
            </button>
          </div>

          {/* Locked status banner */}
          {lockoutTimeLeft > 0 && (
            <div style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '20px', alignItems: 'center' }}>
              <LockKeyhole size={18} />
              <span>Too many login failures. Locked for <b>{lockoutTimeLeft}s</b>.</span>
            </div>
          )}

          {/* SIGN IN WITH PASSWORD */}
          {!isSignUp && loginMode === 'password' && (
            <div>
              <h2>Welcome Back 👋</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Sign in with your credentials and select your role</p>

              <form onSubmit={handleSignIn} className="auth-form-fields" style={{ marginTop: '24px' }}>
                <RoleSelector
                  selectedRole={loginForm.role}
                  onSelect={(role) => setLoginForm({ ...loginForm, role })}
                />

                <div className="form-group">
                  <label className="form-label">Name</label>
                  <div className="auth-input-wrapper">
                    <Users size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type="text"
                      placeholder="Your Name (optional)"
                      value={loginForm.name}
                      onChange={e => setLoginForm({ ...loginForm, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type="text"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="auth-input-wrapper" style={{ position: 'relative' }}>
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Box */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 16px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={e => setRememberMe(e.target.checked)} 
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    Remember credentials
                  </label>
                  <span style={{ fontSize: '13px', color: 'var(--accent)', cursor: 'pointer', fontWeight: '500' }} onClick={() => setLoginMode('otp')}>Forgot password?</span>
                </div>

                <button type="submit" className="auth-submit" disabled={loading || lockoutTimeLeft > 0} style={{ width: '100%' }}>
                  {loading ? <><span className="btn-spinner" /> Verifying...</> : <>Sign In <ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          )}

          {/* SIGN IN WITH MAGIC OTP */}
          {!isSignUp && loginMode === 'otp' && (
            <div>
              <h2>Magic OTP Login 🔑</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Passwordless direct verification link via email</p>

              {!otpSent ? (
                /* Step 1: Input Email */
                <form onSubmit={handleRequestOTP} className="auth-form-fields" style={{ marginTop: '24px' }}>
                  <RoleSelector
                    selectedRole={otpRole}
                    onSelect={(role) => setOtpRole(role)}
                  />

                  <div className="form-group">
                    <label className="form-label">Registered Email Address</label>
                    <div className="auth-input-wrapper">
                      <Mail size={16} className="auth-input-icon" />
                      <input
                        className="auth-input"
                        type="email"
                        required
                        placeholder="Email"
                        value={otpEmail}
                        onChange={e => setOtpEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit" disabled={loading} style={{ width: '100%', marginTop: '12px' }}>
                    {loading ? <><span className="btn-spinner" /> Sending OTP...</> : <>Send Verification Code <ArrowRight size={16} /></>}
                  </button>
                </form>
              ) : (
                /* Step 2: Input 6-Digit Code */
                <form onSubmit={handleVerifyOTP} className="auth-form-fields" style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
                      <ArrowLeft size={14} /> Back to email
                    </button>
                  </div>

                  <div className="form-group" style={{ textAlign: 'center' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '12px' }}>
                      Enter 6-Digit OTP sent to <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{otpEmail}</span>
                    </label>
                    
                    {/* Split 6 inputs */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', maxWidth: '340px', margin: '0 auto 16px auto' }} onPaste={handleOtpPaste}>
                      {otpDigits.map((val, idx) => (
                        <input
                          key={idx}
                          ref={el => otpInputRefs.current[idx] = el}
                          type="text"
                          maxLength={1}
                          pattern="[0-9]"
                          inputMode="numeric"
                          value={val}
                          onChange={e => handleOtpDigitChange(e.target.value, idx)}
                          onKeyDown={e => handleOtpKeyDown(e, idx)}
                          style={{
                            width: '44px',
                            height: '50px',
                            borderRadius: '10px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-secondary)',
                            color: '#fff',
                            fontSize: '20px',
                            fontWeight: '800',
                            textAlign: 'center',
                            outline: 'none',
                            transition: 'all 0.25s',
                            borderColor: val ? 'var(--accent)' : 'var(--border)',
                            boxShadow: val ? '0 0 10px rgba(108,99,255,0.2)' : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* OTP Countdown */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    <Clock size={14} />
                    {otpCountdown > 0 ? (
                      <span>Resend code in <b>{otpCountdown}s</b></span>
                    ) : (
                      <span onClick={handleRequestOTP} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RefreshCw size={12} /> Resend OTP Code
                      </span>
                    )}
                  </div>

                  {/* Dev Sandbox OTP Indicator */}
                  {demoOtpCode && (
                    <div style={{ background: 'rgba(0, 212, 170, 0.05)', border: '1px dashed rgba(0, 212, 170, 0.3)', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#00d4aa', marginBottom: '20px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 700 }}>👨‍💻 Development Sandbox:</span>
                      <p style={{ marginTop: '2px' }}>Copy OTP code: <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '14px', letterSpacing: '1px', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px' }}>{demoOtpCode}</span></p>
                    </div>
                  )}

                  <button type="submit" className="auth-submit" disabled={loading} style={{ width: '100%' }}>
                    {loading ? <><span className="btn-spinner" /> Validating...</> : <>Verify & Log In 🚀</>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* SIGN UP / REGISTER FORM */}
          {isSignUp && (
            <div>
              <h2>Create Account 🚀</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Register with your personal email</p>

              <form onSubmit={handleSignUp} className="auth-form-fields" style={{ marginTop: '24px' }}>
                <RoleSelector
                  selectedRole={signUpForm.role}
                  onSelect={(role) => setSignUpForm({ ...signUpForm, role })}
                />

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="auth-input-wrapper">
                    <Users size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type="text"
                      required
                      placeholder="Name"
                      value={signUpForm.name}
                      onChange={e => setSignUpForm({ ...signUpForm, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Email Address</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type="email"
                      required
                      placeholder="Email"
                      value={signUpForm.email}
                      onChange={e => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="auth-input-wrapper" style={{ position: 'relative' }}>
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      className="auth-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={signUpForm.password}
                      onChange={e => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
                  {loading ? <><span className="btn-spinner" /> Creating...</> : <>Create Account & Log In 🚀</>}
                </button>
              </form>
            </div>
          )}

          {/* Social login buttons */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 16px 0', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'var(--border)' }} />
              <span style={{ background: 'var(--bg-card)', padding: '0 12px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', zIndex: 1, position: 'relative' }}>Or continue with</span>
            </div>

            {/* Google - Primary Large Button */}
            <button 
              type="button" 
              onClick={() => triggerOAuthLogin('google')}
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
                padding: '13px', width: '100%', marginBottom: '10px',
                background: '#ffffff', border: '1px solid #dadce0', borderRadius: '10px', 
                color: '#3c4043', cursor: 'pointer', transition: 'all 0.2s', 
                fontWeight: '600', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)'; }}
            >
              <GoogleIcon /> Sign in with Google
            </button>

            {/* GitHub + Microsoft - Side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => triggerOAuthLogin('github')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '600', fontSize: '13px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              >
                <GitHubIcon /> GitHub
              </button>
              <button 
                type="button" 
                onClick={() => triggerOAuthLogin('microsoft')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '600', fontSize: '13px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              >
                <MicrosoftIcon /> Microsoft
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOCK OAUTH BROWSER POPUPS (FLOATING SIMULATED WINDOWS) */}
      {/* ========================================================================= */}
      {oauthPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(6px)', padding: '20px' }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: oauthPopup.provider === 'google' ? '#ffffff' : oauthPopup.provider === 'github' ? '#0d1117' : '#111111',
            color: oauthPopup.provider === 'google' ? '#202124' : '#c9d1d9',
            borderRadius: '12px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.1)',
            overflow: 'hidden',
            border: `1px solid ${oauthPopup.provider === 'google' ? '#dadce0' : oauthPopup.provider === 'github' ? '#30363d' : '#2d2d2d'}`,
            display: 'flex',
            flexDirection: 'column',
            animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Title Bar styled like Chrome */}
            <div style={{
              background: oauthPopup.provider === 'google' ? '#f1f3f4' : oauthPopup.provider === 'github' ? '#161b22' : '#202020',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${oauthPopup.provider === 'google' ? '#dee1e6' : oauthPopup.provider === 'github' ? '#21262d' : '#2d2d2d'}`,
              userSelect: 'none'
            }}>
              {/* Window Controls */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <span onClick={() => setOauthPopup(null)} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block', cursor: 'pointer' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
              </div>
              {/* Address bar title */}
              <div style={{ 
                fontSize: '11px', 
                color: oauthPopup.provider === 'google' ? '#5f6368' : '#8b949e', 
                background: oauthPopup.provider === 'google' ? '#ffffff' : '#0d1117',
                border: `1px solid ${oauthPopup.provider === 'google' ? '#dadce0' : '#30363d'}`,
                padding: '3px 20px',
                borderRadius: '20px',
                width: '60%',
                textAlign: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                fontFamily: 'monospace'
              }}>
                🔒 {oauthPopup.provider === 'google' ? 'accounts.google.com' : oauthPopup.provider === 'github' ? 'github.com/login/oauth' : 'login.live.com'}
              </div>
              <span onClick={() => setOauthPopup(null)} style={{ cursor: 'pointer', fontSize: '16px', color: oauthPopup.provider === 'google' ? '#5f6368' : '#8b949e', fontWeight: 600 }}>×</span>
            </div>

            {/* Popup window container */}
            <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              
              {oauthStep === 1 ? (
                /* Step 1: Simulated Social Auth Dialog */
                <div>
                  
                  {/* GOOGLE SIMULATION */}
                  {oauthPopup.provider === 'google' && (
                    <div style={{ textAlign: 'center' }}>
                      <svg style={{ width: '48px', height: '48px', marginBottom: '16px' }} viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-2.09h1.16z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <h2 style={{ fontSize: '22px', fontWeight: '500', color: '#202124', fontFamily: 'Roboto, sans-serif' }}>Sign in with Google</h2>
                      <p style={{ fontSize: '14px', color: '#5f6368', marginTop: '6px', marginBottom: '24px' }}>to continue to <span style={{ color: '#1a73e8', fontWeight: 600 }}>EMS Pro</span></p>

                      {/* Mock Select Account */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '20px' }}>
                        {[
                          { email: 'admin@ems.com', name: 'Manish Singh (Admin)', role: 'admin' },
                          { email: 'hr@ems.com', name: 'Priya Sharma (HR)', role: 'hr' },
                          { email: 'employee@ems.com', name: 'Rohan Gupta (Employee)', role: 'employee' }
                        ].map((acc) => (
                          <div 
                            key={acc.email}
                            onClick={() => { setOauthEmail(acc.email); setOauthName(acc.name); setOauthRole(acc.role); setTimeout(() => handleOAuthSubmit(), 100); }}
                            style={{ 
                              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', background: '#f8f9fa'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f1f3f4'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f8f9fa'}
                          >
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1a73e8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                              {acc.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '14px', fontWeight: '600', color: '#3c4043' }}>{acc.name}</div>
                              <div style={{ fontSize: '12px', color: '#5f6368' }}>{acc.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#70757a' }}>
                        <div style={{ flex: 1, height: '1px', background: '#dadce0' }} />
                        <span style={{ fontSize: '12px', padding: '0 8px' }}>Or use custom email</span>
                        <div style={{ flex: 1, height: '1px', background: '#dadce0' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                          type="email"
                          placeholder="Enter your personal Gmail"
                          value={oauthEmail}
                          onChange={e => setOauthEmail(e.target.value)}
                          style={{ padding: '12px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px', background: '#fff', color: '#202124', width: '100%', outline: 'none' }}
                        />
                        <input
                          type="text"
                          placeholder="Your Name (Optional)"
                          value={oauthName}
                          onChange={e => setOauthName(e.target.value)}
                          style={{ padding: '12px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px', background: '#fff', color: '#202124', width: '100%', outline: 'none' }}
                        />
                        <button 
                          type="button" 
                          onClick={handleOAuthSubmit}
                          style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {/* GITHUB SIMULATION */}
                  {oauthPopup.provider === 'github' && (
                    <div style={{ color: '#c9d1d9' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                        <svg style={{ width: '48px', height: '48px', color: '#f0f6fc' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        <span style={{ fontSize: '24px', color: '#30363d' }}>⇄</span>
                        <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px' }}>EMS</div>
                      </div>

                      <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500', color: '#f0f6fc', marginBottom: '8px' }}>Authorize EMS Pro</h3>
                      <p style={{ textAlign: 'center', fontSize: '13px', color: '#8b949e', marginBottom: '24px' }}>EMS Pro wants to access your public profile and email address.</p>

                      <div style={{ border: '1px solid #30363d', borderRadius: '6px', padding: '16px', background: '#161b22', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>Choose GitHub Account / Email</label>
                            <input
                              type="email"
                              required
                              placeholder="github_handle@github.com"
                              value={oauthEmail}
                              onChange={e => setOauthEmail(e.target.value)}
                              style={{ width: '100%', padding: '10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>Profile Name</label>
                            <input
                              type="text"
                              placeholder="Octocat"
                              value={oauthName}
                              onChange={e => setOauthName(e.target.value)}
                              style={{ width: '100%', padding: '10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc', outline: 'none' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          type="button" 
                          onClick={() => setOauthPopup(null)}
                          style={{ flex: 1, padding: '10px', background: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="button" 
                          onClick={handleOAuthSubmit}
                          style={{ flex: 1, padding: '10px', background: '#238636', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Authorize EMS Pro
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MICROSOFT SIMULATION */}
                  {oauthPopup.provider === 'microsoft' && (
                    <div style={{ color: '#fff' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px', width: '22px', height: '22px' }}>
                          <span style={{ background: '#F25022' }} />
                          <span style={{ background: '#7FBA00' }} />
                          <span style={{ background: '#00A4EF' }} />
                          <span style={{ background: '#FFB900' }} />
                        </div>
                        <span style={{ fontWeight: '600', color: '#737373', fontSize: '16px' }}>Microsoft</span>
                      </div>

                      <h2 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '8px' }}>Sign in</h2>
                      <p style={{ fontSize: '14px', color: '#a6a6a6', marginBottom: '20px' }}>to continue to EMS Pro Workspace</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                        <input
                          type="email"
                          placeholder="someone@example.com, phone, or Skype"
                          value={oauthEmail}
                          onChange={e => setOauthEmail(e.target.value)}
                          style={{ width: '100%', padding: '12px 10px', background: '#000', border: '1px solid #737373', color: '#fff', outline: 'none', borderRadius: '2px' }}
                        />
                        <input
                          type="text"
                          placeholder="Display Name (e.g. Manish Singh)"
                          value={oauthName}
                          onChange={e => setOauthName(e.target.value)}
                          style={{ width: '100%', padding: '12px 10px', background: '#000', border: '1px solid #737373', color: '#fff', outline: 'none', borderRadius: '2px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button 
                          type="button"
                          onClick={() => setOauthPopup(null)}
                          style={{ padding: '8px 24px', background: '#3a3a3a', color: '#fff', border: 'none', minWidth: '100px', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="button"
                          onClick={handleOAuthSubmit}
                          style={{ padding: '8px 24px', background: '#0067b8', color: '#fff', border: 'none', minWidth: '100px', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* Step 2: Selecting Role required to complete registration */
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginBottom: '6px', color: oauthPopup.provider === 'google' ? '#202124' : '#fff' }}>Complete Registration</h3>
                  <p style={{ fontSize: '13px', textAlign: 'center', marginBottom: '24px', color: oauthPopup.provider === 'google' ? '#5f6368' : '#8b949e' }}>
                    Select your system access permission role for email: <b>{oauthEmail}</b>
                  </p>

                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {ROLES.map(r => {
                        const isActive = oauthRole === r.role;
                        return (
                          <div 
                            key={r.role} 
                            onClick={() => setOauthRole(r.role)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', border: `1px solid ${isActive ? r.color : oauthPopup.provider === 'google' ? '#dadce0' : '#30363d'}`, cursor: 'pointer', background: isActive ? `${r.color}0c` : 'transparent', transition: 'all 0.2s'
                            }}
                          >
                            <span style={{ fontSize: '20px' }}>{r.icon}</span>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: isActive ? r.color : oauthPopup.provider === 'google' ? '#202124' : '#f0f6fc' }}>{r.label}</div>
                              <div style={{ fontSize: '11px', color: oauthPopup.provider === 'google' ? '#5f6368' : '#8b949e' }}>{r.desc}</div>
                            </div>
                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: isActive ? r.color : '#555' }}>
                              {isActive && <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.color }} />}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleOAuthSubmit}
                    disabled={loading || !oauthRole}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#6c63ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Confirm & Enter Workspace 🚀
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
