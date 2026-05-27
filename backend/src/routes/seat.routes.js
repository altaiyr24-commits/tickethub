const router = require('express').Router();
const seatController = require('../controllers/seat.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.get('/event/:eventId', seatController.getSeatsByEvent);
router.post('/reserve', authenticate, seatController.reserveSeats);
router.post('/release', authenticate, seatController.releaseSeats);
router.post('/generate', authenticate, requireAdmin, seatController.generateHallSeats);

module.exports = router;
