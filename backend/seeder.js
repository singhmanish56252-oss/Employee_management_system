const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

// Models
const User = require('./models/User');
const Employee = require('./models/Employee');
const Job = require('./models/Job');
const Application = require('./models/Application');
const { Attendance } = require('./models/Attendance');
const Payroll = require('./models/Payroll');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing
  await Promise.all([User.deleteMany(), Employee.deleteMany(), Job.deleteMany(), Application.deleteMany(), Attendance.deleteMany(), Payroll.deleteMany()]);
  console.log('🧹 Cleared existing data');

  // Create Users
  const adminUser  = await User.create({ name:'Admin Singh', email:'admin@ems.com', password:'admin123', role:'admin' });
  const hrUser     = await User.create({ name:'HR Manager', email:'hr@ems.com', password:'hr123456', role:'hr' });
  const empUser1   = await User.create({ name:'Rahul Sharma', email:'emp@ems.com', password:'emp12345', role:'employee' });
  const empUser2   = await User.create({ name:'Priya Patel', email:'priya@ems.com', password:'priya123', role:'employee' });
  const empUser3   = await User.create({ name:'Amit Kumar', email:'amit@ems.com', password:'amit1234', role:'employee' });
  console.log('👤 Users created');

  // Create Employees
  const emp1 = await Employee.create({
    user: empUser1._id, employeeId:'EMP0001', firstName:'Rahul', lastName:'Sharma',
    email:'emp@ems.com', phone:'+91 9876543210', department:'Engineering',
    designation:'Senior Software Engineer', employeeType:'full-time',
    joiningDate: new Date('2022-01-15'), salary:85000, gender:'male',
    address:{ city:'Mumbai', state:'Maharashtra', country:'India' },
    skills:['React','Node.js','MongoDB','AWS'], status:'active'
  });
  const emp2 = await Employee.create({
    user: empUser2._id, employeeId:'EMP0002', firstName:'Priya', lastName:'Patel',
    email:'priya@ems.com', phone:'+91 9876543211', department:'Design',
    designation:'UI/UX Designer', employeeType:'full-time',
    joiningDate: new Date('2022-06-01'), salary:70000, gender:'female',
    address:{ city:'Bangalore', state:'Karnataka', country:'India' },
    skills:['Figma','Adobe XD','Sketch','CSS'], status:'active'
  });
  const emp3 = await Employee.create({
    user: empUser3._id, employeeId:'EMP0003', firstName:'Amit', lastName:'Kumar',
    email:'amit@ems.com', phone:'+91 9876543212', department:'Marketing',
    designation:'Marketing Manager', employeeType:'full-time',
    joiningDate: new Date('2021-11-10'), salary:75000, gender:'male',
    address:{ city:'Delhi', state:'Delhi', country:'India' },
    skills:['SEO','Content','Analytics','Social Media'], status:'active'
  });
  const hrEmp = await Employee.create({
    user: hrUser._id, employeeId:'EMP0004', firstName:'HR', lastName:'Manager',
    email:'hr@ems.com', phone:'+91 9876543213', department:'HR',
    designation:'HR Manager', employeeType:'full-time',
    joiningDate: new Date('2020-03-01'), salary:90000, gender:'male',
    address:{ city:'Pune', state:'Maharashtra', country:'India' }, status:'active'
  });
  console.log('👥 Employees created');

  // Create Jobs
  const jobs = await Job.insertMany([
    { title:'Full Stack Developer', department:'Engineering', description:'We are looking for an experienced Full Stack Developer to join our engineering team. You will work on exciting projects using React, Node.js and MongoDB.', type:'full-time', location:'Bangalore / Remote', salaryMin:800000, salaryMax:1500000, experience:'3-5 years', skills:['React','Node.js','MongoDB','REST APIs'], requirements:['BSc/BTech Computer Science','3+ years experience','Strong JavaScript skills'], status:'open', deadline: new Date('2026-06-30'), postedBy: adminUser._id },
    { title:'UI/UX Designer', department:'Design', description:'Join our creative team as a UI/UX Designer. You will create beautiful, user-friendly interfaces for our web and mobile applications.', type:'full-time', location:'Mumbai', salaryMin:600000, salaryMax:1000000, experience:'2-4 years', skills:['Figma','Design Systems','Prototyping','User Research'], requirements:['Portfolio required','Figma proficiency','Experience with design systems'], status:'open', deadline: new Date('2026-05-31'), postedBy: hrUser._id },
    { title:'Marketing Executive', department:'Marketing', description:'We are hiring a Marketing Executive to drive our digital marketing strategy and grow our brand presence.', type:'full-time', location:'Delhi / Remote', salaryMin:500000, salaryMax:800000, experience:'1-3 years', skills:['Google Ads','SEO','Email Marketing','Analytics'], requirements:['MBA Marketing (preferred)','Experience with digital tools'], status:'open', deadline: new Date('2026-06-15'), postedBy: adminUser._id },
    { title:'Data Analyst Intern', department:'Engineering', description:'12-month internship opportunity for data analysts to work on real-world data projects.', type:'intern', location:'Remote', salaryMin:20000, salaryMax:35000, experience:'0-1 year', skills:['Python','SQL','Tableau','Excel'], requirements:["Final year student or recent graduate","Python proficiency"], status:'open', deadline: new Date('2026-05-15'), postedBy: hrUser._id },
    { title:'HR Executive', department:'HR', description:'Looking for a dynamic HR Executive to assist in recruitment, onboarding and employee engagement activities.', type:'full-time', location:'Pune', salaryMin:400000, salaryMax:650000, experience:'1-2 years', skills:['Recruitment','Onboarding','HR Policies','MS Office'], requirements:['MBA HR or equivalent','Good communication skills'], status:'open', deadline: new Date('2026-07-01'), postedBy: adminUser._id },
  ]);
  console.log('💼 Jobs created');

  // Create Applications
  await Application.insertMany([
    { job: jobs[0]._id, applicantName:'Vikram Singh', applicantEmail:'vikram@email.com', phone:'+91 9000000001', experience:4, currentCompany:'TCS', expectedSalary:1200000, coverLetter:'I am highly skilled full stack developer...', status:'shortlisted', stageHistory:[{stage:'pending'},{stage:'reviewed'},{stage:'shortlisted'}] },
    { job: jobs[0]._id, applicantName:'Sneha Gupta', applicantEmail:'sneha@email.com', phone:'+91 9000000002', experience:3, currentCompany:'Infosys', expectedSalary:1000000, status:'reviewed', stageHistory:[{stage:'pending'},{stage:'reviewed'}] },
    { job: jobs[1]._id, applicantName:'Riya Shah', applicantEmail:'riya@email.com', phone:'+91 9000000003', experience:2, currentCompany:'Freelancer', expectedSalary:800000, status:'interviewed', stageHistory:[{stage:'pending'},{stage:'reviewed'},{stage:'shortlisted'},{stage:'interviewed'}] },
    { job: jobs[2]._id, applicantName:'Arjun Mehta', applicantEmail:'arjun@email.com', phone:'+91 9000000004', experience:1, status:'pending' },
    { job: jobs[3]._id, applicantName:'Pooja Verma', applicantEmail:'pooja@email.com', phone:'+91 9000000005', experience:0, status:'pending' },
  ]);
  // Update job application counts
  await Job.findByIdAndUpdate(jobs[0]._id, { applicationsCount: 2 });
  await Job.findByIdAndUpdate(jobs[1]._id, { applicationsCount: 1 });
  await Job.findByIdAndUpdate(jobs[2]._id, { applicationsCount: 1 });
  await Job.findByIdAndUpdate(jobs[3]._id, { applicationsCount: 1 });
  console.log('📋 Applications created');

  // Attendance for this month
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const emps = [emp1, emp2, emp3];
  const attDocs = [];

  for (let day = 1; day <= now.getDate() - 1; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends

    for (const emp of emps) {
      const isLate = Math.random() < 0.1;
      const isAbsent = Math.random() < 0.05;
      const checkInHour = isLate ? 10 : 9;
      const checkIn = new Date(year, month, day, checkInHour, Math.floor(Math.random()*30));
      const checkOut = new Date(year, month, day, 18, Math.floor(Math.random()*30));
      const workHours = (checkOut - checkIn)/(1000*60*60);
      const overtime = workHours > 8 ? parseFloat((workHours-8).toFixed(2)) : 0;

      attDocs.push({
        employee: emp._id,
        date,
        checkIn: isAbsent ? null : checkIn,
        checkOut: isAbsent ? null : checkOut,
        status: isAbsent ? 'absent' : isLate ? 'late' : 'present',
        workHours: isAbsent ? 0 : parseFloat(workHours.toFixed(2)),
        overtime,
        markedBy: adminUser._id
      });
    }
  }
  if (attDocs.length > 0) await Attendance.insertMany(attDocs);
  console.log(`📅 ${attDocs.length} attendance records created`);

  // Create Payroll for last 3 months
  for (let i = 2; i >= 0; i--) {
    const d = new Date(year, month - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();

    for (const emp of emps) {
      const daysWorked = 20 + Math.floor(Math.random()*3);
      const basicSalary = emp.salary;
      const hra = basicSalary * 0.4;
      const allowances = basicSalary * 0.1;
      const taxDeduction = basicSalary > 50000 ? basicSalary * 0.1 : 0;
      const pfDeduction = basicSalary * 0.12;
      const epsSalary = Math.min(basicSalary, 15000);
      const employerEPS = epsSalary * 0.0833;
      const employerEPF = pfDeduction - employerEPS;
      const grossSalary = basicSalary + hra + allowances;
      const totalDeductions = taxDeduction + pfDeduction;
      const netSalary = grossSalary - totalDeductions;

      await Payroll.create({
        employee: emp._id, month: m, year: y,
        basicSalary, hra, allowances, overtimePay: 0, bonus: 0,
        grossSalary: parseFloat(grossSalary.toFixed(2)),
        taxDeduction: parseFloat(taxDeduction.toFixed(2)),
        pfDeduction: parseFloat(pfDeduction.toFixed(2)),
        employerEPF: parseFloat(employerEPF.toFixed(2)),
        employerEPS: parseFloat(employerEPS.toFixed(2)),
        otherDeductions: 0,
        totalDeductions: parseFloat(totalDeductions.toFixed(2)),
        netSalary: parseFloat(netSalary.toFixed(2)),
        daysWorked, status: i === 0 ? 'processed' : 'paid',
        paidOn: i === 0 ? null : new Date(y, m, 5),
        processedBy: adminUser._id
      });
    }
  }
  console.log('💰 Payroll records created');

  console.log('\n✅ SEED COMPLETE!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Login Credentials:');
  console.log('  ADMIN   → admin@ems.com    / admin123');
  console.log('  HR      → hr@ems.com       / hr123456');
  console.log('  EMPLOYEE→ emp@ems.com      / emp12345');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error('❌ Seed error:', err); process.exit(1); });
