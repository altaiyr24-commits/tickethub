const router = require('express').Router();
const eventController = require('../controllers/event.controller');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth.middleware');

router.get('/', eventController.getEvents);
router.get('/featured', eventController.getFeaturedEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/:slug', optionalAuth, eventController.getEventBySlug);

router.post('/', authenticate, requireAdmin, eventController.createEvent);
router.put('/:id', authenticate, requireAdmin, eventController.updateEvent);
router.delete('/:id', authenticate, requireAdmin, eventController.deleteEvent);

router.post('/:eventId/favorite', authenticate, eventController.toggleFavorite);

module.exports = router;
