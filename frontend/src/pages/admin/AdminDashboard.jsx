import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Users, Briefcase, ClipboardList, DollarSign, Calendar, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
import { getAdminDashboard } from '../../api/services';
import { StatCard, LoadingSpinner, PageHeader } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

const COLORS = ['#6c63ff','#00d4aa','#ff6b6b','#ffd93d','#ff9a3c','#4ecdc4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background:'#1a1a2e', border:'1px solid #2a2a4a', borderRadius:8, padding:'10px 14px' }}>
      <p style={{ color:'#a0a0c0', fontSize:12 }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ color:p.color, fontWeight:700 }}>{p.name}: {p.value?.toLocaleString ? p.value.toLocaleString() : p.value}</p>)}
    </div>
  );
  return null;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(({ data }) => setData(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  const { stats = {}, charts = {} } = data || {};

  return (
    <Layout>
      <PageHeader title="Admin Dashboard" subtitle="System overview and analytics" />

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>{greeting}, {user?.name?.split(' ')[0]}! 👋</h2>
          <p>Here's what's happening in your organization today.</p>
          <p className="welcome-time">{now.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <div className="welcome-emoji">📊</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees || 0} sub={`${stats.activeEmployees || 0} active`} color="#6c63ff" trend={4} />
        <StatCard icon={UserCheck} label="New This Month" value={stats.newHires || 0} sub="Recent joinings" color="#00d4aa" trend={12} />
        <StatCard icon={Briefcase} label="Open Jobs" value={stats.openJobs || 0} sub={`${stats.totalJobs || 0} total`} color="#ff9a3c" trend={-2} />
        <StatCard icon={ClipboardList} label="Applications" value={stats.totalApplications || 0} sub="All time" color="#ffd93d" trend={8} />
        <StatCard icon={Calendar} label="Today Present" value={stats.todayAttendance || 0} sub="Attendance" color="#4ecdc4" />
        <StatCard icon={AlertCircle} label="Pending Leaves" value={stats.pendingLeaves || 0} sub="Awaiting approval" color="#ff6b6b" />
        <StatCard icon={DollarSign} label="Total Payroll" value={`₹${((stats.totalPayroll || 0)/100000).toFixed(1)}L`} sub="All time disbursed" color="#6c63ff" trend={5} />
        <StatCard icon={TrendingUp} label="Active Jobs" value={stats.openJobs || 0} sub="Currently hiring" color="#00d4aa" />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Department Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Employees by Department</h3>
          </div>
          {charts.departmentStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={charts.departmentStats} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={({ _id, count }) => `${_id}: ${count}`} labelLine={false}>
                  {charts.departmentStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>Add employees to see chart</p>}
        </div>

        {/* Monthly Payroll */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Monthly Payroll Trend</h3>
          </div>
          {charts.monthlyPayroll?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={charts.monthlyPayroll.map(d => ({ name: `${d._id.month}/${d._id.year}`, amount: d.total }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="name" stroke="#606080" fontSize={11} />
                <YAxis stroke="#606080" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="amount" stroke="#6c63ff" strokeWidth={2} dot={{ fill:'#6c63ff' }} name="Net Salary (₹)" />
              </LineChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>Process payroll to see trend</p>}
        </div>

        {/* Applications Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Application Trend</h3>
          </div>
          {charts.applicationTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={charts.applicationTrend.map(d => ({ name: d._id, count: d.count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="name" stroke="#606080" fontSize={11} />
                <YAxis stroke="#606080" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#00d4aa" radius={[4,4,0,0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign:'center', color:'var(--text-muted)', padding:40 }}>Post jobs to see applications</p>}
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Overview</h3>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { label: 'Total Employees', value: stats.totalEmployees || 0, color: '#6c63ff', pct: 100 },
              { label: 'Active Employees', value: stats.activeEmployees || 0, color: '#00d4aa', pct: stats.totalEmployees ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0 },
              { label: 'Open Positions', value: stats.openJobs || 0, color: '#ff9a3c', pct: stats.totalJobs ? Math.round((stats.openJobs / stats.totalJobs) * 100) : 0 },
              { label: 'Applications', value: stats.totalApplications || 0, color: '#ffd93d', pct: 100 },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontSize:13, fontWeight:700 }}>{item.value}</span>
                </div>
                <div style={{ height:6, background:'var(--border)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${item.pct}%`, background:item.color, borderRadius:3, transition:'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
