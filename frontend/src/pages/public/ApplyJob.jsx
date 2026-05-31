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
  
  // Dual Resume support
  const [resumeType, setResumeType] = useState('file'); // 'file' | 'link'
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    getJob(id)
      .then(({ data }) => setJob(data.job))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.applicantName || !form.applicantEmail) {
      return toast.error('Please fill required fields');
    }
    if (resumeType === 'file' && !file) {
      return toast.error('Please upload your resume file');
    }
    if (resumeType === 'link' && !resumeUrl) {
      return toast.error('Please enter your resume URL link');
    }

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (resumeType === 'file') {
      formData.append('resume', file);
    } else {
      formData.append('resume', resumeUrl);
    }
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
        <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '0', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <ArrowLeft size={18} /> Back to Jobs
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          {/* Job Details */}
          <div>
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.companyName} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                ) : (
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '22px' }}>
                    {job.companyName?.charAt(0) || 'E'}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{job.companyName || 'EMS Corp'}</div>
                  <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px', marginTop: '2px', color: '#fff' }}>{job.title}</h1>
                  <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', marginTop: '4px' }}>{job.department}</p>
                </div>
                <Badge status={job.type} />
              </div>

              {/* Duality (WorkMode) and Standard Badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', background: 'rgba(0,212,170,0.1)', color: '#00d4aa', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', textTransform: 'capitalize' }}>
                  💻 Work Mode: {job.workMode || 'onsite'}
                </span>
                <span style={{ fontSize: '12px', background: 'rgba(108,99,255,0.1)', color: '#6c63ff', padding: '4px 12px', borderRadius: '20px', fontWeight: '700' }}>
                  🎓 Standard: {job.standard || 'Graduate'}
                </span>
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
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Resume / CV Option *</label>
                  
                  {/* Select toggle type */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button 
                      type="button" 
                      onClick={() => setResumeType('file')}
                      style={{ 
                        flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                        background: resumeType === 'file' ? 'var(--accent)' : 'var(--bg-secondary)',
                        color: resumeType === 'file' ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      Upload PDF
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setResumeType('link')}
                      style={{ 
                        flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                        background: resumeType === 'link' ? 'var(--accent)' : 'var(--bg-secondary)',
                        color: resumeType === 'link' ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      Resume Link URL
                    </button>
                  </div>

                  {resumeType === 'file' ? (
                    <div className="file-upload-wrapper" style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} id="resume-upload" />
                      <label htmlFor="resume-upload" style={{ cursor: 'pointer' }}>
                        <Paperclip size={24} color={file ? 'var(--accent)' : 'var(--text-muted)'} style={{ marginBottom: '8px' }} />
                        <p style={{ fontSize: '13px', color: file ? 'var(--accent)' : 'var(--text-secondary)' }}>
                          {file ? file.name : 'Click to upload resume PDF'}
                        </p>
                      </label>
                    </div>
                  ) : (
                    <input 
                      className="form-input" 
                      type="url" 
                      required 
                      value={resumeUrl}
                      onChange={e => setResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..." 
                      style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: '#fff', borderRadius: '8px', outline: 'none' }}
                    />
                  )}
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
