import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="app-main">
      <Topbar />
      <main className="app-content">
        {children}
      </main>
    </div>
  </div>
);

export default Layout;
