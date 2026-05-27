const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

router.post('/register',
  [
    body('email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
    body('password').isLength({ min: 6 }),
    body('name').trim().isLength({ min: 2 }),
  ],
  validate,
  authController.register
);

router.post('/login',
  [
    body('email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
    body('password').notEmpty(),
  ],
  validate,
  authController.login
);

router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
