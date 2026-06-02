import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { getJobs } from '../../api/services';
import { Badge } from '../../components/UI';
import { Briefcase, MapPin, Clock, DollarSign, Users, ArrowRight, ShieldCheck, CreditCard, Calendar, BarChart, ChevronDown, CheckCircle, Star, Zap, Globe, Lock, Cpu, Sparkles, Play, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/* ─── Animated Counter ─── */
const AnimCounter = ({ end, suffix = '', prefix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ─── Floating Particles ─── */
const FloatingParticles = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="floating-particle"
        style={{
          position: 'absolute',
          width: `${2 + (i % 4)}px`,
          height: `${2 + (i % 4)}px`,
          borderRadius: '50%',
          left: `${(i * 3.3) % 100}%`,
          top: `${(i * 7.7) % 100}%`,
          background: i % 3 === 0 ? '#6c63ff' : i % 3 === 1 ? '#00d4aa' : '#ff6b6b',
          opacity: 0.4,
          animation: `floatParticle ${8 + (i % 5) * 2}s ease-in-out infinite`,
          animationDelay: `${i * -0.7}s`,
          boxShadow: `0 0 ${6 + (i % 3) * 4}px currentColor`,
        }}
      />
    ))}
  </div>
);

/* ─── Glowing Orb ─── */
const GlowOrb = ({ color, size, top, left, right, bottom, delay = 0 }) => (
  <div style={{
    position: 'absolute', width: size, height: size,
    borderRadius: '50%', background: color, filter: 'blur(120px)',
    opacity: 0.12, pointerEvents: 'none', top, left, right, bottom,
    animation: `pulseGlow 6s ease-in-out infinite`, animationDelay: `${delay}s`,
    zIndex: 0
  }} />
);

