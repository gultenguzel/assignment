const express = require('express');
const router = express.Router();

const webController = require('../service-B/webController');

router.post('/addTuition', webController.addTuition);
router.post('/unpaidTuitionStatus', webController.unpaidTuitionStatus);

module.exports = router;
