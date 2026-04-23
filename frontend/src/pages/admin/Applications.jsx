import React, { useEffect, useState } from 'react';
import { Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { getApplications, updateApplicationStatus, deleteApplication } from '../../api/services';
import { Table, Badge, Modal, PageHeader, SearchBar, Select, Btn, Pagination, LoadingSpinner } from '../../components/UI';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const STAGES = ['pending','reviewed','shortlisted','interviewed','offered','hired','rejected'];

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await getApplications({ status: statusFilter, page, limit: 10 });
      setApps(data.applications); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [statusFilter, page]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return toast.error('Select a status');
    setSaving(true);
    try {
      await updateApplicationStatus(selected._id, { status: newStatus, notes });
      toast.success('Status updated!');
      setStatusModal(false);
      fetch();
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (app) => {
    if (!window.confirm('Delete this application?')) return;
    try { await deleteApplication(app._id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Delete failed'); }
  };

  const cols = [
    { key: 'name', label: 'Applicant', render: a => (
      <div>
        <div style={{ fontWeight:600 }}>{a.applicantName}</div>
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.applicantEmail}</div>
      </div>
    )},
    { key: 'job', label: 'Job', render: a => a.job?.title || '—' },
    { key: 'experience', label: 'Exp (yrs)', render: a => a.experience || '—' },
    { key: 'expectedSalary', label: 'Expected ₹', render: a => a.expectedSalary ? `₹${Number(a.expectedSalary).toLocaleString()}` : '—' },
    { key: 'status', label: 'Status', render: a => <Badge status={a.status} /> },
    { key: 'createdAt', label: 'Applied', render: a => new Date(a.createdAt).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: a => (
      <div style={{ display:'flex', gap:6 }}>
        <Btn variant="ghost" size="sm" onClick={()=>{ setSelected(a); setViewModal(true); }}><Eye size={14}/></Btn>
        <Btn variant="outline" size="sm" onClick={()=>{ setSelected(a); setNewStatus(a.status); setNotes(a.notes||''); setStatusModal(true); }}><CheckCircle size={14}/></Btn>
        <Btn variant="danger" size="sm" onClick={()=>handleDelete(a)}><Trash2 size={14}/></Btn>
      </div>
    )}
  ];

  // Stage pipeline colors
  const pipelineCount = STAGES.map(s => ({ stage: s, count: apps.filter(a => a.status === s).length }));

  return (
    <Layout>
      <PageHeader title="Applications" subtitle={`${total} total applications`} />

      {/* Pipeline */}
      <div className="card" style={{ marginBottom:20 }}>
        <h3 className="card-title" style={{ marginBottom:16 }}>Recruitment Pipeline</h3>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
          {pipelineCount.map(({ stage, count }) => (
            <div key={stage} onClick={()=>setStatusFilter(stage===statusFilter?'':stage)}
              style={{ flex:'0 0 auto', background: statusFilter===stage ? 'rgba(108,99,255,0.2)' : 'var(--bg-secondary)',
                border:`1px solid ${statusFilter===stage?'#6c63ff':'var(--border)'}`,
                borderRadius:10, padding:'12px 20px', cursor:'pointer', textAlign:'center', minWidth:100, transition:'all 0.2s'
              }}>
              <div style={{ fontSize:22, fontWeight:800 }}>{count}</div>
              <div style={{ fontSize:11, color:'var(--text-secondary)', textTransform:'capitalize', marginTop:2 }}>{stage}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="filters-bar">
          <Select value={statusFilter} onChange={setStatusFilter} placeholder="All Stages"
            options={STAGES.map(s=>({ value:s, label:s }))} />
          {statusFilter && <Btn variant="ghost" size="sm" onClick={()=>setStatusFilter('')}>Clear Filter ✕</Btn>}
        </div>
        {loading ? <LoadingSpinner /> : <Table columns={cols} data={apps} />}
        <Pagination page={page} pages={pages} onPage={setPage} />
      </div>

      {/* View Modal */}
      <Modal open={viewModal} onClose={()=>setViewModal(false)} title="Application Details" size="md">
        {selected && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              ['Applicant Name', selected.applicantName],
              ['Email', selected.applicantEmail],
              ['Phone', selected.phone||'—'],
              ['Applied For', selected.job?.title||'—'],
              ['Experience', `${selected.experience||0} years`],
              ['Current Company', selected.currentCompany||'—'],
              ['Expected Salary', selected.expectedSalary ? `₹${Number(selected.expectedSalary).toLocaleString()}` : '—'],
              ['Status', selected.status],
              ['Applied On', new Date(selected.createdAt).toLocaleDateString()],
              ['Notes', selected.notes||'—'],
            ].map(([label,val])=>(
              <div key={label}>
                <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>{label}</p>
                <p style={{ fontSize:14, fontWeight:500, textTransform: label==='Status'?'capitalize':'none' }}>{val}</p>
              </div>
            ))}
            {selected.coverLetter && (
              <div>
                <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>Cover Letter</p>
                <p style={{ fontSize:13, color:'var(--text-secondary)', background:'var(--bg-secondary)', padding:12, borderRadius:8, lineHeight:1.6 }}>{selected.coverLetter}</p>
              </div>
            )}
            {selected.resume && (
              <Btn variant="outline" size="sm" onClick={()=>window.open(`http://localhost:5000${selected.resume}`)}>
                📎 View Resume
              </Btn>
            )}
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal open={statusModal} onClose={()=>setStatusModal(false)} title="Update Application Status" size="sm">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label className="form-label">New Status</label>
            <select className="form-select" value={newStatus} onChange={e=>setNewStatus(e.target.value)}>
              {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-select" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add recruiter notes..." style={{ resize:'vertical' }} />
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <Btn variant="outline" size="md" onClick={()=>setStatusModal(false)}>Cancel</Btn>
            <Btn variant="primary" size="md" loading={saving} onClick={handleStatusUpdate}>Update Status</Btn>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
