import React, { useEffect, useState } from 'react';
import { getHRDashboard } from '../../api/services';
import { StatCard, LoadingSpinner, PageHeader, Badge } from '../../components/UI';
import { Briefcase, ClipboardList, Calendar, Users } from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

export default function HRDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHRDashboard().then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  const { stats = {}, recentApplications = [] } = data || {};
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <Layout>
      <PageHeader title="HR Dashboard" subtitle="Recruitment and workforce overview" />

      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(78,205,196,0.08))', borderColor: 'rgba(0,212,170,0.3)' }}>
        <div className="welcome-text">
          <h2>{greeting}, {user?.name?.split(' ')[0]}! 🧑‍💼</h2>
          <p>Manage your team recruitment and HR operations.</p>
          <p className="welcome-time">{now.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <div className="welcome-emoji">👥</div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees || 0} sub={`${stats.newHires || 0} New this month`} color="#6c63ff" />
        <StatCard icon={Briefcase} label="Open Jobs" value={stats.openJobs || 0} color="#00d4aa" />
        <StatCard icon={ClipboardList} label="New Applications" value={stats.newApplications || 0} sub="Pending review" color="#ffd93d" />
        <StatCard icon={Calendar} label="Pending Leaves" value={stats.pendingLeaves || 0} sub="Awaiting approval" color="#ff6b6b" />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Applications</h3>
        </div>
        {recentApplications.length === 0 ? (
          <p style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>No recent applications</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {recentApplications.map(app => (
              <div key={app._id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'var(--bg-secondary)', borderRadius:10 }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{app.applicantName}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{app.job?.title || 'Unknown Position'}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(app.createdAt).toLocaleDateString()}</span>
                  <Badge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
