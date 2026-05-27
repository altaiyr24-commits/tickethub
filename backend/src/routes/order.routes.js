const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.post('/payment-intent', orderController.createPaymentIntent);
router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;
