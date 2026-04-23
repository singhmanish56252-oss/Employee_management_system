import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Badge } from '../../components/UI';
import Layout from '../../components/Layout';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, ShieldCheck, Banknote } from 'lucide-react';

export default function Profile() {
  const { user, employee } = useAuth();

  const InfoItem = ({ icon: Icon, label, value, color = "var(--text-muted)" }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ marginTop: '2px', color: color }}>
        <Icon size={18} />
      </div>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 500, marginTop: '2px' }}>{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <PageHeader title="My Profile" subtitle="Professional and personal information" />

      {/* Profile Header */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--accent), #9c47ff)', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '-40px', left: '32px', width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-card)', border: '4px solid var(--bg-card)', display: 'flex', alignItems: 'center', justify: 'center', overflow: 'hidden' }}>
            <div className="detail-avatar" style={{ width: '100%', height: '100%', borderRadius: '0', fontSize: '32px' }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </div>
        <div style={{ padding: '60px 32px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{user?.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                {employee?.designation} • {employee?.department} • {employee?.employeeId}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Badge status={employee?.status || 'active'} />
              <Badge status={employee?.employeeType || 'full-time'} />
            </div>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Personal Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--accent)" /> Personal Information
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <InfoItem icon={Mail} label="Official Email" value={user?.email} color="var(--accent)" />
            <InfoItem icon={Phone} label="Contact Number" value={employee?.phone} />
            <InfoItem icon={Calendar} label="Date of Birth" value={employee?.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : '—'} />
            <InfoItem icon={MapPin} label="Current Address" value={`${employee?.address?.city}, ${employee?.address?.state}, ${employee?.address?.country}`} />
          </div>
        </div>

        {/* Professional Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} color="var(--accent-hr)" /> Professional Information
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <InfoItem icon={Briefcase} label="Designation" value={employee?.designation} color="var(--accent-hr)" />
            <InfoItem icon={ShieldCheck} label="Department" value={employee?.department} />
            <InfoItem icon={Calendar} label="Joining Date" value={employee?.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : '—'} />
            <InfoItem icon={Banknote} label="Current Salary" value={`₹${employee?.salary?.toLocaleString()}`} />
          </div>
        </div>

        {/* Bank & Payment */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Banknote size={18} color="var(--warning)" /> Bank Account Details
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <InfoItem icon={User} label="Account Holder" value={employee?.bankDetails?.accountName || user?.name} />
            <InfoItem icon={Banknote} label="Account Number" value={employee?.bankDetails?.accountNumber || '**** **** **** 1234'} />
            <InfoItem icon={ShieldCheck} label="IFSC Code" value={employee?.bankDetails?.ifscCode || 'HDFC0001234'} />
            <InfoItem icon={Briefcase} label="Bank Name" value={employee?.bankDetails?.bankName || 'HDFC Bank'} />
          </div>
        </div>

        {/* Skills & Certifications */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               Skills & Expertise
            </h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {employee?.skills?.length > 0 ? employee.skills.map((skill, i) => (
              <span key={i} style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent)', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                {skill}
              </span>
            )) : <p style={{ color: 'var(--text-muted)' }}>No skills listed</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
