/**
 * 🔧 MOCK SERVICE — runs entirely in the browser (no backend needed)
 * Activates automatically on GitHub Pages / when VITE_MOCK_MODE=true
 * All data is stored in localStorage so it persists across page refreshes.
 */

// ─── Tiny password hasher (no bcrypt in browser, demo only) ───────────────
const hashPw   = (pw) => `__hashed__${pw}`;
const checkPw  = (plain, hashed) => hashed === `__hashed__${plain}`;

// ─── JWT-like token (base64, not secure — demo only) ───────────────────────
const makeToken = (payload) =>
  btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 3600 * 1000 }));
const parseToken = (token) => {
  try { return JSON.parse(atob(token)); }
  catch { return null; }
};

// ─── localStorage helpers ───────────────────────────────────────────────────
const get  = (key) => { try { return JSON.parse(localStorage.getItem(`ems_mock_${key}`) || 'null'); } catch { return null; } };
const save = (key, val) => localStorage.setItem(`ems_mock_${key}`, JSON.stringify(val));

// ─── ID generator ───────────────────────────────────────────────────────────
let _seq = Date.now();
const newId = () => String(++_seq);

// ─── Seed initial data if not already in localStorage ───────────────────────
const seedIfEmpty = () => {
  if (get('seeded')) return;

  const now = new Date();
  const month = now.getMonth();
  const year  = now.getFullYear();

  // Users
  const users = [
    { _id: 'u1', name: 'Admin Singh',  email: 'admin@ems.com',  password: hashPw('admin123'), role: 'admin',    isActive: true, avatar: '', createdAt: new Date().toISOString() },
    { _id: 'u2', name: 'Manish Singh', email: 'singhmanish56252@gmail.com', password: hashPw('admin123'), role: 'admin', isActive: true, avatar: '', createdAt: new Date().toISOString() },
    { _id: 'u3', name: 'HR Manager',   email: 'hr@ems.com',     password: hashPw('hr123456'),  role: 'hr',       isActive: true, avatar: '', createdAt: new Date().toISOString() },
    { _id: 'u4', name: 'Rahul Sharma', email: 'emp@ems.com',    password: hashPw('emp12345'),  role: 'employee', isActive: true, avatar: '', createdAt: new Date().toISOString() },
    { _id: 'u5', name: 'Priya Patel',  email: 'priya@ems.com',  password: hashPw('priya123'),  role: 'employee', isActive: true, avatar: '', createdAt: new Date().toISOString() },
    { _id: 'u6', name: 'Amit Kumar',   email: 'amit@ems.com',   password: hashPw('amit1234'),  role: 'employee', isActive: true, avatar: '', createdAt: new Date().toISOString() },
  ];
  save('users', users);

  // Employees
  const employees = [
    { _id: 'e1', user: 'u4', employeeId: 'EMP0001', firstName: 'Rahul',  lastName: 'Sharma',  email: 'emp@ems.com',   phone: '+91 9876543210', department: 'Engineering', designation: 'Senior Software Engineer', employeeType: 'full-time', joiningDate: '2022-01-15', salary: 85000, gender: 'male',   status: 'active', skills: ['React','Node.js','MongoDB','AWS'],   address: { city: 'Mumbai',     state: 'Maharashtra', country: 'India' } },
    { _id: 'e2', user: 'u5', employeeId: 'EMP0002', firstName: 'Priya',  lastName: 'Patel',   email: 'priya@ems.com', phone: '+91 9876543211', department: 'Design',       designation: 'UI/UX Designer',           employeeType: 'full-time', joiningDate: '2022-06-01', salary: 70000, gender: 'female', status: 'active', skills: ['Figma','Adobe XD','Sketch','CSS'], address: { city: 'Bangalore',  state: 'Karnataka',   country: 'India' } },
    { _id: 'e3', user: 'u6', employeeId: 'EMP0003', firstName: 'Amit',   lastName: 'Kumar',   email: 'amit@ems.com',  phone: '+91 9876543212', department: 'Marketing',    designation: 'Marketing Manager',         employeeType: 'full-time', joiningDate: '2021-11-10', salary: 75000, gender: 'male',   status: 'active', skills: ['SEO','Content','Analytics'],       address: { city: 'Delhi',      state: 'Delhi',       country: 'India' } },
    { _id: 'e4', user: 'u3', employeeId: 'EMP0004', firstName: 'HR',     lastName: 'Manager', email: 'hr@ems.com',    phone: '+91 9876543213', department: 'HR',           designation: 'HR Manager',                employeeType: 'full-time', joiningDate: '2020-03-01', salary: 90000, gender: 'male',   status: 'active', skills: ['Recruitment','Onboarding'],        address: { city: 'Pune',       state: 'Maharashtra', country: 'India' } },
  ];
  save('employees', employees);

  // Jobs
  const jobs = [
    { _id: 'j1', title: 'Full Stack Developer', department: 'Engineering', description: 'We are looking for an experienced Full Stack Developer to join our engineering team. You will work on exciting projects using React, Node.js and MongoDB.', type: 'full-time', location: 'Bangalore / Remote', salaryMin: 800000, salaryMax: 1500000, experience: '3-5 years', skills: ['React','Node.js','MongoDB'], status: 'open', deadline: '2026-07-30', applicationsCount: 2, postedBy: 'u1', createdAt: new Date().toISOString() },
    { _id: 'j2', title: 'UI/UX Designer',       department: 'Design',       description: 'Join our creative team as a UI/UX Designer. You will create beautiful user-friendly interfaces for web and mobile applications.',                          type: 'full-time', location: 'Mumbai',            salaryMin: 600000, salaryMax: 1000000, experience: '2-4 years', skills: ['Figma','Prototyping'],   status: 'open', deadline: '2026-06-30', applicationsCount: 1, postedBy: 'u3', createdAt: new Date().toISOString() },
    { _id: 'j3', title: 'Marketing Executive',  department: 'Marketing',    description: 'We are hiring a Marketing Executive to drive our digital marketing strategy and grow our brand presence.',                                                type: 'full-time', location: 'Delhi / Remote',    salaryMin: 500000, salaryMax: 800000,  experience: '1-3 years', skills: ['Google Ads','SEO'],      status: 'open', deadline: '2026-07-15', applicationsCount: 1, postedBy: 'u1', createdAt: new Date().toISOString() },
    { _id: 'j4', title: 'Data Analyst Intern',  department: 'Engineering',  description: '12-month internship opportunity for data analysts to work on real-world data projects.',                                                                    type: 'intern',    location: 'Remote',            salaryMin: 20000,  salaryMax: 35000,   experience: '0-1 year',  skills: ['Python','SQL','Tableau'], status: 'open', deadline: '2026-08-01', applicationsCount: 1, postedBy: 'u3', createdAt: new Date().toISOString() },
    { _id: 'j5', title: 'HR Executive',         department: 'HR',           description: 'Looking for a dynamic HR Executive to assist in recruitment, onboarding and employee engagement activities.',                                                type: 'full-time', location: 'Pune',              salaryMin: 400000, salaryMax: 650000,  experience: '1-2 years', skills: ['Recruitment','Onboarding'], status: 'open', deadline: '2026-09-01', applicationsCount: 0, postedBy: 'u1', createdAt: new Date().toISOString() },
  ];
  save('jobs', jobs);

  // Applications
  const applications = [
    { _id: 'a1', job: 'j1', applicantName: 'Vikram Singh',  applicantEmail: 'vikram@email.com',  phone: '+91 9000000001', experience: 4, currentCompany: 'TCS',       expectedSalary: 1200000, status: 'shortlisted', createdAt: new Date().toISOString() },
    { _id: 'a2', job: 'j1', applicantName: 'Sneha Gupta',   applicantEmail: 'sneha@email.com',   phone: '+91 9000000002', experience: 3, currentCompany: 'Infosys',   expectedSalary: 1000000, status: 'reviewed',    createdAt: new Date().toISOString() },
    { _id: 'a3', job: 'j2', applicantName: 'Riya Shah',     applicantEmail: 'riya@email.com',    phone: '+91 9000000003', experience: 2, currentCompany: 'Freelancer',expectedSalary: 800000,  status: 'interviewed', createdAt: new Date().toISOString() },
    { _id: 'a4', job: 'j3', applicantName: 'Arjun Mehta',   applicantEmail: 'arjun@email.com',   phone: '+91 9000000004', experience: 1, currentCompany: '',          expectedSalary: 600000,  status: 'pending',     createdAt: new Date().toISOString() },
    { _id: 'a5', job: 'j4', applicantName: 'Pooja Verma',   applicantEmail: 'pooja@email.com',   phone: '+91 9000000005', experience: 0, currentCompany: '',          expectedSalary: 25000,   status: 'pending',     createdAt: new Date().toISOString() },
  ];
  save('applications', applications);

  // Attendance (last 20 working days)
  const attendance = [];
  const empIds = ['e1','e2','e3'];
  for (let d = 20; d >= 1; d--) {
    const date = new Date(year, month, now.getDate() - d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    for (const empId of empIds) {
      const isAbsent = Math.random() < 0.05;
      const isLate   = Math.random() < 0.1;
      const checkIn  = new Date(date); checkIn.setHours(isLate ? 10 : 9, Math.floor(Math.random()*30));
      const checkOut = new Date(date); checkOut.setHours(18, Math.floor(Math.random()*30));
      const workHours = isAbsent ? 0 : parseFloat(((checkOut - checkIn) / 3600000).toFixed(2));
      attendance.push({
        _id: newId(), employee: empId,
        date: date.toISOString(),
        checkIn:  isAbsent ? null : checkIn.toISOString(),
        checkOut: isAbsent ? null : checkOut.toISOString(),
        status:    isAbsent ? 'absent' : isLate ? 'late' : 'present',
        workHours, overtime: workHours > 8 ? +(workHours - 8).toFixed(2) : 0,
        markedBy: 'u1'
      });
    }
  }
  save('attendance', attendance);

  // Payroll (last 3 months)
  const payroll = [];
  const empPayData = [
    { id: 'e1', salary: 85000 },
    { id: 'e2', salary: 70000 },
    { id: 'e3', salary: 75000 },
  ];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(year, month - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    for (const emp of empPayData) {
      const basic = emp.salary;
      const hra = basic * 0.4;
      const allowances = basic * 0.1;
      const tax = basic > 50000 ? basic * 0.1 : 0;
      const pf  = basic * 0.12;
      const gross = basic + hra + allowances;
      const net   = gross - tax - pf;
      payroll.push({
        _id: newId(), employee: emp.id, month: m, year: y,
        basicSalary: basic, hra, allowances, overtimePay: 0, bonus: 0,
        grossSalary: +gross.toFixed(2), taxDeduction: +tax.toFixed(2),
        pfDeduction: +pf.toFixed(2), otherDeductions: 0,
        totalDeductions: +(tax + pf).toFixed(2), netSalary: +net.toFixed(2),
        daysWorked: 22, status: i === 0 ? 'processed' : 'paid',
        paidOn: i === 0 ? null : new Date(y, m, 5).toISOString(),
        processedBy: 'u1', createdAt: new Date().toISOString()
      });
    }
  }
  save('payroll', payroll);

  // OTPs store
  save('otps', {});

  save('seeded', true);
};

// ─── Helper: delay to simulate network ─────────────────────────────────────
const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

// ─── Helper: mock axios-style response ─────────────────────────────────────
const ok  = (data)    => ({ data });
const err = (msg, status = 400) => { const e = new Error(msg); e.response = { data: { success: false, message: msg }, status }; throw e; };

// ─── Get current user from token ────────────────────────────────────────────
const authUser = () => {
  const token = localStorage.getItem('ems_token');
  if (!token) err('Unauthorized', 401);
  const payload = parseToken(token);
  if (!payload || payload.exp < Date.now()) err('Token expired', 401);
  const users = get('users') || [];
  const user = users.find(u => u._id === payload.id);
  if (!user) err('User not found', 401);
  return user;
};

// ─── Populate employee object with user data ─────────────────────────────────
const populateEmployee = (emp) => {
  if (!emp) return emp;
  const users = get('users') || [];
  const u = users.find(u => u._id === emp.user);
  return { ...emp, user: u ? { _id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar } : emp.user };
};

// ════════════════════════════════════════════════════════════════════════════
//  MOCK API HANDLERS
// ════════════════════════════════════════════════════════════════════════════
export const mockHandlers = {

  // ── Auth ──────────────────────────────────────────────────────────────────
  'POST /auth/login': async ({ email, password, role, name }) => {
    await delay();
    const users = get('users') || [];
    const identifier = (email || name || '').toLowerCase().trim();
    const user = users.find(u =>
      u.email.toLowerCase() === identifier ||
      u.name.toLowerCase() === identifier
    );
    if (!user || !checkPw(password, user.password)) err('Invalid credentials', 401);
    if (!user.isActive) err('Account is deactivated', 401);
    if (role && user.role !== role) err(`Role mismatch! You selected "${role}" but your account is registered as "${user.role}".`, 403);
    user.lastLogin = new Date().toISOString();
    save('users', users);
    const token = makeToken({ id: user._id });
    const employees = get('employees') || [];
    const employee = employees.find(e => e.user === user._id) || null;
    const { password: _pw, ...safeUser } = user;
    return ok({ success: true, token, user: safeUser, employee });
  },

  'POST /auth/register': async ({ name, email, password, role }) => {
    await delay();
    const users = get('users') || [];
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) err('Email already registered');
    const newUser = { _id: newId(), name, email: email.toLowerCase(), password: hashPw(password), role: role || 'employee', isActive: true, avatar: '', createdAt: new Date().toISOString() };
    users.push(newUser);
    save('users', users);
    const token = makeToken({ id: newUser._id });
    const { password: _pw, ...safeUser } = newUser;
    return ok({ success: true, token, user: safeUser, employee: null });
  },

  'GET /auth/me': async () => {
    await delay(100);
    const me = authUser();
    const employees = get('employees') || [];
    const employee = employees.find(e => e.user === me._id) || null;
    const { password: _pw, ...safeUser } = me;
    return ok({ success: true, user: safeUser, employee });
  },

  'PUT /auth/update-password': async ({ currentPassword, newPassword }) => {
    await delay();
    const users = get('users') || [];
    const me = authUser();
    const idx = users.findIndex(u => u._id === me._id);
    if (!checkPw(currentPassword, users[idx].password)) err('Current password is incorrect', 401);
    users[idx].password = hashPw(newPassword);
    save('users', users);
    const token = makeToken({ id: me._id });
    return ok({ success: true, token, message: 'Password updated successfully' });
  },

  'GET /auth/users': async () => {
    await delay();
    const users = (get('users') || []).map(({ password: _pw, ...u }) => u);
    return ok({ success: true, count: users.length, users });
  },

  'PUT /auth/users/:id/toggle': async (_, params) => {
    await delay();
    const users = get('users') || [];
    const idx = users.findIndex(u => u._id === params.id);
    if (idx === -1) err('User not found', 404);
    users[idx].isActive = !users[idx].isActive;
    save('users', users);
    const { password: _pw, ...safeUser } = users[idx];
    return ok({ success: true, message: `User ${users[idx].isActive ? 'activated' : 'deactivated'}`, user: safeUser });
  },

  'POST /auth/social-login': async ({ email, name, provider, providerId, avatar, role }) => {
    await delay();
    const users = get('users') || [];
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.lastLogin = new Date().toISOString();
      save('users', users);
    } else {
      if (!role) return ok({ success: false, requireRole: true, email, name, provider, providerId, avatar, message: 'Please select a role.' });
      user = { _id: newId(), name: name || email.split('@')[0], email: email.toLowerCase(), password: hashPw(newId()), role, isActive: true, avatar: avatar || '', createdAt: new Date().toISOString() };
      users.push(user);
      save('users', users);
    }
    const token = makeToken({ id: user._id });
    const employees = get('employees') || [];
    const employee = employees.find(e => e.user === user._id) || null;
    const { password: _pw, ...safeUser } = user;
    return ok({ success: true, token, user: safeUser, employee });
  },

  'POST /auth/send-otp': async ({ email }) => {
    await delay(300);
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otps = get('otps') || {};
    otps[email.toLowerCase()] = { code: otp, expiry: Date.now() + 5 * 60 * 1000 };
    save('otps', otps);
    return ok({ success: true, message: 'OTP generated (Demo Mode)', demoCode: otp, warning: 'Running in demo mode — OTP shown directly.' });
  },

  'POST /auth/verify-otp': async ({ email, code, role }) => {
    await delay();
    const otps = get('otps') || {};
    const entry = otps[email.toLowerCase()];
    if (!entry) err('OTP not found or expired');
    if (entry.code !== code) err('Invalid OTP code');
    if (Date.now() > entry.expiry) err('OTP has expired');
    delete otps[email.toLowerCase()];
    save('otps', otps);
    const users = get('users') || [];
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = { _id: newId(), name: email.split('@')[0], email: email.toLowerCase(), password: hashPw(newId()), role: role || 'employee', isActive: true, avatar: '', createdAt: new Date().toISOString() };
      users.push(user);
      save('users', users);
    }
    const token = makeToken({ id: user._id });
    const employees = get('employees') || [];
    const employee = employees.find(e => e.user === user._id) || null;
    const { password: _pw, ...safeUser } = user;
    return ok({ success: true, token, user: safeUser, employee });
  },

  // ── Employees ──────────────────────────────────────────────────────────────
  'GET /employees': async (params) => {
    await delay();
    let emps = (get('employees') || []).map(populateEmployee);
    if (params?.department) emps = emps.filter(e => e.department === params.department);
    if (params?.status)     emps = emps.filter(e => e.status === params.status);
    if (params?.search) {
      const s = params.search.toLowerCase();
      emps = emps.filter(e => e.firstName?.toLowerCase().includes(s) || e.lastName?.toLowerCase().includes(s) || e.email?.toLowerCase().includes(s) || e.department?.toLowerCase().includes(s));
    }
    return ok({ success: true, count: emps.length, employees: emps });
  },

  'GET /employees/departments': async () => {
    await delay(100);
    const emps = get('employees') || [];
    const depts = [...new Set(emps.map(e => e.department).filter(Boolean))];
    return ok({ success: true, departments: depts });
  },

  'GET /employees/:id': async (_, params) => {
    await delay();
    const emps = get('employees') || [];
    const emp = emps.find(e => e._id === params.id);
    if (!emp) err('Employee not found', 404);
    return ok({ success: true, employee: populateEmployee(emp) });
  },

  'POST /employees': async (data) => {
    await delay();
    const emps = get('employees') || [];
    const count = emps.length;
    const emp = { _id: newId(), employeeId: `EMP${String(count + 1).padStart(4, '0')}`, status: 'active', createdAt: new Date().toISOString(), ...data };
    emps.push(emp);
    save('employees', emps);
    return ok({ success: true, employee: populateEmployee(emp) });
  },

  'PUT /employees/:id': async (data, params) => {
    await delay();
    const emps = get('employees') || [];
    const idx = emps.findIndex(e => e._id === params.id);
    if (idx === -1) err('Employee not found', 404);
    emps[idx] = { ...emps[idx], ...data, _id: params.id };
    save('employees', emps);
    return ok({ success: true, employee: populateEmployee(emps[idx]) });
  },

  'DELETE /employees/:id': async (_, params) => {
    await delay();
    let emps = get('employees') || [];
    emps = emps.filter(e => e._id !== params.id);
    save('employees', emps);
    return ok({ success: true, message: 'Employee deleted' });
  },

  // ── Jobs ──────────────────────────────────────────────────────────────────
  'GET /jobs': async (params) => {
    await delay();
    let jobs = get('jobs') || [];
    if (params?.status) jobs = jobs.filter(j => j.status === params.status);
    if (params?.department) jobs = jobs.filter(j => j.department === params.department);
    return ok({ success: true, count: jobs.length, jobs });
  },

  'GET /jobs/:id': async (_, params) => {
    await delay();
    const jobs = get('jobs') || [];
    const job = jobs.find(j => j._id === params.id);
    if (!job) err('Job not found', 404);
    return ok({ success: true, job });
  },

  'POST /jobs': async (data) => {
    await delay();
    const jobs = get('jobs') || [];
    const job = { _id: newId(), applicationsCount: 0, createdAt: new Date().toISOString(), ...data };
    jobs.push(job);
    save('jobs', jobs);
    return ok({ success: true, job });
  },

  'PUT /jobs/:id': async (data, params) => {
    await delay();
    const jobs = get('jobs') || [];
    const idx = jobs.findIndex(j => j._id === params.id);
    if (idx === -1) err('Job not found', 404);
    jobs[idx] = { ...jobs[idx], ...data, _id: params.id };
    save('jobs', jobs);
    return ok({ success: true, job: jobs[idx] });
  },

  'DELETE /jobs/:id': async (_, params) => {
    await delay();
    let jobs = get('jobs') || [];
    jobs = jobs.filter(j => j._id !== params.id);
    save('jobs', jobs);
    return ok({ success: true, message: 'Job deleted' });
  },

  // ── Applications ──────────────────────────────────────────────────────────
  'GET /applications': async (params) => {
    await delay();
    let apps = get('applications') || [];
    if (params?.status) apps = apps.filter(a => a.status === params.status);
    if (params?.job)    apps = apps.filter(a => a.job === params.job);
    const jobs = get('jobs') || [];
    apps = apps.map(a => ({ ...a, job: jobs.find(j => j._id === a.job) || a.job }));
    return ok({ success: true, count: apps.length, applications: apps });
  },

  'POST /applications': async (data) => {
    await delay();
    const apps = get('applications') || [];
    const app = { _id: newId(), status: 'pending', createdAt: new Date().toISOString(), ...data };
    apps.push(app);
    save('applications', apps);
    const jobs = get('jobs') || [];
    const jIdx = jobs.findIndex(j => j._id === data.job);
    if (jIdx !== -1) { jobs[jIdx].applicationsCount = (jobs[jIdx].applicationsCount || 0) + 1; save('jobs', jobs); }
    return ok({ success: true, application: app });
  },

  'PUT /applications/:id/status': async (data, params) => {
    await delay();
    const apps = get('applications') || [];
    const idx = apps.findIndex(a => a._id === params.id);
    if (idx === -1) err('Application not found', 404);
    apps[idx] = { ...apps[idx], ...data };
    save('applications', apps);
    return ok({ success: true, application: apps[idx] });
  },

  'DELETE /applications/:id': async (_, params) => {
    await delay();
    let apps = get('applications') || [];
    apps = apps.filter(a => a._id !== params.id);
    save('applications', apps);
    return ok({ success: true, message: 'Application deleted' });
  },

  // ── Attendance ────────────────────────────────────────────────────────────
  'GET /attendance': async (params) => {
    await delay();
    let att = get('attendance') || [];
    if (params?.employee) att = att.filter(a => a.employee === params.employee);
    if (params?.month && params?.year) att = att.filter(a => { const d = new Date(a.date); return d.getMonth() + 1 === Number(params.month) && d.getFullYear() === Number(params.year); });
    const employees = get('employees') || [];
    att = att.map(a => ({ ...a, employee: employees.find(e => e._id === a.employee) || a.employee }));
    return ok({ success: true, count: att.length, attendance: att });
  },

  'POST /attendance': async (data) => {
    await delay();
    const att = get('attendance') || [];
    const rec = { _id: newId(), createdAt: new Date().toISOString(), ...data };
    att.push(rec);
    save('attendance', att);
    return ok({ success: true, attendance: rec });
  },

  'PUT /attendance/:id': async (data, params) => {
    await delay();
    const att = get('attendance') || [];
    const idx = att.findIndex(a => a._id === params.id);
    if (idx === -1) err('Attendance not found', 404);
    att[idx] = { ...att[idx], ...data };
    save('attendance', att);
    return ok({ success: true, attendance: att[idx] });
  },

  'POST /attendance/leave': async (data) => {
    await delay();
    const leaves = get('leaves') || [];
    const leave = { _id: newId(), status: 'pending', createdAt: new Date().toISOString(), ...data };
    leaves.push(leave);
    save('leaves', leaves);
    return ok({ success: true, leave });
  },

  'GET /attendance/leaves': async (params) => {
    await delay();
    let leaves = get('leaves') || [];
    if (params?.employee) leaves = leaves.filter(l => l.employee === params.employee);
    return ok({ success: true, count: leaves.length, leaves });
  },

  'PUT /attendance/leave/:id': async (data, params) => {
    await delay();
    const leaves = get('leaves') || [];
    const idx = leaves.findIndex(l => l._id === params.id);
    if (idx === -1) err('Leave not found', 404);
    leaves[idx] = { ...leaves[idx], ...data };
    save('leaves', leaves);
    return ok({ success: true, leave: leaves[idx] });
  },

  // ── Payroll ───────────────────────────────────────────────────────────────
  'GET /payroll': async (params) => {
    await delay();
    let pr = get('payroll') || [];
    if (params?.employee) pr = pr.filter(p => p.employee === params.employee);
    if (params?.month)    pr = pr.filter(p => p.month === Number(params.month));
    if (params?.year)     pr = pr.filter(p => p.year === Number(params.year));
    const emps = get('employees') || [];
    pr = pr.map(p => ({ ...p, employee: emps.find(e => e._id === p.employee) || p.employee }));
    return ok({ success: true, count: pr.length, payroll: pr });
  },

  'POST /payroll/process': async (data) => {
    await delay(400);
    const pr = get('payroll') || [];
    const rec = { _id: newId(), status: 'processed', createdAt: new Date().toISOString(), ...data };
    pr.push(rec);
    save('payroll', pr);
    return ok({ success: true, payroll: rec });
  },

  'GET /payroll/:id': async (_, params) => {
    await delay();
    const pr = get('payroll') || [];
    const rec = pr.find(p => p._id === params.id);
    if (!rec) err('Payroll record not found', 404);
    return ok({ success: true, payroll: rec });
  },

  'PUT /payroll/:id': async (data, params) => {
    await delay();
    const pr = get('payroll') || [];
    const idx = pr.findIndex(p => p._id === params.id);
    if (idx === -1) err('Payroll record not found', 404);
    pr[idx] = { ...pr[idx], ...data };
    save('payroll', pr);
    return ok({ success: true, payroll: pr[idx] });
  },

  'PUT /payroll/:id/pay': async (_, params) => {
    await delay();
    const pr = get('payroll') || [];
    const idx = pr.findIndex(p => p._id === params.id);
    if (idx === -1) err('Payroll record not found', 404);
    pr[idx].status = 'paid';
    pr[idx].paidOn = new Date().toISOString();
    save('payroll', pr);
    return ok({ success: true, payroll: pr[idx] });
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  'GET /dashboard/admin': async () => {
    await delay(300);
    const employees   = get('employees') || [];
    const jobs        = get('jobs') || [];
    const applications= get('applications') || [];
    const attendance  = get('attendance') || [];
    const payroll     = get('payroll') || [];
    const now = new Date();
    const thisMonth = attendance.filter(a => { const d = new Date(a.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    const presentToday = attendance.filter(a => { const d = new Date(a.date); return d.toDateString() === now.toDateString() && a.status === 'present'; });
    const totalSalary = payroll.filter(p => p.month === now.getMonth() + 1 && p.year === now.getFullYear()).reduce((s, p) => s + (p.netSalary || 0), 0);
    return ok({
      success: true,
      stats: {
        totalEmployees: employees.length, activeEmployees: employees.filter(e => e.status === 'active').length,
        openJobs: jobs.filter(j => j.status === 'open').length, totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        presentToday: presentToday.length, totalSalaryThisMonth: totalSalary,
        attendanceRate: thisMonth.length ? Math.round(thisMonth.filter(a => a.status === 'present').length / thisMonth.length * 100) : 0
      },
      departmentStats: ['Engineering','Design','Marketing','HR'].map(dept => ({
        department: dept, count: employees.filter(e => e.department === dept).length,
        avgSalary: Math.round(employees.filter(e => e.department === dept).reduce((s, e) => s + (e.salary || 0), 0) / Math.max(employees.filter(e => e.department === dept).length, 1))
      })),
      recentApplications: applications.slice(-5).reverse(),
      recentEmployees: employees.slice(-5).reverse()
    });
  },

  'GET /dashboard/hr': async () => {
    await delay(300);
    const employees    = get('employees') || [];
    const applications = get('applications') || [];
    const jobs         = get('jobs') || [];
    return ok({
      success: true,
      stats: {
        totalEmployees: employees.length, openJobs: jobs.filter(j => j.status === 'open').length,
        totalApplications: applications.length, pendingReview: applications.filter(a => a.status === 'pending').length
      },
      recentApplications: applications.slice(-5).reverse()
    });
  },

  'GET /dashboard/employee': async () => {
    await delay(300);
    const me = authUser();
    const employees = get('employees') || [];
    const employee  = employees.find(e => e.user === me._id);
    const attendance = (get('attendance') || []).filter(a => a.employee === employee?._id);
    const payroll    = (get('payroll') || []).filter(p => p.employee === employee?._id);
    const now = new Date();
    const thisMonthAtt = attendance.filter(a => { const d = new Date(a.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    return ok({
      success: true,
      employee: populateEmployee(employee),
      stats: {
        presentDays: thisMonthAtt.filter(a => a.status === 'present').length,
        absentDays:  thisMonthAtt.filter(a => a.status === 'absent').length,
        lateDays:    thisMonthAtt.filter(a => a.status === 'late').length,
        totalWorkHours: +thisMonthAtt.reduce((s, a) => s + (a.workHours || 0), 0).toFixed(1)
      },
      recentAttendance: thisMonthAtt.slice(-7).reverse(),
      latestPayslip: payroll.sort((a, b) => b.year - a.year || b.month - a.month)[0] || null
    });
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  'GET /notifications': async () => {
    await delay(100);
    return ok({ success: true, notifications: [] });
  },

  'PUT /notifications/:id/read': async () => ok({ success: true }),
  'PUT /notifications/read-all': async () => ok({ success: true }),
};

// ════════════════════════════════════════════════════════════════════════════
//  ROUTER — match URL pattern to handler
// ════════════════════════════════════════════════════════════════════════════
const matchRoute = (method, url) => {
  for (const pattern of Object.keys(mockHandlers)) {
    const [pm, pp] = pattern.split(' ');
    if (pm !== method.toUpperCase()) continue;

    // Build regex from pattern segments
    const segments = pp.split('/');
    const urlSegs  = url.split('/');
    if (segments.length !== urlSegs.length) continue;

    const params = {};
    const matched = segments.every((seg, i) => {
      if (seg.startsWith(':')) { params[seg.slice(1)] = urlSegs[i]; return true; }
      return seg === urlSegs[i];
    });

    if (matched) return { handler: mockHandlers[pattern], params };
  }
  return null;
};

// ════════════════════════════════════════════════════════════════════════════
//  MAIN DISPATCH
// ════════════════════════════════════════════════════════════════════════════
export const mockDispatch = async (method, fullUrl, body = {}, queryParams = {}) => {
  seedIfEmpty();

  // Strip base prefix so we just match /auth/login etc.
  const base = '/api';
  const url  = fullUrl.startsWith(base) ? fullUrl.slice(base.length) : fullUrl;

  // Split path from query string
  const [path] = url.split('?');

  const route = matchRoute(method, path);
  if (!route) {
    const e = new Error(`Mock: No handler for ${method} ${path}`);
    e.response = { data: { success: false, message: `No mock handler for ${method} ${path}` }, status: 404 };
    throw e;
  }

  return route.handler(
    method === 'GET' ? queryParams : body,
    route.params,
    queryParams
  );
};

export const isMockMode = () =>
  import.meta.env.VITE_MOCK_MODE === 'true' ||
  window.location.hostname.includes('github.io');
