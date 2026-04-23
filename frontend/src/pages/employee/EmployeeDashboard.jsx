import React, { useEffect, useState } from 'react';
import { getEmployeeDashboard, applyLeave } from '../../api/services';
import { StatCard, LoadingSpinner, PageHeader, Badge, Modal, Btn, Input } from '../../components/UI';
import { Calendar, Clock, DollarSign, FileText, Plus } from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LEAVE_TYPES = ['sick','casual','earned','maternity','paternity','unpaid'];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaveModal, setLeaveModal] = useState(false);
  const [payslipModal, setPayslipModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [saving, setSaving] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ leaveType:'sick', startDate:'', endDate:'', reason:'' });

  const fetch = () => {
    getEmployeeDashboard()
      .then(({ data }) => setData(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleLeave = async () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) return toast.error('Fill all fields');
    const days = Math.ceil((new Date(leaveForm.endDate) - new Date(leaveForm.startDate)) / (1000*60*60*24)) + 1;
    if (days <= 0) return toast.error('Invalid dates');
    setSaving(true);
    try {
      await applyLeave({ ...leaveForm, employee: data?.employee?._id, days });
      toast.success('Leave applied successfully!');
      setLeaveModal(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to apply'); }
    finally { setSaving(false); }
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  const { employee, stats = {}, recentLeaves = [], recentPayroll = [] } = data || {};
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <Layout>
      <PageHeader title="My Dashboard"
        action={<Btn variant="primary" size="md" onClick={()=>setLeaveModal(true)}><Plus size={16}/>Apply Leave</Btn>}
      />

      <div className="welcome-banner" style={{ background:'linear-gradient(135deg, rgba(255,107,107,0.15), rgba(255,154,60,0.08))', borderColor:'rgba(255,107,107,0.3)' }}>
        <div className="welcome-text">
          <h2>{greeting}, {user?.name?.split(' ')[0]}! 👋</h2>
          {employee && <p>{employee.designation} — {employee.department}</p>}
          <p className="welcome-time">{now.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <div className="welcome-emoji">🧑‍💻</div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Calendar} label="Days Present (Month)" value={stats.presentDays || 0} color="#00d4aa" />
        <StatCard icon={Clock} label="Total Hours (Month)" value={`${stats.totalHours || 0}h`} color="#6c63ff" />
        <StatCard icon={FileText} label="Pending Leaves" value={stats.pendingLeaves || 0} color="#ff6b6b" />
        <StatCard icon={DollarSign} label="Last Net Salary" value={recentPayroll[0] ? `₹${Number(recentPayroll[0].netSalary).toLocaleString()}` : '—'} color="#ffd93d" />
      </div>

      <div className="charts-grid">
        {/* Leave History */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">Recent Leaves</h3></div>
          {recentLeaves.length === 0
            ? <p style={{ textAlign:'center', color:'var(--text-muted)', padding:32 }}>No leaves applied yet</p>
            : recentLeaves.map(l => (
              <div key={l._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14, textTransform:'capitalize' }}>{l.leaveType} Leave</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(l.startDate).toLocaleDateString()} → {new Date(l.endDate).toLocaleDateString()} ({l.days} days)</div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>{l.reason}</div>
                </div>
                <Badge status={l.status} />
              </div>
            ))
          }
        </div>

        {/* Payroll History */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">Recent Payslips</h3></div>
          {recentPayroll.length === 0
            ? <p style={{ textAlign:'center', color:'var(--text-muted)', padding:32 }}>No payslips yet</p>
            : recentPayroll.map(p => {
              const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              return (
                <div key={p._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight:700 }}>{MONTHS[p.month-1]} {p.year}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>Days worked: {p.daysWorked}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontWeight:800, color:'#00d4aa' }}>₹{Number(p.netSalary).toLocaleString()}</div>
                      <Badge status={p.status} />
                    </div>
                    <Btn variant="ghost" size="sm" onClick={() => { setSelectedPayslip(p); setPayslipModal(true); }}><FileText size={16} /></Btn>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal open={leaveModal} onClose={()=>setLeaveModal(false)} title="Apply for Leave" size="md">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <select className="form-select" value={leaveForm.leaveType} onChange={e=>setLeaveForm({...leaveForm,leaveType:e.target.value})}>
              {LEAVE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-grid">
            <Input label="Start Date" type="date" value={leaveForm.startDate} onChange={e=>setLeaveForm({...leaveForm,startDate:e.target.value})} />
            <Input label="End Date" type="date" value={leaveForm.endDate} onChange={e=>setLeaveForm({...leaveForm,endDate:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Reason *</label>
            <textarea className="form-select" rows={3} value={leaveForm.reason} onChange={e=>setLeaveForm({...leaveForm,reason:e.target.value})} placeholder="Reason for leave..." style={{ resize:'vertical' }} />
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <Btn variant="outline" size="md" onClick={()=>setLeaveModal(false)}>Cancel</Btn>
            <Btn variant="primary" size="md" loading={saving} onClick={handleLeave}>Apply Leave</Btn>
          </div>
        </div>
      </Modal>

      {/* Payslip Modal */}
      <Modal open={payslipModal} onClose={()=>setPayslipModal(false)} title="Payslip" size="md">
        {selectedPayslip && (
          <div style={{ fontFamily:'monospace' }}>
            <div style={{ textAlign:'center', marginBottom:20, paddingBottom:16, borderBottom:'2px dashed var(--border)' }}>
              <div style={{ fontSize:22, fontWeight:900, color:'var(--accent)' }}>EMS PRO</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>SALARY SLIP — {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][selectedPayslip.month-1].toUpperCase()} {selectedPayslip.year}</div>
            </div>
            <div className="form-grid" style={{ marginBottom:16 }}>
              <div><p style={{ fontSize:11, color:'var(--text-muted)' }}>EMPLOYEE</p><p style={{ fontWeight:700 }}>{employee?.firstName} {employee?.lastName}</p></div>
              <div><p style={{ fontSize:11, color:'var(--text-muted)' }}>DEPARTMENT</p><p style={{ fontWeight:700 }}>{employee?.department}</p></div>
              <div><p style={{ fontSize:11, color:'var(--text-muted)' }}>DAYS WORKED</p><p style={{ fontWeight:700 }}>{selectedPayslip.daysWorked}</p></div>
              <div><p style={{ fontSize:11, color:'var(--text-muted)' }}>STATUS</p><Badge status={selectedPayslip.status} /></div>
            </div>
            <div style={{ background:'var(--bg-secondary)', borderRadius:8, padding:16, marginBottom:16 }}>
              {[['Basic Salary','basicSalary'],['HRA','hra'],['Allowances','allowances'],['Overtime Pay','overtimePay'],['Bonus','bonus']].map(([label,key])=>(
                <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color:'#00d4aa', fontWeight:600 }}>+₹{Number(selectedPayslip[key]||0).toLocaleString()}</span>
                </div>
              ))}
              {[['Tax Deduction','taxDeduction'],['PF Deduction','pfDeduction'],['Other Deductions','otherDeductions']].map(([label,key])=>(
                <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color:'#ff6b6b', fontWeight:600 }}>-₹{Number(selectedPayslip[key]||0).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'var(--bg-secondary)', borderRadius:8, padding:16, marginBottom:16 }}>
              <h4 style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)', marginBottom:8 }}>EMPLOYER CONTRIBUTIONS (EPFO)</h4>
              {[['EPF Share (3.67%)','employerEPF'],['EPS Share (8.33%)','employerEPS']].map(([label,key])=>(
                <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color:'#ff9a3c', fontWeight:600 }}>₹{Number(selectedPayslip[key]||0).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px', background:'rgba(108,99,255,0.15)', border:'1px solid rgba(108,99,255,0.3)', borderRadius:8 }}>
              <span style={{ fontWeight:700 }}>NET SALARY</span>
              <span style={{ fontSize:20, fontWeight:900, color:'#6c63ff' }}>₹{Number(selectedPayslip.netSalary||0).toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'center', marginTop:20 }}>
              <Btn variant="outline" size="md" onClick={()=>window.print()}>🖨️ Print Payslip</Btn>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
