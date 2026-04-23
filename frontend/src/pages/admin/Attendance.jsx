import React, { useEffect, useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { getAttendance, markAttendance, getLeaves, updateLeave, getEmployees } from '../../api/services';
import { Table, Badge, Modal, PageHeader, Select, Btn, Input, Pagination, LoadingSpinner } from '../../components/UI';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

export default function Attendance() {
  const [tab, setTab] = useState('attendance');
  const [records, setRecords] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const now = new Date();
  const [monthFilter, setMonthFilter] = useState(now.getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(now.getFullYear());
  const [form, setForm] = useState({ employee:'', date: now.toISOString().split('T')[0], checkIn:'', checkOut:'', status:'present', notes:'' });

  useEffect(() => {
    getEmployees({ limit:100 }).then(({ data }) => setEmployees(data.employees)).catch(()=>{});
  }, []);

  useEffect(() => {
    if (tab === 'attendance') fetchAttendance();
    else fetchLeaves();
  }, [tab, page, monthFilter, yearFilter]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const { data } = await getAttendance({ month: monthFilter, year: yearFilter, page, limit: 20 });
      setRecords(data.records); setPages(Math.ceil(data.total/20));
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const { data } = await getLeaves({});
      setLeaves(data.leaves);
    } catch { toast.error('Failed to load leaves'); }
    finally { setLoading(false); }
  };

  const handleMark = async () => {
    if (!form.employee || !form.date) return toast.error('Select employee and date');
    setSaving(true);
    try {
      await markAttendance(form);
      toast.success('Attendance marked!');
      setModal(false);
      fetchAttendance();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to mark'); }
    finally { setSaving(false); }
  };

  const handleLeave = async (id, status) => {
    try {
      await updateLeave(id, { status, remarks: status === 'approved' ? 'Approved by HR' : 'Rejected by HR' });
      toast.success(`Leave ${status}!`);
      fetchLeaves();
    } catch { toast.error('Update failed'); }
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const attCols = [
    { key: 'employee', label: 'Employee', render: r => r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : '—' },
    { key: 'empId', label: 'Emp ID', render: r => r.employee?.employeeId || '—' },
    { key: 'date', label: 'Date', render: r => new Date(r.date).toLocaleDateString() },
    { key: 'checkIn', label: 'Check In', render: r => r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '—' },
    { key: 'checkOut', label: 'Check Out', render: r => r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '—' },
    { key: 'workHours', label: 'Hours', render: r => r.workHours ? `${r.workHours}h` : '—' },
    { key: 'overtime', label: 'OT', render: r => r.overtime > 0 ? <span style={{ color:'#ffd93d' }}>{r.overtime}h</span> : '—' },
    { key: 'status', label: 'Status', render: r => <Badge status={r.status} /> },
  ];

  const leaveCols = [
    { key: 'employee', label: 'Employee', render: l => l.employee ? `${l.employee.firstName} ${l.employee.lastName}` : '—' },
    { key: 'dept', label: 'Department', render: l => l.employee?.department || '—' },
    { key: 'leaveType', label: 'Type', render: l => <Badge status={l.leaveType} /> },
    { key: 'dates', label: 'Dates', render: l => `${new Date(l.startDate).toLocaleDateString()} → ${new Date(l.endDate).toLocaleDateString()}` },
    { key: 'days', label: 'Days' },
    { key: 'reason', label: 'Reason', render: l => <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{l.reason}</span> },
    { key: 'status', label: 'Status', render: l => <Badge status={l.status} /> },
    { key: 'actions', label: 'Actions', render: l => l.status === 'pending' ? (
      <div style={{ display:'flex', gap:6 }}>
        <Btn variant="success" size="sm" onClick={()=>handleLeave(l._id,'approved')}><Check size={13}/> Approve</Btn>
        <Btn variant="danger" size="sm" onClick={()=>handleLeave(l._id,'rejected')}><X size={13}/> Reject</Btn>
      </div>
    ) : <span style={{ fontSize:12, color:'var(--text-muted)' }}>—</span> }
  ];

  return (
    <Layout>
      <PageHeader title="Attendance & Leaves" subtitle="Track workforce attendance and manage leave requests"
        action={<Btn variant="primary" size="md" onClick={()=>setModal(true)}><Plus size={16}/>Mark Attendance</Btn>}
      />

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, padding:4, width:'fit-content' }}>
        {['attendance','leaves'].map(t => (
          <button key={t} onClick={()=>setTab(t)}
            style={{ padding:'8px 24px', borderRadius:8, background: tab===t ? 'var(--accent)' : 'none',
              color: tab===t ? '#fff' : 'var(--text-secondary)', fontWeight:600, fontSize:14, transition:'all 0.2s', border:'none', cursor:'pointer', textTransform:'capitalize' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'attendance' && (
        <div className="card">
          <div className="filters-bar">
            <Select value={monthFilter} onChange={v=>setMonthFilter(Number(v))} options={MONTHS.map((m,i)=>({value:i+1,label:m}))} />
            <Select value={yearFilter} onChange={v=>setYearFilter(Number(v))} options={[2024,2025,2026].map(y=>({value:y,label:y}))} />
          </div>
          {loading ? <LoadingSpinner /> : <Table columns={attCols} data={records} />}
          <Pagination page={page} pages={pages} onPage={setPage} />
        </div>
      )}

      {tab === 'leaves' && (
        <div className="card">
          {loading ? <LoadingSpinner /> : <Table columns={leaveCols} data={leaves} />}
        </div>
      )}

      {/* Mark Attendance Modal */}
      <Modal open={modal} onClose={()=>setModal(false)} title="Mark Attendance" size="md">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="form-group">
            <label className="form-label">Employee *</label>
            <select className="form-select" value={form.employee} onChange={e=>setForm({...form,employee:e.target.value})}>
              <option value="">Select Employee</option>
              {employees.map(e=><option key={e._id} value={e._id}>{e.firstName} {e.lastName} ({e.employeeId})</option>)}
            </select>
          </div>
          <Input label="Date *" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
          <div className="form-grid">
            <Input label="Check In Time" type="datetime-local" value={form.checkIn} onChange={e=>setForm({...form,checkIn:e.target.value})} />
            <Input label="Check Out Time" type="datetime-local" value={form.checkOut} onChange={e=>setForm({...form,checkOut:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              {['present','absent','late','half-day','on-leave','holiday'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <Input label="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Optional notes..." />
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <Btn variant="outline" size="md" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn variant="primary" size="md" loading={saving} onClick={handleMark}>Mark Attendance</Btn>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
