import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getJobs } from '../../api/services';
import { Badge } from '../../components/UI';
import { Briefcase, MapPin, Clock, DollarSign, Users, ArrowRight, ShieldCheck, CreditCard, Calendar, BarChart, ChevronDown, CheckCircle, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function PublicHome() {
  const [jobs, setJobs] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getJobs({ status: 'open', limit: 6 })
      .then(({ data }) => setJobs(data.jobs))
      .catch(() => {});
  }, []);

  const stats = [
    { label: 'Active Employees Managed', value: '1,240+', icon: '👥', color: 'var(--accent)' },
    { label: 'Payroll Automated', value: '₹4.8M+', icon: '💳', color: 'var(--accent-hr)' },
    { label: 'Open Positions', value: `${jobs.length || 5} Jobs`, icon: '💼', color: 'var(--accent-emp)' },
    { label: 'Corporate Partners', value: '45+ Orgs', icon: '📈', color: 'var(--info)' },
  ];

  const features = [
    {
      icon: <Users size={24} />,
      title: 'Workforce Hub',
      desc: 'Centralize all employee records, profiles, contract documents, skills inventory, and live directories in a high-speed unified vault.',
      color: 'var(--accent)',
      badge: 'Advanced Core'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Smart Attendance & Leaves',
      desc: 'One-click daily punch-in, geo-attendance, dynamic shift scheduling, and smart approval systems for personal and sick leaves.',
      color: 'var(--accent-hr)',
      badge: 'Real-time'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Automated Payroll Suite',
      desc: 'Automatically compute basic pay, allowances (HRA, TA), tax deductions, PF calculations, and generate compliant printable payslips in 1-click.',
      color: 'var(--accent-emp)',
      badge: 'Financials'
    },
    {
      icon: <BarChart size={24} />,
      title: 'AI Dashboard & Analytics',
      desc: 'Visual indicators for employee growth, turnover rates, payroll distributions, and performance graphs tailored for Admins & HR.',
      color: 'var(--info)',
      badge: 'Intelligence'
    }
  ];

  const testimonials = [
    {
      quote: "EMS Pro completely revolutionized how our human resources team operates. We went from messy spreadsheets to 100% automated payroll and attendance in under a week. Incredible system!",
      author: "Sneha Sen",
      role: "VP of HR, FinTech Labs",
      rating: 5,
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      quote: "The role-based authorization is perfectly secure and the employee interface is incredibly clean. Our developers absolutely love checking their payrolls and marking attendance directly.",
      author: "Rajesh Kumar",
      role: "Engineering Director, DevCorp",
      rating: 5,
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80"
    }
  ];

  const faqs = [
    {
      q: "How does the live Add Employee feature work?",
      a: "When an Admin or HR manager adds a new employee profile to the system, our platform instantly creates a corresponding live User account with the employee's email address and a secure default password (emp12345). The employee can instantly sign in without any manual system registration!"
    },
    {
      q: "Does it support custom role permissions?",
      a: "Yes! EMS Pro includes three natively isolated roles: Admin (complete system control and payroll processing), HR Manager (recruitment, job listings, employee directories, and leaves approvals), and Employees (viewing pay slips, individual attendance tracking, and internal job applications)."
    },
    {
      q: "Can we run automated payroll computations?",
      a: "Absolutely! The system automates gross salaries, employee/employer PF shares, tax slabs, and net salaries based on actual working days, auto-generating pristine downloadable PDF-ready pay slips."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* Translucent Premium Navbar */}
      <nav className="public-nav" style={{ 
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(13, 13, 26, 0.75)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="public-nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="public-nav-logo">EMS</div>
          <span style={{ fontWeight: '800', letterSpacing: '-0.5px' }}>EMS <span className="gradient-text">Pro</span></span>
        </div>
        <div className="public-nav-links">
          <a href="#features" className="public-nav-link">Features</a>
          <a href="#preview" className="public-nav-link">Live View</a>
          <a href="#jobs" className="public-nav-link">Open Positions</a>
          <a href="#faq" className="public-nav-link">FAQs</a>
          <Link to="/login">
            <button className="btn btn-primary btn-sm" style={{ padding: '8px 18px', borderRadius: '8px' }}>Sign In →</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.1fr 0.9fr', 
        gap: '40px', 
        alignItems: 'center', 
        textAlign: 'left', 
        maxWidth: '1240px', 
        margin: '0 auto', 
        padding: '160px 40px 100px' 
      }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <ShieldCheck size={14} /> ISO 27001 Certified Enterprise Portal
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: '1.05', fontWeight: '900', letterSpacing: '-2.5px' }}>
            Build & Manage<br />Your Dream Team<br />
            <span className="gradient-text">In One Live Platform</span>
          </h1>
          <p className="hero-subtitle" style={{ margin: '20px 0 36px 0', fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '580px' }}>
            Streamline your entire corporate workforce hierarchy. Manage onboarding, daily attendance logs, automated payroll calculations, secure role permissions, and active job postings from a single glassmorphic dashboard.
          </p>
          <div className="hero-cta" style={{ justifyContent: 'flex-start' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')} style={{ boxShadow: '0 8px 30px rgba(108,99,255,0.4)', borderRadius: '10px' }}>
              Launch Workspace →
            </button>
            <a href="#jobs">
              <button className="btn btn-outline btn-lg" style={{ borderRadius: '10px' }}>Explore Open Roles</button>
            </a>
          </div>
        </motion.div>

        {/* Right side: Stunning Glass Card Mockup overlaying custom image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'relative', width: '100%', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ 
            position: 'absolute', 
            width: '90%', 
            height: '90%', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)'
          }}>
            <img 
              src="/Employee_management_system/hero_dashboard.png" 
              alt="Futuristic Dashboard" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,26,0.9) 10%, transparent 90%)' }} />
          </div>

          {/* Floating Glass Dashboard Card */}
          <motion.div style={{
            position: 'absolute',
            bottom: '20px',
            right: '-10px',
            background: 'rgba(26, 26, 46, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            width: '280px',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideUp 0.8s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent)' }}>🚀 Live Status</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 8px var(--success)' }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>98.4%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Average Employee Punch-in Rate</div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6c63ff20', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px' }}>EMS</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600' }}>Admin Dashboard</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Systems fully synchronized</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Corporate Live Statistics Bar */}
      <section id="preview" style={{ padding: '60px 40px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <motion.div 
          style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {stats.map((s, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              style={{ 
                background: 'rgba(255,255,255,0.01)', 
                padding: '24px', 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.03)', 
                textAlign: 'center',
                boxShadow: 'inset 0 0 12px rgba(255,255,255,0.01)'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '500' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Advanced Features Matrix */}
      <section id="features" style={{ padding: '100px 40px', maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="hero-badge">💼 Features Guide</div>
          <h2 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px' }}>Everything You Need To <span className="gradient-text">Manage Talent</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px', maxWidth: '600px', margin: '8px auto 0' }}>An enterprise-ready architectural flow equipped with real-time computations.</p>
        </div>

        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            hidden: { opacity: 0 }
          }}
        >
          {features.map((f, i) => (
            <motion.div key={i} className="job-card" variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} style={{ 
              display: 'flex', 
              gap: '20px', 
              alignItems: 'flex-start',
              padding: '28px',
              background: 'var(--bg-card)',
              cursor: 'default'
            }}>
              <div style={{ 
                background: `${f.color}15`, 
                color: f.color, 
                padding: '16px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>{f.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{f.title}</h3>
                  <span style={{ fontSize: '10px', background: `${f.color}15`, color: f.color, padding: '2px 8px', borderRadius: '20px', fontWeight: '700' }}>{f.badge}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '10px', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Live Preview Testimonials */}
      <section style={{ padding: '80px 40px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>Endorsed by <span className="gradient-text">Industry Leaders</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>See why administrative hubs trust EMS Pro to run their daily routines.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border)', 
                padding: '32px', 
                borderRadius: '16px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(t.rating)].map((_, idx) => <Star key={idx} size={15} fill="var(--warning)" color="var(--warning)" />)}
                </div>
                <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.7' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
                  <img src={t.img} alt={t.author} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{t.author}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section id="faq" style={{ padding: '90px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>Frequently Asked <span className="gradient-text">Questions</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Got questions? We have direct answers for you.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              overflow: 'hidden',
              transition: 'all 0.2s ease'
            }}>
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{ 
                  width: '100%', 
                  padding: '20px 24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: 'none',
                  textAlign: 'left',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} style={{ transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }} />
              </button>
              {activeFaq === i && (
                <div style={{ padding: '0 24px 20px 24px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Jobs Portal */}
      <section id="jobs" style={{ padding: '90px 40px', maxWidth: '1100px', margin: '0 auto', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="hero-badge">🚀 We Are Hiring</div>
          <h2 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1px' }}>Explore <span className="gradient-text">Open Positions</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '16px' }}>Submit applications and fast-track your career directly inside EMS Pro.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1', padding: '60px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <Briefcase size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <p style={{ fontWeight: '500' }}>No active postings right now.</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Please check back soon for engineering and administrative vacancies!</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}`)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px' }}>
                        {job.companyName?.charAt(0) || 'E'}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{job.companyName || 'EMS Corp'}</div>
                      <div className="job-card-title" style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px', color: '#fff' }}>{job.title}</div>
                    </div>
                    <Badge status={job.type} />
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(0,212,170,0.1)', color: '#00d4aa', padding: '2px 8px', borderRadius: '12px', fontWeight: '600', textTransform: 'capitalize' }}>
                      💻 {job.workMode || 'onsite'}
                    </span>
                    <span style={{ fontSize: '11px', background: 'rgba(108,99,255,0.1)', color: '#6c63ff', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                      🎓 {job.standard || 'Graduate'}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {job.description?.slice(0, 100)}...
                  </p>
                </div>

                <div>
                  <div className="job-card-meta" style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <div className="job-meta-item"><MapPin size={12} /> {job.location || 'Remote'}</div>
                    {job.experience && <div className="job-meta-item"><Clock size={12} /> {job.experience}</div>}
                    {job.salaryMin && <div className="job-meta-item"><DollarSign size={12} /> ₹{(job.salaryMin / 1000).toLocaleString()}K–{(job.salaryMax / 1000).toLocaleString()}K</div>}
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: '16px', width: '100%', justifyContent: 'center', borderRadius: '8px' }}>
                    Review Specifications & Apply <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '48px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)', fontSize: '13px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: '800', color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>E</div>
              EMS Pro System
            </div>
            <p style={{ marginTop: '6px', maxWidth: '300px' }}>High-fidelity employee registry, secure roles, and automated workflows.</p>
          </div>
          <div>
            <p>© {new Date().getFullYear()} EMS Pro Suite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