export default function PublicHome() {
  const [jobs, setJobs] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    getJobs({ status: 'open', limit: 6 })
      .then(({ data }) => setJobs(data.jobs))
      .catch(() => {});
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const t = setInterval(() => setActiveFeature(p => (p + 1) % 4), 4000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { label: 'Active Employees', value: 1240, suffix: '+', icon: '👥', color: '#6c63ff' },
    { label: 'Payroll Processed', value: 48, suffix: 'L+', prefix: '₹', icon: '💳', color: '#00d4aa' },
    { label: 'Open Positions', value: jobs.length || 5, suffix: '', icon: '💼', color: '#ff6b6b' },
    { label: 'Partner Companies', value: 45, suffix: '+', icon: '📈', color: '#0ea5e9' },
  ];

  const features = [
    {
      icon: <Users size={28} />, title: 'Workforce Hub',
      desc: 'Centralize all employee records, profiles, contract documents, skills inventory, and live directories in a high-speed unified vault.',
      color: '#6c63ff', badge: 'Core Platform',
      image: '/Employee_management_system/team_collaboration.png',
      highlights: ['Employee Directory', 'Document Vault', 'Skills Matrix', 'Org Charts']
    },
    {
      icon: <Calendar size={28} />, title: 'Smart Attendance',
      desc: 'One-click daily punch-in, geo-attendance, dynamic shift scheduling, and smart approval systems for personal and sick leaves.',
      color: '#00d4aa', badge: 'Real-time Tracking',
      image: '/Employee_management_system/attendance_feature.png',
      highlights: ['GPS Tracking', 'Shift Management', 'Leave Requests', 'Auto Reports']
    },
    {
      icon: <CreditCard size={28} />, title: 'Payroll Automation',
      desc: 'Auto-compute salaries, allowances, tax deductions, PF calculations, and generate compliant payslips in 1-click.',
      color: '#ff6b6b', badge: 'Financial Suite',
      image: '/Employee_management_system/payroll_analytics.png',
      highlights: ['Auto Salary', 'Tax Slabs', 'PF Calculator', 'PDF Payslips']
    },
    {
      icon: <BarChart size={28} />, title: 'AI Analytics',
      desc: 'Visual indicators for employee growth, turnover rates, payroll distributions, and performance graphs tailored for leadership.',
      color: '#0ea5e9', badge: 'Intelligence',
      image: '/Employee_management_system/hero_dashboard.png',
      highlights: ['Growth Charts', 'Turnover Analysis', 'Payroll Insights', 'KPI Tracking']
    }
  ];

  const testimonials = [
    {
      quote: "EMS Pro completely revolutionized how our HR team operates. We went from messy spreadsheets to 100% automated payroll and attendance in under a week!",
      author: "Sneha Sen", role: "VP of HR, FinTech Labs", rating: 5,
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      quote: "The role-based authorization is perfectly secure and the employee interface is clean. Our developers love checking payrolls and marking attendance directly.",
      author: "Rajesh Kumar", role: "Engineering Director, DevCorp", rating: 5,
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      quote: "Setting up was incredibly easy. The live dashboard and analytics gave us instant visibility into our workforce metrics. Highly recommended for growing teams.",
      author: "Priya Mehta", role: "COO, StartupGrid", rating: 5,
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80"
    }
  ];

  const faqs = [
    { q: "How does the live Add Employee feature work?", a: "When an Admin or HR manager adds a new employee, our platform instantly creates a User account with the employee's email and a secure default password (emp12345). The employee can sign in immediately!" },
    { q: "Does it support custom role permissions?", a: "Yes! EMS Pro includes three isolated roles: Admin (full control & payroll), HR Manager (recruitment, directories, leaves), and Employee (payslips, attendance, job applications)." },
    { q: "Can we run automated payroll computations?", a: "Absolutely! The system automates gross salaries, PF shares, tax slabs, and net salaries based on actual working days, generating downloadable PDF payslips in 1-click." },
    { q: "Is the data secure and encrypted?", a: "Yes, all data is encrypted in transit and at rest. We use JWT-based authentication, bcrypt password hashing, and role-based access control for maximum security." }
  ];

  const techStack = [
    { name: 'React', icon: '⚛️' }, { name: 'Node.js', icon: '🟢' },
    { name: 'MongoDB', icon: '🍃' }, { name: 'Express', icon: '🚀' },
    { name: 'JWT Auth', icon: '🔐' }, { name: 'REST API', icon: '🌐' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#06060c', overflow: 'hidden', position: 'relative' }}>
      
      {/* ─── INJECT STYLES ─── */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(-10px); opacity: 0.4; }
          75% { transform: translateY(-40px) translateX(20px); opacity: 0.5; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.18; transform: scale(1.1); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(108,99,255,0.2); }
          50% { border-color: rgba(108,99,255,0.5); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .feature-tab:hover { transform: translateY(-2px) !important; }
        .feature-tab.active { border-color: var(--c) !important; background: color-mix(in srgb, var(--c) 10%, transparent) !important; }
        .testimonial-card:hover { transform: translateY(-6px) !important; border-color: rgba(108,99,255,0.3) !important; }
        .tech-pill:hover { border-color: #6c63ff !important; background: rgba(108,99,255,0.1) !important; }
        .faq-item:hover { border-color: rgba(108,99,255,0.3) !important; }
        .job-card-enhanced:hover { border-color: #6c63ff !important; transform: translateY(-4px) !important; box-shadow: 0 20px 40px rgba(108,99,255,0.15) !important; }
        .nav-link-hover:hover { color: #fff !important; }
        .cta-btn-primary:hover { transform: translateY(-2px) !important; box-shadow: 0 12px 40px rgba(108,99,255,0.5) !important; }
        .cta-btn-outline:hover { border-color: #6c63ff !important; color: #6c63ff !important; background: rgba(108,99,255,0.05) !important; }
      `}</style>

      {/* ─── FLOATING PARTICLES ─── */}
      <FloatingParticles />

      {/* ─── GLOW ORBS ─── */}
      <GlowOrb color="#6c63ff" size="600px" top="-200px" left="-200px" />
      <GlowOrb color="#00d4aa" size="500px" bottom="-200px" right="-200px" delay={2} />
      <GlowOrb color="#ff6b6b" size="400px" top="40%" left="60%" delay={4} />

      {/* ─── GRID OVERLAY ─── */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 1
      }} />

      {/* ═══════════════ PREMIUM NAVBAR ═══════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
        background: 'rgba(6,6,12,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6c63ff, #9c47ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', fontSize: '14px', color: '#fff',
            boxShadow: '0 4px 20px rgba(108,99,255,0.4)'
          }}>E</div>
          <span style={{ fontWeight: '800', fontSize: '20px', color: '#fff', letterSpacing: '-0.5px' }}>
            EMS <span style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pro</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {[['#features', 'Features'], ['#preview', 'Dashboard'], ['#jobs', 'Careers'], ['#faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} className="nav-link-hover" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', fontWeight: '500', transition: 'color 0.3s', textDecoration: 'none' }}>{label}</a>
          ))}
          <Link to="/login">
            <button className="cta-btn-primary" style={{
              padding: '10px 24px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #6c63ff, #9c47ff)',
              color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
            }}>Launch App →</button>
          </Link>
        </div>
      </nav>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <motion.section style={{
        minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr',
        gap: '60px', alignItems: 'center', maxWidth: '1280px',
        margin: '0 auto', padding: '140px 48px 100px',
        position: 'relative', zIndex: 2, opacity: heroOpacity, scale: heroScale
      }}>
        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)',
              borderRadius: '24px', padding: '8px 18px', marginBottom: '28px',
              animation: 'borderGlow 3s ease-in-out infinite'
            }}
          >
            <Sparkles size={14} color="#6c63ff" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#6c63ff' }}>AI-Powered Enterprise Platform</span>
          </motion.div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(40px, 5.5vw, 68px)', lineHeight: '1.05',
            fontWeight: '900', letterSpacing: '-2.5px', color: '#fff', marginBottom: '24px'
          }}>
            Build & Manage<br />Your Dream Team<br />
            <span style={{
              background: 'linear-gradient(135deg, #6c63ff, #00d4aa, #ff6b6b, #6c63ff)',
              backgroundSize: '300% 300%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 4s ease infinite'
            }}>In One Platform</span>
          </h1>

          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', maxWidth: '540px', marginBottom: '36px' }}>
            Streamline your entire workforce — from onboarding and daily attendance to automated payroll calculations and live analytics — all from a single stunning dashboard.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="cta-btn-primary" onClick={() => navigate('/login')} style={{
              padding: '16px 32px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #6c63ff, #9c47ff)', color: '#fff',
              fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 8px 32px rgba(108,99,255,0.4)', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
            }}>
              <Zap size={18} /> Get Started Free
            </button>
            <a href="#preview">
              <button className="cta-btn-outline" style={{
                padding: '16px 28px', borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '15px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s'
              }}>
                <Play size={16} /> Watch Demo
              </button>
            </a>
          </div>

          {/* Tech Stack Pills */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
            {techStack.map((t, i) => (
              <div key={i} className="tech-pill" style={{
                padding: '6px 14px', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default',
                transition: 'all 0.3s'
              }}>
                <span>{t.icon}</span> {t.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Image & Floating Cards */}
        <motion.div
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: 'relative', width: '100%', height: '520px' }}
        >
          {/* Main Image */}
          <div style={{
            position: 'absolute', width: '95%', height: '85%', top: '5%', left: '2.5%',
            borderRadius: '24px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
          }}>
            <img src="/Employee_management_system/hero_dashboard.png" alt="Dashboard Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,12,0.95) 5%, rgba(6,6,12,0.3) 40%, transparent 70%)' }} />
          </div>

          {/* Floating Status Card */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', bottom: '40px', right: '-15px',
              background: 'rgba(12,12,24,0.9)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(108,99,255,0.2)', borderRadius: '18px',
              padding: '22px', width: '260px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 60px rgba(108,99,255,0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#6c63ff', letterSpacing: '1px' }}>🚀 Live Status</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 12px #00d4aa' }} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>98.4%</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Average Employee Punch-in Rate</div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginTop: '14px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '98.4%', background: 'linear-gradient(90deg, #6c63ff, #00d4aa)', borderRadius: '3px' }} />
            </div>
          </motion.div>

          {/* Floating User Card */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              position: 'absolute', top: '30px', left: '-20px',
              background: 'rgba(12,12,24,0.9)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,212,170,0.2)', borderRadius: '14px',
              padding: '16px 20px', boxShadow: '0 16px 32px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #00d4aa, #4ecdc4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', color: '#fff' }}>+5</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>New Hires Today</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Engineering & Design</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════════════ SCROLLING MARQUEE ═══════════════ */}
      <div style={{
        padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden',
        background: 'rgba(255,255,255,0.01)', position: 'relative', zIndex: 2
      }}>
        <div style={{ display: 'flex', animation: 'marquee 25s linear infinite', width: 'max-content' }}>
          {[...Array(2)].map((_, ri) => (
            <div key={ri} style={{ display: 'flex', gap: '48px', paddingRight: '48px' }}>
              {['Trusted by 45+ Organizations', '✦', '1,240+ Employees Managed', '✦', '₹4.8M+ Payroll Automated', '✦', 'ISO 27001 Certified', '✦', '99.9% Uptime SLA', '✦'].map((t, i) => (
                <span key={i} style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', letterSpacing: t === '✦' ? 0 : '0.5px' }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section id="preview" style={{ padding: '100px 48px', position: 'relative', zIndex: 2 }}>
        <motion.div
          style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, borderColor: `${s.color}40` }}
              style={{
                background: 'rgba(255,255,255,0.02)', padding: '32px 24px',
                borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center', transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: s.color, filter: 'blur(50px)', opacity: 0.08 }} />
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: s.color, letterSpacing: '-1px' }}>
                <AnimCounter end={s.value} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontWeight: '500' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════ FEATURES SHOWCASE ═══════════════ */}
      <section id="features" style={{ padding: '80px 48px 120px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div style={{ textAlign: 'center', marginBottom: '60px' }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '20px'
          }}>
            <Cpu size={14} color="#6c63ff" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#6c63ff' }}>Platform Features</span>
          </div>
          <h2 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-2px', color: '#fff' }}>
            Everything You Need To{' '}
            <span style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Manage Talent</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '12px', fontSize: '16px', maxWidth: '550px', margin: '12px auto 0' }}>
            Enterprise-grade tools with real-time analytics and automation.
          </p>
        </motion.div>

        {/* Feature Tabs + Image Showcase */}
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Left: Feature Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((f, i) => (
              <div
                key={i}
                className={`feature-tab ${activeFeature === i ? 'active' : ''}`}
                onClick={() => setActiveFeature(i)}
                style={{
                  '--c': f.color,
                  padding: '20px 22px', borderRadius: '16px', cursor: 'pointer',
                  border: '1px solid', borderColor: activeFeature === i ? `${f.color}40` : 'rgba(255,255,255,0.06)',
                  background: activeFeature === i ? `${f.color}08` : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: activeFeature === i ? '12px' : '0' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `${f.color}15`, color: f.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{f.title}</div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: f.color, background: `${f.color}15`, padding: '2px 8px', borderRadius: '10px' }}>{f.badge}</span>
                  </div>
                  <ChevronRight size={16} style={{ marginLeft: 'auto', color: activeFeature === i ? f.color : 'rgba(255,255,255,0.2)', transition: 'all 0.3s', transform: activeFeature === i ? 'rotate(90deg)' : 'none' }} />
                </div>
                <AnimatePresence>
                  {activeFeature === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', marginTop: '4px' }}>{f.desc}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                        {f.highlights.map((h, hi) => (
                          <span key={hi} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
                            <CheckCircle size={10} style={{ marginRight: '4px', verticalAlign: 'middle', color: f.color }} />{h}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right: Feature Image */}
          <div style={{
            position: 'relative', borderRadius: '24px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', height: '460px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
          }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeFeature}
                src={features[activeFeature].image}
                alt={features[activeFeature].title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AnimatePresence>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,12,0.8) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{features[activeFeature].title}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{features[activeFeature].badge}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section style={{ padding: '100px 48px', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div style={{ textAlign: 'center', marginBottom: '60px' }}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '38px', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff' }}>
              Loved by <span style={{ background: 'linear-gradient(135deg, #6c63ff, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Industry Leaders</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '8px', fontSize: '16px' }}>See why teams trust EMS Pro for their daily operations.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i} className="testimonial-card"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  padding: '32px', borderRadius: '20px', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', fontSize: '100px', color: 'rgba(108,99,255,0.04)', fontWeight: '900', lineHeight: 1 }}>"</div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '18px' }}>
                  {[...Array(t.rating)].map((_, idx) => <Star key={idx} size={14} fill="#ffd93d" color="#ffd93d" />)}
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.75', fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <img src={t.img} alt={t.author} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(108,99,255,0.3)' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{t.author}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ SECTION ═══════════════ */}
      <section id="faq" style={{ padding: '100px 48px', maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div style={{ textAlign: 'center', marginBottom: '48px' }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff' }}>
            Frequently Asked <span style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Questions</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Everything you need to know about EMS Pro.</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} className="faq-item"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s'
              }}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{
                  width: '100%', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'none', border: 'none', textAlign: 'left', color: '#fff',
                  fontWeight: '600', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} style={{
                  transform: activeFaq === i ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.3s', color: activeFaq === i ? '#6c63ff' : 'rgba(255,255,255,0.3)',
                  flexShrink: 0, marginLeft: '16px'
                }} />
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ padding: '0 24px 22px', color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.7' }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ JOBS SECTION ═══════════════ */}
      <section id="jobs" style={{ padding: '100px 48px', maxWidth: '1100px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', zIndex: 2 }}>
        <motion.div style={{ textAlign: 'center', marginBottom: '50px' }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '20px'
          }}>
            <Briefcase size={14} color="#ff6b6b" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#ff6b6b' }}>We're Hiring</span>
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff' }}>
            Explore <span style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff9a3c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Open Positions</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px' }}>
          {jobs.length === 0 ? (
            <div style={{
              textAlign: 'center', color: 'rgba(255,255,255,0.3)', gridColumn: '1/-1',
              padding: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <Briefcase size={40} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
              <p style={{ fontWeight: '600', fontSize: '16px' }}>No active postings right now</p>
              <p style={{ fontSize: '14px', marginTop: '6px' }}>Check back soon for new opportunities!</p>
            </div>
          ) : (
            jobs.map(job => (
              <motion.div key={job._id} className="job-card-enhanced"
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/jobs/${job._id}`)}
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: '28px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px',
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }} />
                    ) : (
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(108,99,255,0.15)', color: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>
                        {job.companyName?.charAt(0) || 'E'}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#6c63ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{job.companyName || 'EMS Corp'}</div>
                      <div style={{ fontSize: '17px', fontWeight: '700', marginTop: '3px', color: '#fff' }}>{job.title}</div>
                    </div>
                    <Badge status={job.type} />
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(0,212,170,0.1)', color: '#00d4aa', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' }}>💻 {job.workMode || 'onsite'}</span>
                    <span style={{ fontSize: '11px', background: 'rgba(108,99,255,0.1)', color: '#6c63ff', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' }}>🎓 {job.standard || 'Graduate'}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>{job.description?.slice(0, 110)}...</p>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '14px', marginTop: '18px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}><MapPin size={12} /> {job.location || 'Remote'}</span>
                    {job.experience && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}><Clock size={12} /> {job.experience}</span>}
                    {job.salaryMin && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}><DollarSign size={12} /> ₹{(job.salaryMin/1000).toLocaleString()}K–{(job.salaryMax/1000).toLocaleString()}K</span>}
                  </div>
                  <button style={{
                    marginTop: '18px', width: '100%', padding: '12px',
                    borderRadius: '12px', border: '1px solid rgba(108,99,255,0.2)',
                    background: 'rgba(108,99,255,0.05)', color: '#6c63ff',
                    fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    transition: 'all 0.3s', fontFamily: 'inherit'
                  }}>
                    Apply Now <ArrowUpRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section style={{ padding: '100px 48px', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{
            maxWidth: '900px', margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(156,71,255,0.08))',
            border: '1px solid rgba(108,99,255,0.2)', borderRadius: '28px',
            padding: '80px 60px', position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: '#6c63ff', filter: 'blur(150px)', opacity: 0.1 }} />
          <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: '#00d4aa', filter: 'blur(150px)', opacity: 0.08 }} />
          <h2 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-2px', color: '#fff', position: 'relative' }}>
            Ready to Transform Your<br />
            <span style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Workforce Management?</span>
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', marginTop: '16px', maxWidth: '500px', margin: '16px auto 0', position: 'relative' }}>
            Join 45+ organizations already using EMS Pro to streamline their HR operations.
          </p>
          <button className="cta-btn-primary" onClick={() => navigate('/login')} style={{
            padding: '18px 40px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #6c63ff, #9c47ff)', color: '#fff',
            fontWeight: '700', fontSize: '16px', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            marginTop: '36px', position: 'relative'
          }}>
            Start Free Trial → 
          </button>
        </motion.div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '48px 48px', position: 'relative', zIndex: 2
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #6c63ff, #9c47ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '900', fontSize: '11px', color: '#fff'
              }}>E</div>
              <span style={{ fontWeight: '800', fontSize: '16px', color: 'rgba(255,255,255,0.6)' }}>EMS Pro</span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', maxWidth: '300px' }}>
              High-fidelity employee management with secure roles and automated workflows.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Features', 'Careers', 'FAQ', 'Login'].map(l => (
              <a key={l} href={l === 'Login' ? undefined : `#${l.toLowerCase()}`}
                onClick={l === 'Login' ? () => navigate('/login') : undefined}
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color 0.3s', textDecoration: 'none' }}
                className="nav-link-hover"
              >{l}</a>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', width: '100%', textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            © {new Date().getFullYear()} EMS Pro Suite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
