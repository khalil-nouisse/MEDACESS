const express = require('express');
const { updateData } = require('../controllers/userController');
const router = express.Router();

router.post('/update', updateData);

module.exports = router;