const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../lib/supabase');
const { asyncHandler } = require('../middleware/error.middleware');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
  const { email, password, name, phone } = req.body;

  // Check if email already exists — use maybeSingle() to avoid error when not found
  const { data: existing } = await supabase
    .from('users').select('id').eq('email', email).maybeSingle();
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hashedPassword = await bcrypt.hash(password, 12);
  const { data: user, error } = await supabase
    .from('users')
    .insert({ id: uuidv4(), email, password: hashedPassword, name, phone, role: 'USER' })
    .select('id, email, name, role')
    .single();

  if (error) return res.status(400).json({ error: error.message });

  const { accessToken, refreshToken } = generateTokens(user.id);
  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await supabase.from('users').update({ refresh_token: hashedRefresh }).eq('id', user.id);

  res.status(201).json({ user, accessToken, refreshToken });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Use maybeSingle() to avoid error when user not found
  const { data: user } = await supabase
    .from('users').select('*').eq('email', email).maybeSingle();
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  const { accessToken, refreshToken } = generateTokens(user.id);
  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await supabase.from('users').update({ refresh_token: hashedRefresh }).eq('id', user.id);

  const { password: _, refresh_token: __, ...userSafe } = user;
  res.json({ user: userSafe, accessToken, refreshToken });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) return res.status(401).json({ error: 'Refresh token required' });

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const { data: user } = await supabase
    .from('users').select('*').eq('id', decoded.userId).maybeSingle();

  if (!user?.refresh_token) return res.status(401).json({ error: 'Invalid refresh token' });

  const isValid = await bcrypt.compare(token, user.refresh_token);
  if (!isValid) return res.status(401).json({ error: 'Invalid refresh token' });

  const tokens = generateTokens(user.id);
  const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
  await supabase.from('users').update({ refresh_token: hashedRefresh }).eq('id', user.id);

  res.json(tokens);
});

const logout = asyncHandler(async (req, res) => {
  await supabase.from('users').update({ refresh_token: null }).eq('id', req.user.id);
  res.json({ message: 'Logged out successfully' });
});

const getMe = asyncHandler(async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, email, name, phone, avatar, role, created_at')
    .eq('id', req.user.id)
    .single();
  res.json(user);
});

const forgotPassword = asyncHandler(async (req, res) => {
  res.json({ message: 'If email exists, reset link sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  res.json({ message: 'Password reset successfully' });
});

module.exports = { register, login, refreshToken, logout, getMe, forgotPassword, resetPassword };
