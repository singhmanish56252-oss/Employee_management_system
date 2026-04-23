import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ems_token');
    if (token) {
      getMe()
        .then(({ data }) => {
          setUser(data.user);
          setEmployee(data.employee);
        })
        .catch(() => {
          localStorage.removeItem('ems_token');
          localStorage.removeItem('ems_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token, userData, employeeData) => {
    localStorage.setItem('ems_token', token);
    localStorage.setItem('ems_user', JSON.stringify(userData));
    setUser(userData);
    setEmployee(employeeData || null);
  };

  const logout = () => {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
    setUser(null);
    setEmployee(null);
  };

  return (
    <AuthContext.Provider value={{ user, employee, loading, loginUser, logout, setEmployee }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
