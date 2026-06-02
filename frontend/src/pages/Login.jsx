import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register, socialLogin, sendOTP, verifyOTP } from '../api/services';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Users, Key, ArrowRight, Eye, EyeOff,
  Clock, RefreshCw, ArrowLeft, LockKeyhole, UserPlus, LogIn, Shield
} from 'lucide-react';

const ROLES = [
  { role: 'admin',    label: 'Admin',      icon: '🔑', color: '#a855f7', desc: 'Full Control' },
  { role: 'hr',       label: 'HR Manager', icon: '💼', color: '#00d4aa', desc: 'People Ops' },
  { role: 'employee', label: 'Employee',   icon: '👤', color: '#ff6b6b', desc: 'My Portal' },
];

const GoogleIcon = () => (
  <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.99 1 12 1 7.35 1 3.37 3.68 1.43 7.62l3.77 2.92C6.18 7.37 8.87 5.04 12 5.04z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-1.99 3.43-4.91 3.43-8.6z" />
    <path fill="#FBBC05" d="M5.2 14.54c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.43 7.02c-.93 1.9-1.43 4.02-1.43 6.18s.5 4.28 1.43 6.18l3.77-2.84z" />
    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.13 0-5.82-2.33-6.8-5.5l-3.77 2.92C3.37 20.32 7.35 23 12 23z" />
  </svg>
);

const GitHubIcon = () => (
  <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} viewBox="0 0 23 23">
    <path fill="#F25022" d="M0 0h11v11H0z" />
    <path fill="#7FBA00" d="M12 0h11v11H12z" />
    <path fill="#00A4EF" d="M0 12h11v11H0z" />
    <path fill="#FFB900" d="M12 12h11v11H12z" />
  </svg>
);

// Floating animated backdrop orb
const AnimatedOrb = ({ size, defaultColor, themeColor, style }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: themeColor || defaultColor,
      filter: 'blur(100px)',
      opacity: 0.16,
      pointerEvents: 'none',
      transition: 'background 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s ease-in-out',
      ...style
    }}
    className="floating-orb"
  />
);

const THEMES = {
  admin: {
    primary: '#a855f7',
    secondary: '#6366f1',
    gradient: 'linear-gradient(135deg, #a855f7, #6366f1)',
    glow: 'rgba(168, 85, 247, 0.3)',
    bgGlow1: '#a855f7',
    bgGlow2: '#6366f1',
    subtitle: 'System Control Center',
    greeting: 'Security override protocol active. Log in supervisor.'
  },
  hr: {
    primary: '#00d4aa',
    secondary: '#00b894',
    gradient: 'linear-gradient(135deg, #00d4aa, #00b894)',
    glow: 'rgba(0, 212, 170, 0.3)',
    bgGlow1: '#00d4aa',
    bgGlow2: '#00b894',
    subtitle: 'People & Operations Dashboard',
    greeting: 'Management workspace ready. Access team records.'
  },
  employee: {
    primary: '#ff6b6b',
    secondary: '#ff4757',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
    glow: 'rgba(255, 107, 107, 0.3)',
    bgGlow1: '#ff6b6b',
    bgGlow2: '#ff4757',
    subtitle: 'Employee Workspace Portal',
    greeting: 'Personal dashboard access. Let\'s make today productive.'
  },
  default: {
    primary: '#6c63ff',
    secondary: '#3b82f6',
    gradient: 'linear-gradient(135deg, #6c63ff, #3b82f6)',
    glow: 'rgba(108, 99, 255, 0.25)',
    bgGlow1: '#6c63ff',
    bgGlow2: '#00d4aa',
    subtitle: 'Enterprise Management System',
    greeting: 'Select your role to connect to your workspace.'
  }
};

const RoleSelector = ({ selected, onSelect }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
    {ROLES.map(r => {
      const active = selected === r.role;
      return (
        <button
          key={r.role}
          type="button"
          onClick={() => onSelect(r.role)}
          style={{
            padding: '16px 8px',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: active ? r.color : 'rgba(255, 255, 255, 0.08)',
            background: active ? `${r.color}15` : 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: active ? 'scale(1.03)' : 'scale(1)',
            boxShadow: active ? `0 0 20px -5px ${r.color}40` : 'none'
          }}
          className="role-select-btn"
        >
          <span style={{ fontSize: '24px', filter: active ? 'none' : 'grayscale(30%)' }}>{r.icon}</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: active ? '#fff' : 'rgba(255,255,255,0.4)', letterSpacing: '0.2px' }}>{r.label}</span>
            <span style={{ fontSize: '9px', color: active ? `${r.color}cc` : 'rgba(255,255,255,0.25)', marginTop: '2px', fontWeight: '500' }}>{r.desc}</span>
          </div>
        </button>
      );
    })}
  </div>
);

