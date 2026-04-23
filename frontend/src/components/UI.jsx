import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({ icon: Icon, label, value, sub, trend, color = '#6c63ff' }) => (
  <div className="stat-card" style={{ '--accent': color }}>
    <div className="stat-icon" style={{ background: `${color}20`, color }}>
      <Icon size={24} />
    </div>
    <div className="stat-body">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
      {sub && <p className="stat-sub">{sub}</p>}
      {trend !== undefined && (
        <div className={`stat-trend ${trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat'}`}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <div className="stat-glow" style={{ background: color }} />
  </div>
);

export const Badge = ({ status }) => {
  const colors = {
    active: '#00d4aa', inactive: '#888', terminated: '#ff6b6b',
    pending: '#ffd93d', approved: '#00d4aa', rejected: '#ff6b6b',
    open: '#6c63ff', closed: '#888', paused: '#ffd93d',
    present: '#00d4aa', absent: '#ff6b6b', late: '#ffd93d',
    'half-day': '#ff9a3c', paid: '#00d4aa', processed: '#6c63ff', draft: '#888',
    hired: '#00d4aa', offered: '#6c63ff', shortlisted: '#ffd93d', interviewed: '#ff9a3c',
  };
  const color = colors[status] || '#888';
  return (
    <span className="badge" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
      {status}
    </span>
  );
};

export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box modal-${size}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export const Table = ({ columns, data, onRowClick }) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>{columns.map(col => <th key={col.key}>{col.label}</th>)}</tr>
      </thead>
      <tbody>
        {data.length === 0
          ? <tr><td colSpan={columns.length} className="table-empty">No records found</td></tr>
          : data.map((row, i) => (
            <tr key={row._id || i} className={onRowClick ? 'table-row-clickable' : ''} onClick={() => onRowClick?.(row)}>
              {columns.map(col => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

export const LoadingSpinner = ({ size = 40 }) => (
  <div className="spinner-wrapper">
    <div className="spinner" style={{ width: size, height: size }} />
  </div>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="page-header">
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
    {action && <div className="page-header-action">{action}</div>}
  </div>
);

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="search-bar">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="search-input" />
  </div>
);

export const Select = ({ value, onChange, options, placeholder }) => (
  <select className="form-select" value={value} onChange={e => onChange(e.target.value)}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);

export const Input = ({ label, error, ...props }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <input className={`form-input ${error ? 'form-input-error' : ''}`} {...props} />
    {error && <p className="form-error">{error}</p>}
  </div>
);

export const Btn = ({ children, variant = 'primary', size = 'md', loading, ...props }) => (
  <button className={`btn btn-${variant} btn-${size}`} disabled={loading || props.disabled} {...props}>
    {loading ? <span className="btn-spinner" /> : children}
  </button>
);

export const Pagination = ({ page, pages, onPage }) => {
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      <button className="page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} className={`page-btn ${p === page ? 'page-btn-active' : ''}`} onClick={() => onPage(p)}>{p}</button>
      ))}
      <button className="page-btn" disabled={page === pages} onClick={() => onPage(page + 1)}>›</button>
    </div>
  );
};
