const express = require('express');
const router = express.Router();
const { handleIncoming } = require('../controllers/whatsappController');

// Twilio webhook – no auth (Twilio sends requests here)
router.post('/webhook', express.urlencoded({ extended: false }), handleIncoming);

module.exports = router;
