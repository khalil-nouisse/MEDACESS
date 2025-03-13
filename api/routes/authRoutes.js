const express = require('express');
const { register, login, logout, activateAccount, forgotPassword, validateResetToken} = require('../controllers/authController');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/activate', activateAccount);
router.get('/reset-password', validateResetToken);
router.post('/forgot-password', forgotPassword);


module.exports = router;