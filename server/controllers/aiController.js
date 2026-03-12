const { parseTaskMessage } = require('../services/aiService');

// POST /api/ai/parse
exports.parseMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const result = await parseTaskMessage(message, req.user.timezone);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
