const router = require('express').Router();
const supabase = require('../lib/supabase');
const { asyncHandler } = require('../middleware/error.middleware');
const cache = require('../lib/cache');

router.get('/', asyncHandler(async (req, res) => {
  const cached = cache.get('categories:all');
  if (cached) return res.json(cached);

  const { data: categories } = await supabase.from('categories')
    .select('*, events(count)').order('name');
  const result = (categories || []).map(c => ({
    ...c,
    _count: { events: c.events?.[0]?.count || 0 },
    events: undefined,
  }));
  cache.set('categories:all', result, 60000);
  res.json(result);
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const { data: category } = await supabase.from('categories')
    .select('*').eq('slug', req.params.slug).maybeSingle();
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
}));

module.exports = router;
