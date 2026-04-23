import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../api/services';
import { Table, Badge, Modal, PageHeader, SearchBar, Select, Btn, Input, Pagination, LoadingSpinner } from '../../components/UI';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const BLANK = { firstName:'', lastName:'', email:'', phone:'', department:'', designation:'', employeeType:'full-time', joiningDate:'', salary:'', gender:'', address:{city:'', state:'', country:'India'}, status:'active' };

const DEPTS = ['Engineering','HR','Marketing','Sales','Finance','Operations','Design','Product','Legal','Admin'];
const TYPES = ['full-time','part-time','contract','intern'];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'view'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await getEmployees({ search, department: deptFilter, status: statusFilter, page, limit: 10 });
      setEmployees(data.employees);
      setPages(data.pages);
      setTotal(data.total);
    } catch { toast.error('Failed to load employees'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, [search, deptFilter, statusFilter, page]);

  const openCreate = () => { setForm(BLANK); setSelected(null); setModal('create'); };
  const openEdit = (emp) => { setForm({ ...emp }); setSelected(emp); setModal('edit'); };
  const openView = (emp) => { setSelected(emp); setModal('view'); };

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.department || !form.designation || !form.joiningDate) {
      return toast.error('Please fill all required fields');
    }
    setSaving(true);
    try {
      if (modal === 'create') {
        await createEmployee(form);
        toast.success('Employee created successfully!');
      } else {
        await updateEmployee(selected._id, form);
        toast.success('Employee updated!');
      }
      setModal(null);
      fetchEmployees();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Terminate ${emp.firstName} ${emp.lastName}?`)) return;
    try {
      await deleteEmployee(emp._id);
      toast.success('Employee terminated.');
      fetchEmployees();
    } catch { toast.error('Delete failed'); }
  };

  const cols = [
    { key: 'name', label: 'Employee', render: e => (
      <div className="emp-name-col">
        <div className="emp-avatar">{e.firstName?.[0]}{e.lastName?.[0]}</div>
        <div><div className="emp-name">{e.firstName} {e.lastName}</div><div className="emp-id-tag">{e.employeeId}</div></div>
      </div>
    )},
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'employeeType', label: 'Type', render: e => <Badge status={e.employeeType} /> },
    { key: 'salary', label: 'Salary', render: e => `₹${Number(e.salary).toLocaleString()}` },
    { key: 'status', label: 'Status', render: e => <Badge status={e.status} /> },
    { key: 'actions', label: 'Actions', render: e => (
      <div style={{ display:'flex', gap:6 }}>
        <Btn variant="ghost" size="sm" onClick={() => openView(e)} title="View"><Eye size={14}/></Btn>
        <Btn variant="outline" size="sm" onClick={() => openEdit(e)} title="Edit"><Edit size={14}/></Btn>
        <Btn variant="danger" size="sm" onClick={() => handleDelete(e)} title="Delete"><Trash2 size={14}/></Btn>
      </div>
    )}
  ];

  return (
    <Layout>
      <PageHeader
        title="Employees"
        subtitle={`${total} total employees`}
        action={<Btn variant="primary" size="md" onClick={openCreate}><Plus size={16}/>Add Employee</Btn>}
      />

      <div className="card">
        <div className="filters-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, email..." />
          <Select value={deptFilter} onChange={setDeptFilter} placeholder="All Departments" options={DEPTS.map(d=>({value:d,label:d}))} />
          <Select value={statusFilter} onChange={setStatusFilter} placeholder="All Status" options={['active','inactive','terminated'].map(s=>({value:s,label:s}))} />
        </div>
        {loading ? <LoadingSpinner /> : <Table columns={cols} data={employees} />}
        <Pagination page={page} pages={pages} onPage={setPage} />
      </div>

      {/* Create / Edit Modal */}
      <Modal open={modal==='create'||modal==='edit'} onClose={()=>setModal(null)} title={modal==='create'?'Add New Employee':'Edit Employee'} size="lg">
        <div className="form-grid" style={{ gap:16 }}>
          <Input label="First Name *" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} placeholder="John" />
          <Input label="Last Name *" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} placeholder="Doe" />
          <Input label="Email *" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="john@company.com" />
          <Input label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 9876543210" />
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select className="form-select" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
              <option value="">Select Department</option>
              {DEPTS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <Input label="Designation *" value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})} placeholder="Software Engineer" />
          <div className="form-group">
            <label className="form-label">Employee Type</label>
            <select className="form-select" value={form.employeeType} onChange={e=>setForm({...form,employeeType:e.target.value})}>
              {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input label="Joining Date *" type="date" value={form.joiningDate?.split('T')[0]||''} onChange={e=>setForm({...form,joiningDate:e.target.value})} />
          <Input label="Salary (₹)" type="number" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} placeholder="50000" />
          <Input label="City" value={form.address?.city||''} onChange={e=>setForm({...form,address:{...form.address,city:e.target.value}})} placeholder="Mumbai" />
          <Input label="State" value={form.address?.state||''} onChange={e=>setForm({...form,address:{...form.address,state:e.target.value}})} placeholder="Maharashtra" />
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:24}}>
          <Btn variant="outline" size="md" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn variant="primary" size="md" loading={saving} onClick={handleSave}>
            {modal==='create'?'Create Employee':'Save Changes'}
          </Btn>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={modal==='view'} onClose={()=>setModal(null)} title="Employee Details" size="lg">
        {selected && (
          <div>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,paddingBottom:20,borderBottom:'1px solid var(--border)'}}>
              <div className="detail-avatar">{selected.firstName?.[0]}{selected.lastName?.[0]}</div>
              <div>
                <h3 style={{fontSize:20,fontWeight:800}}>{selected.firstName} {selected.lastName}</h3>
                <p style={{color:'var(--text-secondary)'}}>{selected.designation} — {selected.department}</p>
                <div style={{display:'flex',gap:10,marginTop:8}}>
                  <Badge status={selected.status} />
                  <Badge status={selected.employeeType} />
                </div>
              </div>
            </div>
            <div className="form-grid">
              {[
                ['Employee ID', selected.employeeId],
                ['Email', selected.email],
                ['Phone', selected.phone||'—'],
                ['Gender', selected.gender||'—'],
                ['Joining Date', selected.joiningDate?.split('T')[0]||'—'],
                ['Salary', `₹${Number(selected.salary||0).toLocaleString()}`],
                ['City', selected.address?.city||'—'],
                ['State', selected.address?.state||'—'],
              ].map(([label,val])=>(
                <div key={label} className="detail-field">
                  <label>{label}</label>
                  <p>{val}</p>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
              <Btn variant="outline" size="md" onClick={()=>setModal(null)}>Close</Btn>
              <Btn variant="primary" size="md" onClick={()=>{setModal('edit');setForm({...selected});}}>Edit Employee</Btn>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
