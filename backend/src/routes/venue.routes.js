const router = require('express').Router();
const supabase = require('../lib/supabase');
const { asyncHandler } = require('../middleware/error.middleware');

router.get('/', asyncHandler(async (req, res) => {
  const { data: venues } = await supabase.from('venues').select('*').order('name');
  res.json(venues || []);
}));

router.get('/:id/halls', asyncHandler(async (req, res) => {
  const { data: halls } = await supabase.from('halls').select('*').eq('venue_id', req.params.id);
  res.json(halls || []);
}));

module.exports = router;
