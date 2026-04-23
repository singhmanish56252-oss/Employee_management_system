import React, { useEffect, useState } from 'react';
import { getJobs } from '../../api/services';
import { Badge } from '../../components/UI';
import { Briefcase, MapPin, Clock, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function PublicHome() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getJobs({ status:'open', limit:6 }).then(({ data }) => setJobs(data.jobs)).catch(()=>{});
  }, []);

  const stats = [
    { label:'Total Employees', value:'500+', icon:'👥' },
    { label:'Open Positions', value:`${jobs.length}+`, icon:'💼' },
    { label:'Departments', value:'12+', icon:'🏢' },
    { label:'Years Growing', value:'5+', icon:'📈' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav className="public-nav">
        <div className="public-nav-brand">
          <div className="public-nav-logo">EMS</div>
          EMS Pro
        </div>
        <div className="public-nav-links">
          <a href="#jobs" className="public-nav-link">Jobs</a>
          <a href="#about" className="public-nav-link">About</a>
          <Link to="/login">
            <button className="btn btn-primary btn-sm">Sign In →</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div>
          <div className="hero-badge">🚀 Enterprise Employee Management</div>
          <h1 className="hero-title">
            Build Your Dream<br /><span className="gradient-text">Team With EMS Pro</span>
          </h1>
          <p className="hero-subtitle">
            A powerful, full-featured employee management system designed for modern organizations.
            Manage hiring, attendance, payroll and more — all in one place.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={()=>navigate('/login')}>Get Started →</button>
            <a href="#jobs"><button className="btn btn-outline btn-lg">View Open Positions</button></a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding:'60px 40px', background:'var(--bg-secondary)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, textAlign:'center' }}>
          {stats.map((s,i) => (
            <div key={i}>
              <div style={{ fontSize:36 }}>{s.icon}</div>
              <div style={{ fontSize:32, fontWeight:900, color:'var(--accent)', marginTop:8 }}>{s.value}</div>
              <div style={{ fontSize:14, color:'var(--text-secondary)', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Jobs */}
      <section id="jobs" style={{ padding:'80px 40px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:-1 }}>Open <span className="gradient-text">Positions</span></h2>
          <p style={{ color:'var(--text-secondary)', marginTop:8, fontSize:16 }}>Join our growing team and make an impact</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:20 }}>
          {jobs.length === 0
            ? <p style={{ textAlign:'center', color:'var(--text-muted)', gridColumn:'1/-1', padding:60 }}>No open positions right now. Check back soon!</p>
            : jobs.map(job => (
            <div key={job._id} className="job-card" onClick={()=>navigate(`/jobs/${job._id}`)}>
              <div className="job-card-header">
                <div>
                  <div className="job-card-title">{job.title}</div>
                  <div className="job-card-dept">{job.department}</div>
                </div>
                <Badge status={job.type} />
              </div>
              <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, marginTop:8 }}>
                {job.description?.slice(0,100)}...
              </p>
              <div className="job-card-meta">
                <div className="job-meta-item"><MapPin size={11}/>{job.location||'Remote'}</div>
                {job.experience && <div className="job-meta-item"><Clock size={11}/>{job.experience}</div>}
                {job.salaryMin && <div className="job-meta-item"><DollarSign size={11}/>₹{(job.salaryMin/1000).toLocaleString()}K–{(job.salaryMax/1000).toLocaleString()}K</div>}
                <div className="job-meta-item"><Users size={11}/>{job.applicationsCount||0} applied</div>
              </div>
              <button className="btn btn-outline btn-sm" style={{ marginTop:16, width:'100%', justifyContent:'center' }}>
                View & Apply <ArrowRight size={14}/>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign:'center', padding:'32px', borderTop:'1px solid var(--border)', color:'var(--text-muted)', fontSize:13 }}>
        <div style={{ fontWeight:700, color:'var(--text-secondary)', marginBottom:8 }}>EMS Pro — Employee Management System</div>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
}