const InputField = ({ label, icon: Icon, type = 'text', placeholder, value, onChange, required, rightEl, themeColor = '#6c63ff' }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '18px' }} className="input-group">
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Icon size={16} style={{ position: 'absolute', left: '16px', color: focused ? themeColor : 'rgba(255, 255, 255, 0.25)', transition: 'color 0.3s' }} className="input-icon" />
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '14px 16px 14px 46px',
            paddingRight: rightEl ? '48px' : '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid',
            borderColor: focused ? themeColor : 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: focused ? `0 0 15px -3px ${themeColor}25` : 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightEl && <div style={{ position: 'absolute', right: '14px', zIndex: 2 }}>{rightEl}</div>}
      </div>
    </div>
  );
};

const SocialBtn = ({ icon: Icon, label, onClick, style: s }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      color: 'rgba(255, 255, 255, 0.75)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: '600',
      fontSize: '13px',
      ...s
    }}
    className="social-btn"
  >
    <Icon />{label}
  </button>
);

export default function Login() {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup' | 'otp'
  const [loginForm, setLoginForm]   = useState({ name: '', email: '', password: '', role: '' });
  const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '', role: '' });
  const [showPass, setShowPass]     = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // OTP
  const [otpEmail, setOtpEmail]   = useState('');
  const [otpRole, setOtpRole]     = useState('');
  const [otpSent, setOtpSent]     = useState(false);
  const [otpDigits, setOtpDigits] = useState(['','','','','','']);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [demoOtpCode, setDemoOtpCode]   = useState('');
  const otpRefs = useRef([]);

  // OAuth popup
  const [oauthPopup, setOauthPopup]   = useState(null);
  const [oauthEmail, setOauthEmail]   = useState('');
  const [oauthName, setOauthName]     = useState('');
  const [oauthRole, setOauthRole]     = useState('');
  const [oauthStep, setOauthStep]     = useState(1);
  const [pendingOauthData, setPendingOauthData] = useState(null);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // 3D Tilt Card Effect State
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Calculate rotation angles (max 6 degrees)
    const rotateX = -(y / (box.height / 2)) * 6;
    const rotateY = (x / (box.width / 2)) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    const saved = localStorage.getItem('ems_remembered_email');
    const savedRole = localStorage.getItem('ems_remembered_role');
    if (saved) { setLoginForm(p => ({ ...p, email: saved, role: savedRole || '' })); setRememberMe(true); }
  }, []);

  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;
    const t = setInterval(() => setLockoutTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [lockoutTimeLeft]);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = setInterval(() => setOtpCountdown(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [otpCountdown]);

  const ROUTES = { admin: '/admin/dashboard', hr: '/hr/dashboard', employee: '/employee/dashboard' };

  // Resolve dynamic theme colors
  const activeRole = tab === 'signin' ? loginForm.role : (tab === 'signup' ? signUpForm.role : (tab === 'otp' ? otpRole : ''));
  const currentTheme = THEMES[activeRole] || THEMES.default;

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (lockoutTimeLeft > 0) return toast.error(`Locked for ${lockoutTimeLeft}s`);
    if (!loginForm.role) return toast.error('Please select your role');
    if ((!loginForm.email && !loginForm.name) || !loginForm.password) return toast.error('Please fill all fields');
    setLoading(true);
    const identifier = loginForm.email || loginForm.name;
    try {
      const { data } = await login({ ...loginForm, email: identifier });
      if (rememberMe) { localStorage.setItem('ems_remembered_email', identifier); localStorage.setItem('ems_remembered_role', loginForm.role); }
      else { localStorage.removeItem('ems_remembered_email'); localStorage.removeItem('ems_remembered_role'); }
      loginUser(data.token, data.user, data.employee);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      setFailedAttempts(0);
      navigate(ROUTES[data.user.role] || '/login');
    } catch (err) {
      const rem = 5 - (failedAttempts + 1);
      if (rem <= 0) { setLockoutTimeLeft(30); setFailedAttempts(0); toast.error('Too many attempts. Locked 30s.'); }
      else { setFailedAttempts(p => p + 1); toast.error(err.response?.data?.message || `Failed. ${rem} attempts left.`); }
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signUpForm.role) return toast.error('Please select a role');
    if (!signUpForm.name || !signUpForm.email || !signUpForm.password) return toast.error('All fields required');
    if (signUpForm.password.length < 6) return toast.error('Password min 6 chars');
    setLoading(true);
    try {
      const { data } = await register({ ...signUpForm, email: signUpForm.email.toLowerCase() });
      loginUser(data.token, data.user, null);
      toast.success(`Account created! Welcome ${data.user.name} 🚀`);
      navigate(ROUTES[data.user.role] || '/login');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!otpEmail) return toast.error('Email required');
    if (!otpRole) return toast.error('Select your role');
    setLoading(true);
    try {
      const { data } = await sendOTP({ email: otpEmail });
      toast.success('OTP sent!');
      setOtpSent(true); setOtpCountdown(45); setOtpDigits(['','','','','','']);
      if (data.demoCode) setDemoOtpCode(data.demoCode);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) return toast.error('Enter 6-digit OTP');
    if (!otpRole) return toast.error('Select your role');
    setLoading(true);
    try {
      const { data } = await verifyOTP({ email: otpEmail, code, role: otpRole });
      loginUser(data.token, data.user, data.employee);
      toast.success(`Welcome back, ${data.user.name}! 🚀`);
      navigate(ROUTES[data.user.role] || '/login');
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid OTP'); }
    finally { setLoading(false); }
  };

  const handleOtpDigitChange = (val, idx) => {
    if (isNaN(val)) return;
    const d = [...otpDigits]; d[idx] = val.substring(val.length - 1); setOtpDigits(d);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKeyDown = (e, idx) => { if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) otpRefs.current[idx - 1]?.focus(); };
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').trim();
    if (p.length === 6 && !isNaN(p)) { setOtpDigits(p.split('')); otpRefs.current[5]?.focus(); }
  };

  const triggerOAuth = (provider) => { setOauthPopup({ provider }); setOauthStep(1); setOauthEmail(''); setOauthName(''); setOauthRole(''); setPendingOauthData(null); };

  const handleOAuthSubmit = async () => {
    if (!oauthEmail) return toast.error('Email required');
    setLoading(true);
    try {
      const ids = { google: 'google_oauth_10928374981', github: 'github_oauth_883719472', microsoft: 'microsoft_oauth_4812398472' };
      const avatar = oauthPopup.provider === 'github'
        ? 'https://avatars.githubusercontent.com/u/9919?v=4'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80';
      const payload = { email: oauthEmail.toLowerCase(), name: oauthName || oauthEmail.split('@')[0], provider: oauthPopup.provider, providerId: ids[oauthPopup.provider], avatar, role: oauthRole || undefined };
      const { data } = await socialLogin(payload);
      if (data.requireRole) { setPendingOauthData(data); setOauthStep(2); }
      else { setOauthPopup(null); loginUser(data.token, data.user, data.employee); toast.success('Signed in successfully!'); navigate(ROUTES[data.user.role] || '/login'); }
    } catch { toast.error('Social auth failed.'); }
    finally { setLoading(false); }
  };



  const formVariants = {
    initial: { opacity: 0, scale: 0.98, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.98, y: -8, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06060c', fontFamily: "'Inter', sans-serif", overflow: 'hidden', position: 'relative', padding: '24px 16px', boxSizing: 'border-box' }}>
      
      {/* ─── TECH GRID OVERLAY ─── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
        backgroundSize: '45px 45px',
        backgroundPosition: 'center',
        opacity: 0.85,
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* ─── FLOATING TECH PARTICLES ─── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bg-particle"
            style={{
              position: 'absolute',
              borderRadius: '50%',
              left: `${(i * 7.7) % 100}%`,
              top: `${(i * 13.1) % 100}%`,
              animationDelay: `${i * -1.5}s`,
              animationDuration: `${12 + (i % 6) * 3}s`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: currentTheme.primary,
              boxShadow: `0 0 10px ${currentTheme.primary}`,
              transition: 'background 0.8s'
            }}
          />
        ))}
      </div>

      {/* ─── DYNAMIC GLOW BACKGROUND ─── */}
      <AnimatedOrb size="600px" defaultColor="#6c63ff" themeColor={currentTheme.bgGlow1} style={{ top: '-150px', left: '-150px', zIndex: 3 }} />
      <AnimatedOrb size="500px" defaultColor="#00d4aa" themeColor={currentTheme.bgGlow2} style={{ bottom: '-150px', right: '-150px', zIndex: 3 }} />
      <AnimatedOrb size="400px" defaultColor="#ff6b6b" themeColor={currentTheme.primary} style={{ top: '25%', left: '35%', opacity: activeRole ? 0.08 : 0.04, zIndex: 3 }} />

      {/* ─── CENTERED GLASS CARD (With 3D Hover Tilt) ─── */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(12, 12, 22, 0.48)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid',
          borderColor: activeRole ? `${currentTheme.primary}3a` : 'rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: activeRole 
            ? `0 35px 70px rgba(0, 0, 0, 0.45), 0 0 100px -15px ${currentTheme.glow}, inset 0 0 20px rgba(255, 255, 255, 0.02)`
            : '0 35px 70px rgba(0, 0, 0, 0.45), inset 0 0 20px rgba(255, 255, 255, 0.01)',
          position: 'relative',
          zIndex: 10,
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.005, 1.005, 1.005)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease, border-color 0.8s, box-shadow 0.8s',
          boxSizing: 'border-box'
        }}
        className="login-card"
      >
        
        {/* Glowing Indicator bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${currentTheme.primary}, ${currentTheme.secondary}, transparent)`,
          opacity: 0.8,
          transition: 'background 0.8s'
        }} />

        {/* LOGO & TITLE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px', textAlign: 'center' }}>
          <div 
            onClick={() => navigate('/')} 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '14px', 
              background: currentTheme.gradient, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: '900', 
              fontSize: '18px', 
              color: '#fff', 
              cursor: 'pointer',
              boxShadow: `0 8px 24px ${currentTheme.glow}`,
              transition: 'background 0.8s, box-shadow 0.8s',
              marginBottom: '16px'
            }}
          >
            E
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <span style={{ fontWeight: '800', fontSize: '20px', color: '#fff', letterSpacing: '-0.5px' }}>EMS</span>
            <span style={{ 
              fontWeight: '800', 
              fontSize: '20px', 
              background: currentTheme.gradient, 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              transition: 'background 0.8s' 
            }}>Pro</span>
          </div>
          
          <div style={{ height: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '6px' }}>
            <span style={{ 
              fontSize: '13px', 
              color: activeRole ? '#fff' : 'rgba(255,255,255,0.4)', 
              fontWeight: activeRole ? '700' : '500', 
              transition: 'all 0.5s',
              letterSpacing: '0.2px' 
            }}>
              {currentTheme.subtitle}
            </span>
            {activeRole && (
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px', fontStyle: 'italic', transition: 'all 0.5s' }}>
                "{currentTheme.greeting}"
              </span>
            )}
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          background: 'rgba(255, 255, 255, 0.03)', 
          borderRadius: '14px', 
          padding: '4px', 
          marginBottom: '28px', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative'
        }}>
          {[['signin', <LogIn key="icon-signin" size={13} />, 'Sign In'], ['signup', <UserPlus key="icon-signup" size={13} />, 'Sign Up'], ['otp', <Key key="icon-otp" size={13} />, 'OTP Login']].map(([t, icon, label]) => {
            const active = tab === t;
            return (
              <button 
                key={t} 
                type="button" 
                onClick={() => setTab(t)} 
                style={{
                  flex: 1, 
                  padding: '11px 4px', 
                  borderRadius: '11px', 
                  border: 'none', 
                  fontSize: '12.5px', 
                  fontWeight: '700',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '6px', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: active ? currentTheme.gradient : 'transparent',
                  color: active ? '#fff' : 'rgba(255, 255, 255, 0.45)',
                  boxShadow: active ? `0 6px 16px -4px ${currentTheme.glow}` : 'none',
                  zIndex: 2
                }}
              >
                {icon}{label}
              </button>
            );
          })}
        </div>

        {/* LOCKOUT TIME BANNER */}
        {lockoutTimeLeft > 0 && (
          <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', color: '#ff6b6b', fontSize: '13px', marginBottom: '24px', alignItems: 'center' }}>
            <LockKeyhole size={16} />
            <span>Too many attempts. Locked out for <b>{lockoutTimeLeft}s</b></span>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* ── SIGN IN TAB ── */}
          {tab === 'signin' && (
            <motion.div key="signin" {...formVariants}>
              <form onSubmit={handleSignIn}>
                
                {/* Role Selector Component */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Select Workspace Role</label>
                  <RoleSelector selected={loginForm.role} onSelect={role => setLoginForm({ ...loginForm, role })} />
                </div>

                <InputField
                  label="Name / Username" 
                  icon={Users} 
                  placeholder="Username (optional)"
                  value={loginForm.name} 
                  onChange={e => setLoginForm({ ...loginForm, name: e.target.value })}
                  themeColor={currentTheme.primary}
                />
                <InputField
                  label="Email Address" 
                  icon={Mail} 
                  placeholder="name@company.com"
                  value={loginForm.email} 
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  themeColor={currentTheme.primary}
                />
                <InputField
                  label="Password" 
                  icon={Lock}
                  type={showPass ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={loginForm.password} 
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  themeColor={currentTheme.primary}
                  rightEl={
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px', display: 'flex', outline: 'none' }}
                      className="eye-toggle"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.45)', userSelect: 'none' }} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={e => setRememberMe(e.target.checked)} 
                      style={{ 
                        accentColor: currentTheme.primary,
                        width: '15px',
                        height: '15px',
                        cursor: 'pointer'
                      }} 
                    />
                    Remember workspace
                  </label>
                  <span onClick={() => setTab('otp')} style={{ fontSize: '13px', color: currentTheme.primary, cursor: 'pointer', fontWeight: '700', transition: 'color 0.3s' }} className="forgot-password">
                    Passwordless OTP?
                  </span>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || lockoutTimeLeft > 0} 
                  style={{
                    width: '100%', 
                    padding: '15px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    cursor: 'pointer',
                    background: currentTheme.gradient,
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '15px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    boxShadow: `0 8px 24px -4px ${currentTheme.glow}`, 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: loading || lockoutTimeLeft > 0 ? 0.7 : 1
                  }}
                  className="submit-btn"
                >
                  {loading ? <><span className="btn-spinner" /> Authenticating...</> : <>Enter Workspace <ArrowRight size={16} /></>}
                </button>
              </form>

              {/* SOCIAL LOGINS */}
              <div style={{ marginTop: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Alternative Portal Auth</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                </div>
                
                <button 
                  type="button" 
                  onClick={() => triggerOAuth('google')} 
                  style={{
                    width: '100%', 
                    padding: '13px', 
                    marginBottom: '10px', 
                    borderRadius: '12px',
                    background: '#ffffff', 
                    border: '1px solid #e0e0e0', 
                    color: '#202124',
                    cursor: 'pointer', 
                    fontWeight: '700', 
                    fontSize: '14px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className="google-auth-btn"
                >
                  <GoogleIcon /> Continue with Google
                </button>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <SocialBtn icon={GitHubIcon} label="GitHub" onClick={() => triggerOAuth('github')} />
                  <SocialBtn icon={MicrosoftIcon} label="Microsoft" onClick={() => triggerOAuth('microsoft')} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SIGN UP TAB ── */}
          {tab === 'signup' && (
            <motion.div key="signup" {...formVariants}>
              <form onSubmit={handleSignUp}>
                
                {/* Role Selector Component */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Select Registration Role</label>
                  <RoleSelector selected={signUpForm.role} onSelect={role => setSignUpForm({ ...signUpForm, role })} />
                </div>

                <InputField 
                  label="Full Name" 
                  icon={Users} 
                  placeholder="Your Name" 
                  required 
                  value={signUpForm.name} 
                  onChange={e => setSignUpForm({ ...signUpForm, name: e.target.value })} 
                  themeColor={currentTheme.primary}
                />
                
                <InputField 
                  label="Company Email" 
                  icon={Mail} 
                  type="email" 
                  placeholder="name@company.com" 
                  required 
                  value={signUpForm.email} 
                  onChange={e => setSignUpForm({ ...signUpForm, email: e.target.value })} 
                  themeColor={currentTheme.primary}
                />
                
                <InputField
                  label="Password" 
                  icon={Lock} 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="•••••••• (Min 6 chars)" 
                  required
                  value={signUpForm.password} 
                  onChange={e => setSignUpForm({ ...signUpForm, password: e.target.value })}
                  themeColor={currentTheme.primary}
                  rightEl={
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px', display: 'flex', outline: 'none' }}
                      className="eye-toggle"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                <button 
                  type="submit" 
                  disabled={loading} 
                  style={{
                    width: '100%', 
                    padding: '15px', 
                    marginTop: '10px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    cursor: 'pointer',
                    background: currentTheme.gradient,
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '15px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    boxShadow: `0 8px 24px -4px ${currentTheme.glow}`, 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                    opacity: loading ? 0.7 : 1
                  }}
                  className="submit-btn"
                >
                  {loading ? <><span className="btn-spinner" /> Launching...</> : <>Create Employee Account <ArrowRight size={16} /></>}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── MAGIC OTP TAB ── */}
          {tab === 'otp' && (
            <motion.div key="otp" {...formVariants}>
              {!otpSent ? (
                <form onSubmit={handleRequestOTP}>
                  
                  {/* Role Selector Component */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Select Access Role</label>
                    <RoleSelector selected={otpRole} onSelect={setOtpRole} />
                  </div>
                  
                  <InputField 
                    label="Registered Work Email" 
                    icon={Mail} 
                    type="email" 
                    placeholder="name@company.com" 
                    required 
                    value={otpEmail} 
                    onChange={e => setOtpEmail(e.target.value)} 
                    themeColor={currentTheme.primary}
                  />

                  <button 
                    type="submit" 
                    disabled={loading} 
                    style={{
                      width: '100%', 
                      padding: '15px', 
                      marginTop: '10px', 
                      borderRadius: '12px', 
                      border: 'none', 
                      cursor: 'pointer',
                      background: currentTheme.gradient,
                      color: '#fff', 
                      fontWeight: '700', 
                      fontSize: '15px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px',
                      boxShadow: `0 8px 24px -4px ${currentTheme.glow}`,
                      opacity: loading ? 0.7 : 1,
                      transition: 'all 0.3s'
                    }}
                    className="submit-btn"
                  >
                    {loading ? <><span className="btn-spinner" /> Dispatching...</> : <>Request Magic Access OTP <ArrowRight size={16} /></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <button 
                    type="button" 
                    onClick={() => setOtpSent(false)} 
                    style={{ background: 'none', border: 'none', color: currentTheme.primary, cursor: 'pointer', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px', padding: 0, outline: 'none' }}
                  >
                    <ArrowLeft size={14} /> Change Email
                  </button>
                  
                  <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: '1.5' }}>
                    Enter the 6-digit magic key dispatched to <b style={{ color: '#fff' }}>{otpEmail}</b>
                  </p>
                  
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }} onPaste={handleOtpPaste}>
                    {otpDigits.map((val, idx) => (
                      <input 
                        key={idx} 
                        ref={el => otpRefs.current[idx] = el} 
                        type="text" 
                        maxLength={1} 
                        pattern="[0-9]" 
                        inputMode="numeric" 
                        value={val}
                        onChange={e => handleOtpDigitChange(e.target.value, idx)} 
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                        style={{
                          width: '46px', 
                          height: '54px', 
                          textAlign: 'center', 
                          fontSize: '22px', 
                          fontWeight: '800',
                          background: 'rgba(255,255,255,0.03)', 
                          border: '1.5px solid',
                          borderColor: val ? currentTheme.primary : 'rgba(255,255,255,0.08)',
                          borderRadius: '12px', 
                          color: '#fff', 
                          outline: 'none', 
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: val ? `0 0 15px -3px ${currentTheme.primary}40` : 'none'
                        }} 
                      />
                    ))}
                  </div>

                  <div style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Clock size={14} />
                    {otpCountdown > 0 ? (
                      <span>Resend request in <b style={{ color: '#fff' }}>{otpCountdown}s</b></span>
                    ) : (
                      <span onClick={handleRequestOTP} style={{ color: currentTheme.primary, cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RefreshCw size={12} /> Resend OTP Code
                      </span>
                    )}
                  </div>

                  {demoOtpCode && (
                    <div style={{ background: 'rgba(0, 212, 170, 0.05)', border: '1px dashed rgba(0, 212, 170, 0.25)', borderRadius: '12px', padding: '14px', textAlign: 'center', fontSize: '12px', color: '#00d4aa', marginBottom: '20px' }}>
                      <b>🧪 Sandbox Testing Key:</b>
                      <span style={{ fontFamily: 'monospace', fontWeight: '900', fontSize: '16px', marginLeft: '10px', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '6px', letterSpacing: '2px' }}>{demoOtpCode}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading} 
                    style={{
                      width: '100%', 
                      padding: '15px', 
                      borderRadius: '12px', 
                      border: 'none', 
                      cursor: 'pointer',
                      background: currentTheme.gradient,
                      color: '#fff', 
                      fontWeight: '700', 
                      fontSize: '15px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px',
                      boxShadow: `0 8px 24px -4px ${currentTheme.glow}`,
                      opacity: loading ? 0.7 : 1,
                      transition: 'all 0.3s'
                    }}
                    className="submit-btn"
                  >
                    {loading ? <><span className="btn-spinner" /> Verifying...</> : <>Decrypt & Connect 🚀</>}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── MODAL DIALOGS FOR OAUTH FLOWS ─── */}
      <AnimatePresence>
        {oauthPopup && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(3,3,7,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(8px)', padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              style={{
                width: '100%', 
                maxWidth: '460px', 
                borderRadius: '20px', 
                overflow: 'hidden',
                background: 'rgba(15, 15, 27, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: '#e2e8f0',
                boxShadow: '0 30px 70px rgba(0,0,0,0.8), 0 0 50px rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              {/* Window Header Emulation */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span onClick={() => setOauthPopup(null)} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block', cursor: 'pointer' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '4px 16px', borderRadius: '20px', width: '55%', textAlign: 'center', fontFamily: 'monospace', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  🔒 {oauthPopup.provider === 'google' ? 'accounts.google.com' : oauthPopup.provider === 'github' ? 'github.com/login/oauth' : 'login.live.com'}
                </div>
                <span onClick={() => setOauthPopup(null)} style={{ cursor: 'pointer', fontSize: '18px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>×</span>
              </div>

              <div style={{ padding: '32px 28px' }}>
                {oauthStep === 1 ? (
                  <>
                    {/* GOOGLE ACC SELECTOR EMULATION */}
                    {oauthPopup.provider === 'google' && (
                      <div style={{ textAlign: 'center' }}>
                        <svg style={{ width: '40px', height: '40px', marginBottom: '16px' }} viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Sign in with Google</h2>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>to continue to <b style={{ color: '#6c63ff' }}>EMS Pro</b></p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                          {[
                            { email: 'admin@ems.com', name: 'Admin Singh', role: 'admin' }, 
                            { email: 'hr@ems.com', name: 'HR Manager', role: 'hr' }, 
                            { email: 'emp@ems.com', name: 'Rahul Sharma', role: 'employee' }
                          ].map(acc => (
                            <div 
                              key={acc.email} 
                              onClick={() => { setOauthEmail(acc.email); setOauthName(acc.name); setOauthRole(acc.role); setTimeout(handleOAuthSubmit, 100); }}
                              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s', textAlign: 'left' }}
                              className="oauth-account-item"
                            >
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4285f4, #34a853)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>{acc.name.charAt(0)}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{acc.name}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{acc.email}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'rgba(255,255,255,0.2)' }}>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or Sandbox Custom Login</span>
                          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                        </div>
                        
                        <input 
                          type="email" 
                          placeholder="name@company.com" 
                          value={oauthEmail} 
                          onChange={e => setOauthEmail(e.target.value)} 
                          style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '14px', color: '#fff', outline: 'none', marginBottom: '10px', boxSizing: 'border-box' }} 
                        />
                        <button type="button" onClick={handleOAuthSubmit} style={{ width: '100%', padding: '12px', background: '#4285F4', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)' }}>Use Google Sandbox Account</button>
                      </div>
                    )}

                    {/* GITHUB ACC SELECTOR EMULATION */}
                    {oauthPopup.provider === 'github' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                          <GitHubIcon />
                          <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.15)' }}>⇄</span>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#6c63ff,#00d4aa)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px' }}>E</div>
                        </div>
                        
                        <h3 style={{ textAlign: 'center', fontSize: '18px', color: '#fff', marginBottom: '6px' }}>Authorize EMS Pro</h3>
                        <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>EMS Pro requests authorization to associate your public profile and email.</p>
                        
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <input 
                            type="email" 
                            required 
                            placeholder="GitHub Registered Email" 
                            value={oauthEmail} 
                            onChange={e => setOauthEmail(e.target.value)} 
                            style={{ width: '100%', padding: '11px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
                          />
                          <input 
                            type="text" 
                            placeholder="GitHub Profile Username" 
                            value={oauthName} 
                            onChange={e => setOauthName(e.target.value)} 
                            style={{ width: '100%', padding: '11px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
                          />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="button" onClick={() => setOauthPopup(null)} style={{ flex: 1, padding: '11px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
                          <button type="button" onClick={handleOAuthSubmit} style={{ flex: 1, padding: '11px', background: '#2ea44f', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 12px rgba(46, 164, 79, 0.3)' }}>Authorize EMS</button>
                        </div>
                      </div>
                    )}

                    {/* MICROSOFT ACC SELECTOR EMULATION */}
                    {oauthPopup.provider === 'microsoft' && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                          <MicrosoftIcon />
                          <span style={{ fontWeight: '700', color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginLeft: '4px' }}>Microsoft Portal</span>
                        </div>
                        
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '6px', color: '#fff' }}>Sign in</h2>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>to continue to EMS Pro Workspace</p>
                        
                        <input 
                          type="email" 
                          placeholder="Email, phone or Skype" 
                          value={oauthEmail} 
                          onChange={e => setOauthEmail(e.target.value)} 
                          style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none', marginBottom: '12px', borderRadius: '10px', boxSizing: 'border-box' }} 
                        />
                        <input 
                          type="text" 
                          placeholder="Display Name (optional)" 
                          value={oauthName} 
                          onChange={e => setOauthName(e.target.value)} 
                          style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none', marginBottom: '24px', borderRadius: '10px', boxSizing: 'border-box' }} 
                        />
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button onClick={() => setOauthPopup(null)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
                          <button onClick={handleOAuthSubmit} style={{ padding: '10px 24px', background: '#0067b8', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 12px rgba(0, 103, 184, 0.3)' }}>Next</button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Step 2: role selection for OAuth */
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', textAlign: 'center', marginBottom: '6px', color: '#fff' }}>Complete Registration</h3>
                    <p style={{ fontSize: '13px', textAlign: 'center', marginBottom: '24px', color: 'rgba(255,255,255,0.4)' }}>Select your active role for <b>{oauthEmail}</b></p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                      {ROLES.map(r => {
                        const active = oauthRole === r.role;
                        return (
                          <div 
                            key={r.role} 
                            onClick={() => setOauthRole(r.role)} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '12px', 
                              padding: '14px', 
                              borderRadius: '14px', 
                              border: '1px solid',
                              borderColor: active ? r.color : 'rgba(255,255,255,0.06)', 
                              cursor: 'pointer', 
                              background: active ? `${r.color}15` : 'rgba(255,255,255,0.02)', 
                              transition: 'all 0.2s' 
                            }}
                          >
                            <span style={{ fontSize: '24px' }}>{r.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: active ? '#fff' : 'rgba(255,255,255,0.7)' }}>{r.label}</div>
                              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{r.desc}</div>
                            </div>
                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${active ? r.color : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {active && <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.color }} />}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={handleOAuthSubmit} 
                      disabled={loading || !oauthRole} 
                      style={{ 
                        width: '100%', 
                        padding: '14px', 
                        background: '#6c63ff', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        fontWeight: '700', 
                        fontSize: '14px', 
                        opacity: !oauthRole ? 0.5 : 1,
                        boxShadow: '0 6px 20px -4px rgba(108, 99, 255, 0.4)'
                      }}
                    >
                      {loading ? 'Registering...' : 'Complete Registration'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .btn-spinner { 
          width: 16px; 
          height: 16px; 
          border: 2px solid rgba(255,255,255,0.3); 
          border-top-color: #fff; 
          border-radius: 50%; 
          display: inline-block; 
          animation: spin 0.7s linear infinite; 
        }
        
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        
        input::placeholder { 
          color: rgba(255,255,255,0.2) !important; 
        }

        .floating-orb {
          animation: floatOrb 10s ease-in-out infinite alternate;
        }

        .floating-orb:nth-child(2) {
          animation-duration: 15s;
          animation-delay: -3s;
        }

        @keyframes floatOrb {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -40px) scale(1.05);
          }
          100% {
            transform: translate(-20px, 30px) scale(0.95);
          }
        }

        /* Hover interactions for custom design */
        .role-select-btn:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(255,255,255,0.15) !important;
        }
        
        .social-btn:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: #fff !important;
        }

        .google-auth-btn:hover {
          background: #f1f3f4 !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
        }

        .forgot-password:hover {
          text-decoration: underline;
          opacity: 0.9;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .oauth-account-item:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.12) !important;
        }

        /* Floating background particles */
        .bg-particle {
          animation: floatUp 15s linear infinite;
          opacity: 0;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-200px) scale(1.3);
            opacity: 0;
          }
        }

        /* 3D Transform pop-out depth on card hover */
        .login-card > * {
          transform: translateZ(20px);
        }
        
        /* Smooth scrolling */
        body {
          margin: 0;
          padding: 0;
          background: #06060c;
        }
      `}</style>
    </div>
  );
}
