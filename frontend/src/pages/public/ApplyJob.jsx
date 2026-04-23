import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, submitApplication } from '../../api/services';
import { Badge, Btn, Input, LoadingSpinner } from '../../components/UI';
import { ArrowLeft, MapPin, Briefcase, Calendar, DollarSign, Send, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ applicantName: '', applicantEmail: '', phone: '', experience: '', currentCompany: '', expectedSalary: '', coverLetter: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    getJob(id)
      .then(({ data }) => setJob(data.job))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.applicantName || !form.applicantEmail || !file) {
      return toast.error('Please fill required fields and upload resume');
    }

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    formData.append('resume', file);
    formData.append('job', id);

    setSubmitting(true);
    try {
      await submitApplication(formData);
      toast.success('Application submitted successfully! 🚀');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}><LoadingSpinner /></div>;
  if (!job) return <div style={{ textAlign: 'center', padding: '100px', background: 'var(--bg-primary)', height: '100vh' }}><h1>Job not found</h1><Btn onClick={() => navigate('/')}>Back to Home</Btn></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: '24px', padding: '0' }}>
          <ArrowLeft size={18} /> Back to Jobs
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          {/* Job Details */}
          <div>
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>{job.title}</h1>
                  <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '16px', marginTop: '4px' }}>{job.department}</p>
                </div>
                <Badge status={job.type} />
              </div>

              <div className="job-card-meta" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div className="job-meta-item"><MapPin size={16} />{job.location || 'Remote'}</div>
                <div className="job-meta-item"><Briefcase size={16} />{job.experience}</div>
                <div className="job-meta-item"><DollarSign size={16} />₹{Number(job.salaryMin).toLocaleString()} - ₹{Number(job.salaryMax).toLocaleString()}</div>
                <div className="job-meta-item"><Calendar size={16} />Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Project Description</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{job.description}</p>
              </div>

              {job.requirements?.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Requirements</h3>
                  <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px' }}>
                    {job.requirements.map((req, i) => <li key={i} style={{ marginBottom: '8px' }}>{req}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Application Form */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '40px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Apply for this position</h3>
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input label="Full Name *" value={form.applicantName} onChange={e => setForm({ ...form, applicantName: e.target.value })} placeholder="John Doe" required />
                <Input label="Email Address *" type="email" value={form.applicantEmail} onChange={e => setForm({ ...form, applicantEmail: e.target.value })} placeholder="john@example.com" required />
                <Input label="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765..." />
                <Input label="Years of Experience" type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="3" />
                
                <div className="form-group">
                  <label className="form-label">Resume / CV (PDF) *</label>
                  <div className="file-upload-wrapper" style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} id="resume-upload" />
                    <label htmlFor="resume-upload" style={{ cursor: 'pointer' }}>
                      <Paperclip size={24} color={file ? 'var(--accent)' : 'var(--text-muted)'} style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '13px', color: file ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {file ? file.name : 'Click to upload resume'}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Letter (Optional)</label>
                  <textarea className="form-select" rows={4} value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} placeholder="Why should we hire you?" style={{ resize: 'vertical' }} />
                </div>

                <Btn type="submit" variant="primary" size="lg" loading={submitting} style={{ width: '100%', marginTop: '10px' }}>
                  Submit Application <Send size={18} style={{ marginLeft: '8px' }} />
                </Btn>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
