const router = require('express').Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authenticate, requireAdmin);

router.get('/stats', asyncHandler(async (req, res) => {
  const [
    { count: totalUsers },
    { count: totalEvents },
    { count: totalOrders },
    { data: revenueData },
    { data: recentOrders },
    { data: topEvents },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'CONFIRMED'),
    supabase.from('orders').select('total_amount').eq('status', 'CONFIRMED'),
    supabase.from('orders').select('*, user:users(name,email), event:events(title)').order('created_at', { ascending: false }).limit(10),
    supabase.from('events').select('id,title,sold_seats,total_seats,min_price').order('sold_seats', { ascending: false }).limit(5),
  ]);

  const revenue = (revenueData || []).reduce((sum, o) => sum + (o.total_amount || 0), 0);

  res.json({
    stats: { totalUsers: totalUsers || 0, totalEvents: totalEvents || 0, totalOrders: totalOrders || 0, revenue },
    recentOrders: recentOrders || [],
    topEvents: topEvents || [],
  });
}));

router.get('/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const from = (parseInt(page) - 1) * parseInt(limit);
  const to = from + parseInt(limit) - 1;

  let query = supabase.from('users').select('id,email,name,role,created_at', { count: 'exact' });
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  const { data: users, count } = await query.order('created_at', { ascending: false }).range(from, to);

  res.json({ users: users || [], total: count || 0 });
}));

router.put('/users/:id/role', asyncHandler(async (req, res) => {
  const { data: user } = await supabase.from('users')
    .update({ role: req.body.role }).eq('id', req.params.id)
    .select('id,email,name,role').single();
  res.json(user);
}));

router.get('/orders', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const from = (parseInt(page) - 1) * parseInt(limit);
  const to = from + parseInt(limit) - 1;

  const { data: orders, count } = await supabase.from('orders')
    .select('*, user:users(name,email), event:events(title), items:order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false }).range(from, to);

  res.json({ orders: orders || [], total: count || 0 });
}));

router.post('/categories', asyncHandler(async (req, res) => {
  const { name, icon, color } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const { data, error } = await supabase.from('categories').insert({ name, slug, icon, color }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}));

router.post('/venues', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('venues').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}));

router.post('/halls', asyncHandler(async (req, res) => {
  const { venue_id, name, rows, seats_per_row } = req.body;
  const { data, error } = await supabase.from('halls')
    .insert({ venue_id, name, rows, seats_per_row, total_seats: rows * seats_per_row }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}));

module.exports = router;
