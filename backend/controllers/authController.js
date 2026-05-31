const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @desc   Register user
// @route  POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'employee' });
    const token = signToken(user._id);
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Login
// @route  POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email/Name and password required' });

    const user = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { name: { $regex: new RegExp('^' + email + '$', 'i') } }
      ]
    }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isActive)
      return res.status(401).json({ success: false, message: 'Account is deactivated' });

    // Verify selected role matches user's actual role
    if (role && user.role !== role) {
      const roleLabels = { admin: 'Admin', hr: 'HR Manager', employee: 'Employee' };
      return res.status(403).json({
        success: false,
        message: `Role mismatch! You selected "${roleLabels[role] || role}" but your account is registered as "${roleLabels[user.role] || user.role}". Please select the correct role.`
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    // Fetch linked employee if exists
    const employee = await Employee.findOne({ user: user._id });

    res.json({ success: true, token, user, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get current user
// @route  GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const employee = await Employee.findOne({ user: req.user._id });
    res.json({ success: true, user, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update password
// @route  PUT /api/auth/update-password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    const token = signToken(user._id);
    res.json({ success: true, token, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get all users (admin)
// @route  GET /api/auth/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Toggle user active/inactive
// @route  PUT /api/auth/users/:id/toggle
exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- OTP / SOCIAL AUTHENTICATION ENHANCEMENTS ---
const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"EMS Pro Portal" <${process.env.EMAIL_USER || 'no-reply@emspro.com'}>`,
    to: email,
    subject: 'EMS Pro - Your Magic OTP Login Code',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #2a2a4a; border-radius: 16px; background-color: #0d0d1a; color: #e8e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <h2 style="color: #6c63ff; text-align: center; margin-bottom: 24px; font-weight: 800;">EMS Pro Workspace</h2>
        <p>Hello,</p>
        <p>You requested a passwordless magic OTP to sign in to your EMS Pro account.</p>
        <p>Use the following 6-digit verification code to complete your login. This code is valid for 5 minutes:</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 38px; font-weight: 900; letter-spacing: 8px; padding: 16px 32px; background-color: #16162e; border: 2px solid #6c63ff; border-radius: 12px; color: #00d4aa; display: inline-block; box-shadow: 0 0 15px rgba(108,99,255,0.3);">
            ${otp}
          </span>
        </div>
        <p style="color: #a0aec0; font-size: 13px;">If you did not request this code, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #2a2a4a; margin: 32px 0;" />
        <p style="text-align: center; color: #a0aec0; font-size: 11px;">EMS Pro Suite &copy; ${new Date().getFullYear()}</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// @desc   Social Login / Register (Google, GitHub, Microsoft)
// @route  POST /api/auth/social-login
exports.socialLogin = async (req, res) => {
  try {
    const { email, name, provider, providerId, avatar, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for social login' });
    }

    // Try finding user by providerId or email
    let query = {};
    if (provider === 'google') query = { $or: [{ googleId: providerId }, { email: email.toLowerCase() }] };
    else if (provider === 'github') query = { $or: [{ githubId: providerId }, { email: email.toLowerCase() }] };
    else if (provider === 'microsoft') query = { $or: [{ microsoftId: providerId }, { email: email.toLowerCase() }] };
    else query = { email: email.toLowerCase() };

    let user = await User.findOne(query);

    if (user) {
      // User exists - update provider details
      user.authProvider = provider;
      if (provider === 'google') user.googleId = providerId;
      if (provider === 'github') user.githubId = providerId;
      if (provider === 'microsoft') user.microsoftId = providerId;
      if (avatar && !user.avatar) user.avatar = avatar;
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      // Fetch linked employee
      let employee = await Employee.findOne({ user: user._id });

      const token = signToken(user._id);
      return res.json({ success: true, token, user, employee });
    } else {
      // User does not exist - must register
      if (!role) {
        return res.json({
          success: false,
          requireRole: true,
          email,
          name,
          provider,
          providerId,
          avatar,
          message: 'Please select a role to complete your registration.'
        });
      }

      // Generate random secure password
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-8);

      user = new User({
        name,
        email: email.toLowerCase(),
        password: randomPassword,
        role,
        authProvider: provider,
        avatar: avatar || '',
        isActive: true,
        lastLogin: new Date()
      });

      if (provider === 'google') user.googleId = providerId;
      if (provider === 'github') user.githubId = providerId;
      if (provider === 'microsoft') user.microsoftId = providerId;

      await user.save();

      // Automatically create linked Employee record if role is employee
      let employee = null;
      if (role === 'employee') {
        const count = await Employee.countDocuments();
        const employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
        const nameParts = name ? name.split(' ') : ['OAuth', 'User'];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'Employee';

        employee = await Employee.create({
          user: user._id,
          employeeId,
          firstName,
          lastName,
          email: email.toLowerCase(),
          department: 'Engineering',
          designation: 'Software Engineer',
          joiningDate: new Date(),
          status: 'active'
        });
      }

      const token = signToken(user._id);
      return res.status(201).json({ success: true, token, user, employee });
    }
  } catch (err) {
    console.error('Social Login Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Send OTP Magic Code
// @route  POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    let user = await User.findOne({ email: email.toLowerCase() });
    
    // Create skeleton user if they don't exist
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-8);
      user = new User({
        name: email.split('@')[0],
        email: email.toLowerCase(),
        password: randomPassword,
        role: 'employee', // default until verification/selection
        isActive: true
      });
    }

    user.otpCode = otp;
    user.otpExpiry = expiry;
    await user.save({ validateBeforeSave: false });

    // Attempt to send email
    let emailSent = false;
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
        await sendOTPEmail(email.toLowerCase(), otp);
        emailSent = true;
      }
    } catch (err) {
      console.error('Mailer error:', err);
    }

    console.log(`[OTP Verification] Code for ${email}: ${otp}`);

    const isDev = process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com';
    res.json({
      success: true,
      message: emailSent ? 'OTP sent to your email' : 'OTP generated (Email service mock)',
      demoCode: isDev ? otp : undefined,
      warning: !emailSent ? 'Email provider not configured. Using local fallback OTP code.' : undefined
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Verify OTP and Login
// @route  POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { email, code, role } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: 'Email and OTP code are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.otpCode || user.otpCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP code has expired' });
    }

    user.otpCode = undefined;
    user.otpExpiry = undefined;
    
    if (role && user.role !== role) {
      if (user.name === email.split('@')[0]) {
        user.role = role;
      }
    }
    
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    let employee = await Employee.findOne({ user: user._id });
    if (user.role === 'employee' && !employee) {
      const count = await Employee.countDocuments();
      const employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
      const nameParts = user.name ? user.name.split(' ') : ['OTP', 'User'];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Employee';

      employee = await Employee.create({
        user: user._id,
        employeeId,
        firstName,
        lastName,
        email: email.toLowerCase(),
        department: 'Engineering',
        designation: 'Software Engineer',
        joiningDate: new Date(),
        status: 'active'
      });
    }

    const token = signToken(user._id);
    res.json({ success: true, token, user, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

