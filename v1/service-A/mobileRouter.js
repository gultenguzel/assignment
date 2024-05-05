const express = require('express');
const router = express.Router();

const mobileController = require('../service-A/mobileController');

// Kullanıcılarla ilgili route'lar
router.post('/querytuition', mobileController.balanceandtotaltuition);

module.exports = router;
