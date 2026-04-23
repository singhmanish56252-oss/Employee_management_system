import React, { useEffect, useState } from 'react';
import { DollarSign, Play, CheckCircle, FileText, Edit } from 'lucide-react';
import { getPayroll, processPayroll, markPaid, updatePayroll } from '../../api/services';
import { Table, Badge, Modal, PageHeader, Select, Btn, Input, Pagination, LoadingSpinner, StatCard } from '../../components/UI';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

export default function Payroll() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [processModal, setProcessModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [payslipModal, setPayslipModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [statusFilter, setStatusFilter] = useState('');
  const [editForm, setEditForm] = useState({});

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await getPayroll({ month, year, status: statusFilter, page, limit: 10 });
      setRecords(data.records); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load payroll'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [month, year, statusFilter, page]);

  const handleProcess = async () => {
    setSaving(true);
    try {
      const { data } = await processPayroll({ month, year });
      toast.success(data.message || 'Payroll processed!');
      setProcessModal(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Process failed'); }
    finally { setSaving(false); }
  };

  const handleMarkPaid = async (id) => {
    try { await markPaid(id); toast.success('Marked as paid!'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      await updatePayroll(selected._id, editForm);
      toast.success('Payroll updated!');
      setEditModal(false);
      fetch();
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const totalNet = records.reduce((sum, r) => sum + r.netSalary, 0);
  const totalGross = records.reduce((sum, r) => sum + r.grossSalary, 0);
  const totalDeductions = records.reduce((sum, r) => sum + r.totalDeductions, 0);
  const paidCount = records.filter(r => r.status === 'paid').length;

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const cols = [
    { key: 'employee', label: 'Employee', render: r => r.employee ? (
      <div className="emp-name-col">
        <div className="emp-avatar">{r.employee.firstName?.[0]}{r.employee.lastName?.[0]}</div>
        <div>
          <div className="emp-name">{r.employee.firstName} {r.employee.lastName}</div>
          <div className="emp-id-tag">{r.employee.department}</div>
        </div>
      </div>
    ) : '—'},
    { key: 'period', label: 'Period', render: r => `${MONTHS[r.month-1]} ${r.year}` },
    { key: 'daysWorked', label: 'Days', render: r => <span style={{ color:'#00d4aa', fontWeight:700 }}>{r.daysWorked}</span> },
    { key: 'basicSalary', label: 'Basic (₹)', render: r => `₹${Number(r.basicSalary).toLocaleString()}` },
    { key: 'grossSalary', label: 'Gross (₹)', render: r => `₹${Number(r.grossSalary).toLocaleString()}` },
    { key: 'totalDeductions', label: 'Deductions', render: r => <span style={{ color:'#ff6b6b' }}>-₹{Number(r.totalDeductions).toLocaleString()}</span> },
    { key: 'netSalary', label: 'Net (₹)', render: r => <span style={{ fontWeight:800, color:'#00d4aa', fontSize:15 }}>₹{Number(r.netSalary).toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: r => <Badge status={r.status} /> },
    { key: 'actions', label: 'Actions', render: r => (
      <div style={{ display:'flex', gap:6 }}>
        <Btn variant="ghost" size="sm" onClick={()=>{setSelected(r);setPayslipModal(true);}} title="View Payslip"><FileText size={14}/></Btn>
        <Btn variant="outline" size="sm" onClick={()=>{setSelected(r);setEditForm({bonus:r.bonus||0,otherDeductions:r.otherDeductions||0});setEditModal(true);}} title="Edit"><Edit size={14}/></Btn>
        {r.status !== 'paid' && (
          <Btn variant="success" size="sm" onClick={()=>handleMarkPaid(r._id)} title="Mark Paid"><CheckCircle size={14}/></Btn>
        )}
      </div>
    )}
  ];

  return (
    <Layout>
      <PageHeader title="Payroll" subtitle="Manage salary and payslips"
        action={<Btn variant="primary" size="md" onClick={()=>setProcessModal(true)}><Play size={16}/>Process Payroll</Btn>}
      />

      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom:20 }}>
        <StatCard icon={DollarSign} label="Total Gross" value={`₹${(totalGross/1000).toFixed(1)}K`} color="#6c63ff" />
        <StatCard icon={DollarSign} label="Total Net" value={`₹${(totalNet/1000).toFixed(1)}K`} color="#00d4aa" />
        <StatCard icon={DollarSign} label="Total Deductions" value={`₹${(totalDeductions/1000).toFixed(1)}K`} color="#ff6b6b" />
        <StatCard icon={CheckCircle} label="Paid Out" value={paidCount} sub={`of ${total} records`} color="#ffd93d" />
      </div>

      <div className="card">
        <div className="filters-bar">
          <Select value={month} onChange={v=>setMonth(Number(v))} options={MONTHS.map((m,i)=>({value:i+1,label:m}))} />
          <Select value={year} onChange={v=>setYear(Number(v))} options={[2024,2025,2026].map(y=>({value:y,label:y}))} />
          <Select value={statusFilter} onChange={setStatusFilter} placeholder="All Status" options={['draft','processed','paid'].map(s=>({value:s,label:s}))} />
        </div>
        {loading ? <LoadingSpinner /> : <Table columns={cols} data={records} />}
        <Pagination page={page} pages={pages} onPage={setPage} />
      </div>

      {/* Process Payroll Modal */}
      <Modal open={processModal} onClose={()=>setProcessModal(false)} title="Process Payroll" size="sm">
        <div style={{ textAlign:'center', padding:'8px 0 20px' }}>
          <div style={{ fontSize:52, marginBottom:16 }}>💰</div>
          <h3 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Process {MONTHS[month-1]} {year} Payroll?</h3>
          <p style={{ color:'var(--text-secondary)', fontSize:14, marginBottom:24 }}>
            This will auto-calculate salaries for all active employees based on attendance records.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <Btn variant="outline" size="md" onClick={()=>setProcessModal(false)}>Cancel</Btn>
            <Btn variant="primary" size="md" loading={saving} onClick={handleProcess}>Process Now</Btn>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModal} onClose={()=>setEditModal(false)} title="Edit Payroll" size="sm">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Input label="Bonus (₹)" type="number" value={editForm.bonus||0} onChange={e=>setEditForm({...editForm,bonus:Number(e.target.value)})} />
          <Input label="Extra Deductions (₹)" type="number" value={editForm.otherDeductions||0} onChange={e=>setEditForm({...editForm,otherDeductions:Number(e.target.value)})} />
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <Btn variant="outline" size="md" onClick={()=>setEditModal(false)}>Cancel</Btn>
            <Btn variant="primary" size="md" loading={saving} onClick={handleEditSave}>Save</Btn>
          </div>
        </div>
      </Modal>

      {/* Payslip Modal */}
      <Modal open={payslipModal} onClose={()=>setPayslipModal(false)} title="Payslip" size="md">
        {selected && (
          <div style={{ fontFamily:'monospace' }}>
            <div style={{ textAlign:'center', marginBottom:20, paddingBottom:16, borderBottom:'2px dashed var(--border)' }}>
              <div style={{ fontSize:22, fontWeight:900, color:'var(--accent)' }}>EMS PRO</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>SALARY SLIP — {MONTHS[selected.month-1].toUpperCase()} {selected.year}</div>
            </div>
            <div className="form-grid" style={{ marginBottom:16 }}>
              <div><p style={{ fontSize:11, color:'var(--text-muted)' }}>EMPLOYEE</p><p style={{ fontWeight:700 }}>{selected.employee?.firstName} {selected.employee?.lastName}</p></div>
              <div><p style={{ fontSize:11, color:'var(--text-muted)' }}>DEPARTMENT</p><p style={{ fontWeight:700 }}>{selected.employee?.department}</p></div>
              <div><p style={{ fontSize:11, color:'var(--text-muted)' }}>DAYS WORKED</p><p style={{ fontWeight:700 }}>{selected.daysWorked}</p></div>
              <div><p style={{ fontSize:11, color:'var(--text-muted)' }}>STATUS</p><Badge status={selected.status} /></div>
            </div>
            <div style={{ background:'var(--bg-secondary)', borderRadius:8, padding:16, marginBottom:16 }}>
              {[['Basic Salary','basicSalary'],['HRA','hra'],['Allowances','allowances'],['Overtime Pay','overtimePay'],['Bonus','bonus']].map(([label,key])=>(
                <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color:'#00d4aa', fontWeight:600 }}>+₹{Number(selected[key]||0).toLocaleString()}</span>
                </div>
              ))}
              {[['Tax Deduction','taxDeduction'],['PF Deduction','pfDeduction'],['Other Deductions','otherDeductions']].map(([label,key])=>(
                <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color:'#ff6b6b', fontWeight:600 }}>-₹{Number(selected[key]||0).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'var(--bg-secondary)', borderRadius:8, padding:16, marginBottom:16 }}>
              <h4 style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)', marginBottom:8 }}>EMPLOYER CONTRIBUTIONS (EPFO)</h4>
              {[['EPF Share (3.67%)','employerEPF'],['EPS Share (8.33%)','employerEPS']].map(([label,key])=>(
                <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color:'#ff9a3c', fontWeight:600 }}>₹{Number(selected[key]||0).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px', background:'rgba(108,99,255,0.15)', border:'1px solid rgba(108,99,255,0.3)', borderRadius:8 }}>
              <span style={{ fontWeight:700 }}>NET SALARY</span>
              <span style={{ fontSize:20, fontWeight:900, color:'#6c63ff' }}>₹{Number(selected.netSalary||0).toLocaleString()}</span>
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
