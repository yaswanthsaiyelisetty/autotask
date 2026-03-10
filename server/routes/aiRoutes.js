const express = require('express');
const router = express.Router();
const { parseMessage } = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/parse', auth, parseMessage);

module.exports = router;
