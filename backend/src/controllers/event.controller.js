const supabase = require('../lib/supabase');
const { asyncHandler } = require('../middleware/error.middleware');
const cache = require('../lib/cache');

const getEvents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, search, city, minPrice, maxPrice, startDate, featured, hot, sort = 'start_date' } = req.query;

  const cacheKey = `events:${JSON.stringify(req.query)}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const from = (parseInt(page) - 1) * parseInt(limit);
  const to = from + parseInt(limit) - 1;

  let query = supabase
    .from('events')
    .select(`*, category:categories(id,name,slug,icon,color), venue:venues(id,name,city)`, { count: 'exact' })
    .eq('status', 'PUBLISHED');

  if (category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).maybeSingle();
    if (cat) query = query.eq('category_id', cat.id);
  }
  if (city) query = query.ilike('venues.city', `%${city}%`);
  if (featured === 'true') query = query.eq('is_featured', true);
  if (hot === 'true') query = query.eq('is_hot', true);
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  if (minPrice) query = query.gte('min_price', parseFloat(minPrice));
  if (maxPrice) query = query.lte('min_price', parseFloat(maxPrice));
  if (startDate) query = query.gte('start_date', startDate);

  const resolvedSort = sort === 'startDate' ? 'start_date' : sort;
  const orderCol = resolvedSort === 'price' ? 'min_price' : resolvedSort === 'popular' ? 'sold_seats' : 'start_date';
  query = query.order(orderCol, { ascending: resolvedSort !== 'popular' }).range(from, to);

  const { data: events, count, error } = await query;
  if (error) return res.status(400).json({ error: error.message });

  const result = {
    events: events || [],
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count || 0, pages: Math.ceil((count || 0) / parseInt(limit)) },
  };
  cache.set(cacheKey, result, 20000); // 20s cache
  res.json(result);
});

const getEventBySlug = asyncHandler(async (req, res) => {
  const { data: event, error } = await supabase
    .from('events')
    .select(`*, category:categories(*), venue:venues(*), hall:halls(*), ticket_types(*), reviews(*, user:users(name,avatar))`)
    .eq('slug', req.params.slug)
    .maybeSingle();

  if (error || !event) return res.status(404).json({ error: 'Event not found' });

  let isFavorited = false;
  if (req.user) {
    const { data: fav } = await supabase.from('favorites')
      .select('id').eq('user_id', req.user.id).eq('event_id', event.id).maybeSingle();
    isFavorited = !!fav;
  }

  res.json({ ...event, isFavorited });
});

const getFeaturedEvents = asyncHandler(async (req, res) => {
  const cached = cache.get('events:featured');
  if (cached) return res.json(cached);

  const { data: events } = await supabase
    .from('events')
    .select(`*, category:categories(id,name,slug,icon,color), venue:venues(name,city)`)
    .eq('status', 'PUBLISHED').eq('is_featured', true)
    .order('start_date').limit(6);

  const result = events || [];
  cache.set('events:featured', result, 30000);
  res.json(result);
});

const getUpcomingEvents = asyncHandler(async (req, res) => {
  const { data: events } = await supabase
    .from('events')
    .select(`*, category:categories(id,name,slug,icon,color), venue:venues(name,city)`)
    .eq('status', 'PUBLISHED').gte('start_date', new Date().toISOString())
    .order('start_date').limit(8);
  res.json(events || []);
});

const createEvent = asyncHandler(async (req, res) => {
  const data = req.body;
  const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  const { data: event, error } = await supabase
    .from('events').insert({ ...data, slug }).select(`*, category:categories(*), venue:venues(*)`).single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(event);
});

const updateEvent = asyncHandler(async (req, res) => {
  const { data: event, error } = await supabase
    .from('events').update(req.body).eq('id', req.params.id)
    .select(`*, category:categories(*), venue:venues(*)`).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(event);
});

const deleteEvent = asyncHandler(async (req, res) => {
  await supabase.from('events').delete().eq('id', req.params.id);
  res.json({ message: 'Event deleted' });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  const { data: existing } = await supabase.from('favorites')
    .select('id').eq('user_id', userId).eq('event_id', eventId).maybeSingle();

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id);
    return res.json({ isFavorited: false });
  }
  await supabase.from('favorites').insert({ user_id: userId, event_id: eventId });
  res.json({ isFavorited: true });
});

module.exports = { getEvents, getEventBySlug, getFeaturedEvents, getUpcomingEvents, createEvent, updateEvent, deleteEvent, toggleFavorite };
