import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updatePassword } from '../api/services';
import { PageHeader, Input, Btn } from '../components/UI';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { User, Lock, Bell, Shield } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    setLoading(true);
    try {
      await updatePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      toast.success('Password updated successfully');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader title="Account Settings" subtitle="Manage your profile and security preferences" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Profile Info */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--accent)" /> General Information
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="detail-field">
              <label>Full Name</label>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>{user?.name}</p>
            </div>
            <div className="detail-field">
              <label>Email Address</label>
              <p style={{ fontSize: '15px' }}>{user?.email}</p>
            </div>
            <div className="detail-field">
              <label>Role</label>
              <div style={{ marginTop: '4px' }}>
                <span className="badge" style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', padding: '4px 12px', fontSize: '12px' }}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="var(--danger)" /> Security
            </h3>
          </div>
          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Current Password"
              type="password"
              value={passForm.currentPassword}
              onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passForm.newPassword}
              onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passForm.confirmPassword}
              onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
            <div style={{ marginTop: '8px' }}>
              <Btn type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
                Update Password
              </Btn>
            </div>
          </form>
        </div>

        {/* Preferences */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--accent-hr)" /> Notifications
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Email Notifications', desc: 'Receive updates via email' },
              { label: 'Push Notifications', desc: 'In-app alerts for leave approvals' },
              { label: 'Payroll Alerts', desc: 'Get notified when payslip is generated' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
                <div style={{ width: '40px', height: '22px', background: 'var(--accent)', borderRadius: '11px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', right: '3px', top: '3px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--warning)" /> Privacy & Data
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Control how your information is displayed across the organization. You can choose to hide certain details from the public directory.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Btn variant="outline" size="sm" style={{ justifyContent: 'center' }}>Download My Data</Btn>
            <Btn variant="ghost" size="sm" style={{ color: 'var(--danger)', justifyContent: 'center' }}>Request Account Deletion</Btn>
          </div>
        </div>
      </div>
    </Layout>
  );
}
