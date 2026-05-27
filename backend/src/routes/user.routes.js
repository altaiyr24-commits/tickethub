const router = require('express').Router();
const supabase = require('../lib/supabase');
const bcrypt = require('bcryptjs');
const { authenticate } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authenticate);

router.get('/profile', asyncHandler(async (req, res) => {
  const { data: user } = await supabase.from('users')
    .select('id,email,name,phone,avatar,role,created_at').eq('id', req.user.id).single();
  res.json(user);
}));

router.put('/profile', asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const { data: user } = await supabase.from('users')
    .update({ name, phone, avatar }).eq('id', req.user.id)
    .select('id,email,name,phone,avatar').single();
  res.json(user);
}));

router.put('/password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { data: user } = await supabase.from('users').select('password').eq('id', req.user.id).single();
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return res.status(400).json({ error: 'Current password is incorrect' });
  const hashed = await bcrypt.hash(newPassword, 12);
  await supabase.from('users').update({ password: hashed }).eq('id', req.user.id);
  res.json({ message: 'Password updated' });
}));

router.get('/favorites', asyncHandler(async (req, res) => {
  const { data: favorites } = await supabase.from('favorites')
    .select('*, event:events(*, category:categories(*), venue:venues(name,city))')
    .eq('user_id', req.user.id).order('created_at', { ascending: false });
  res.json((favorites || []).map(f => f.event));
}));

module.exports = router;
