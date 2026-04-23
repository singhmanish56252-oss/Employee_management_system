import React, { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAllRead } from '../api/services';

const Topbar = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(({ data }) => { setNotifications(data.notifications); setUnread(data.unread); })
      .catch(() => {});
  }, []);

  const handleMarkAll = async () => {
    await markAllRead();
    setUnread(0);
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-search">
          <Search size={16} className="topbar-search-icon" />
          <input placeholder="Search employees, jobs..." className="topbar-search-input" />
        </div>
      </div>

      <div className="topbar-right">
        {/* Theme Toggle */}
        <button className="topbar-icon-btn" onClick={() => setDark(!dark)} title="Toggle Theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="topbar-notif-wrapper">
          <button className="topbar-icon-btn" onClick={() => setShowNotif(!showNotif)}>
            <Bell size={18} />
            {unread > 0 && <span className="topbar-badge">{unread}</span>}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span>Notifications</span>
                {unread > 0 && <button onClick={handleMarkAll} className="notif-mark-all">Mark all read</button>}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <p className="notif-empty">No notifications</p>
                ) : (
                  notifications.slice(0, 8).map(n => (
                    <div key={n._id} className={`notif-item ${!n.isRead ? 'notif-unread' : ''}`}>
                      <p className="notif-title">{n.title}</p>
                      <p className="notif-msg">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="topbar-user">
          <div className="topbar-avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.name}</span>
            <span className="topbar-user-role">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
