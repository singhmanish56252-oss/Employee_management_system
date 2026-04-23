import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users, MapPin, Clock, DollarSign } from 'lucide-react';
import { getJobs, createJob, updateJob, deleteJob } from '../../api/services';
import { Table, Badge, Modal, PageHeader, SearchBar, Select, Btn, Input, Pagination, LoadingSpinner } from '../../components/UI';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const BLANK = { title:'', department:'', description:'', type:'full-time', location:'', salaryMin:'', salaryMax:'', experience:'', deadline:'', status:'open', requirements:[], skills:[] };
const DEPTS = ['Engineering','HR','Marketing','Sales','Finance','Operations','Design','Product','Legal','Admin'];
const TYPES = ['full-time','part-time','contract','intern'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [reqInput, setReqInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await getJobs({ search, status: statusFilter, page, limit: 10 });
      setJobs(data.jobs); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [search, statusFilter, page]);

  const openCreate = () => { setForm(BLANK); setReqInput(''); setSkillInput(''); setSelected(null); setModal('create'); };
  const openEdit = (job) => { setForm({ ...job, requirements: job.requirements||[], skills: job.skills||[] }); setSelected(job); setModal('edit'); };

  const addReq = () => { if (reqInput.trim()) { setForm(f => ({ ...f, requirements: [...f.requirements, reqInput.trim()] })); setReqInput(''); } };
  const addSkill = () => { if (skillInput.trim()) { setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] })); setSkillInput(''); } };

  const handleSave = async () => {
    if (!form.title || !form.department || !form.description) return toast.error('Fill required fields');
    setSaving(true);
    try {
      if (modal === 'create') { await createJob(form); toast.success('Job posted!'); }
      else { await updateJob(selected._id, form); toast.success('Job updated!'); }
      setModal(null); fetchJobs();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}"?`)) return;
    try { await deleteJob(job._id); toast.success('Job deleted'); fetchJobs(); }
    catch { toast.error('Delete failed'); }
  };

  const cols = [
    { key: 'title', label: 'Job Title', render: j => (
      <div>
        <div style={{ fontWeight:600, fontSize:14 }}>{j.title}</div>
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{j.department}</div>
      </div>
    )},
    { key: 'type', label: 'Type', render: j => <Badge status={j.type} /> },
    { key: 'location', label: 'Location', render: j => (
      <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, color:'var(--text-secondary)' }}>
        <MapPin size={12} />{j.location || 'Remote'}
      </div>
    )},
    { key: 'salary', label: 'Salary', render: j => j.salaryMin ? `₹${Number(j.salaryMin/1000).toFixed(0)}K–₹${Number(j.salaryMax/1000).toFixed(0)}K` : '—' },
    { key: 'applicationsCount', label: 'Applications', render: j => (
      <div style={{ display:'flex', alignItems:'center', gap:4 }}><Users size={13} color="#6c63ff" />{j.applicationsCount||0}</div>
    )},
    { key: 'deadline', label: 'Deadline', render: j => j.deadline ? new Date(j.deadline).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', render: j => <Badge status={j.status} /> },
    { key: 'actions', label: 'Actions', render: j => (
      <div style={{ display:'flex', gap:6 }}>
        <Btn variant="outline" size="sm" onClick={() => openEdit(j)}><Edit size={14}/></Btn>
        <Btn variant="danger" size="sm" onClick={() => handleDelete(j)}><Trash2 size={14}/></Btn>
      </div>
    )}
  ];

  return (
    <Layout>
      <PageHeader title="Job Postings" subtitle={`${total} total jobs`}
        action={<Btn variant="primary" size="md" onClick={openCreate}><Plus size={16}/>Post Job</Btn>}
      />
      <div className="card">
        <div className="filters-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search jobs..." />
          <Select value={statusFilter} onChange={setStatusFilter} placeholder="All Status" options={['open','closed','paused'].map(s=>({value:s,label:s}))} />
        </div>
        {loading ? <LoadingSpinner /> : <Table columns={cols} data={jobs} />}
        <Pagination page={page} pages={pages} onPage={setPage} />
      </div>

      <Modal open={modal==='create'||modal==='edit'} onClose={()=>setModal(null)} title={modal==='create'?'Post New Job':'Edit Job'} size="lg">
        <div className="form-grid">
          <Input label="Job Title *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Frontend Developer" />
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select className="form-select" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
              <option value="">Select</option>
              {DEPTS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Job Type</label>
            <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              {TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Mumbai / Remote" />
          <Input label="Min Salary (₹)" type="number" value={form.salaryMin} onChange={e=>setForm({...form,salaryMin:e.target.value})} placeholder="500000" />
          <Input label="Max Salary (₹)" type="number" value={form.salaryMax} onChange={e=>setForm({...form,salaryMax:e.target.value})} placeholder="1000000" />
          <Input label="Experience" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} placeholder="2-4 years" />
          <Input label="Application Deadline" type="date" value={form.deadline?.split('T')[0]||''} onChange={e=>setForm({...form,deadline:e.target.value})} />
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              {['open','closed','paused'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group" style={{ marginTop:14 }}>
          <label className="form-label">Description *</label>
          <textarea className="form-select" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Job description..." style={{ resize:'vertical' }} />
        </div>
        {/* Requirements */}
        <div className="form-group" style={{ marginTop:14 }}>
          <label className="form-label">Requirements</label>
          <div style={{ display:'flex', gap:8 }}>
            <input className="form-input" value={reqInput} onChange={e=>setReqInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addReq()} placeholder="Add requirement..." />
            <Btn variant="outline" size="sm" onClick={addReq}>Add</Btn>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:8 }}>
            {form.requirements?.map((r,i)=>(
              <span key={i} className="badge" style={{ background:'rgba(108,99,255,0.15)', color:'#6c63ff', cursor:'pointer' }} onClick={()=>setForm(f=>({...f,requirements:f.requirements.filter((_,j)=>j!==i)}))}>
                {r} ✕
              </span>
            ))}
          </div>
        </div>
        {/* Skills */}
        <div className="form-group" style={{ marginTop:14 }}>
          <label className="form-label">Skills</label>
          <div style={{ display:'flex', gap:8 }}>
            <input className="form-input" value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addSkill()} placeholder="Add skill..." />
            <Btn variant="outline" size="sm" onClick={addSkill}>Add</Btn>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:8 }}>
            {form.skills?.map((s,i)=>(
              <span key={i} className="badge" style={{ background:'rgba(0,212,170,0.15)', color:'#00d4aa', cursor:'pointer' }} onClick={()=>setForm(f=>({...f,skills:f.skills.filter((_,j)=>j!==i)}))}>
                {s} ✕
              </span>
            ))}
          </div>
        </div>
        <div style={{ display:'flex',gap:10,justifyContent:'flex-end',marginTop:24 }}>
          <Btn variant="outline" size="md" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn variant="primary" size="md" loading={saving} onClick={handleSave}>{modal==='create'?'Post Job':'Save Changes'}</Btn>
        </div>
      </Modal>
    </Layout>
  );
}
