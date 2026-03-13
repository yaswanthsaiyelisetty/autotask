const User = require('../models/User');
const Task = require('../models/Task');
const { parseTaskMessage } = require('../services/aiService');
const { getDateTimeParts } = require('../utils/dateTime');
const { getRecurrenceLabel } = require('../services/recurrenceService');
const {
  sendWhatsAppMessage,
} = require('../services/twilioService');

// POST /api/whatsapp/webhook  — Twilio sends incoming messages here
exports.handleIncoming = async (req, res, next) => {
  try {
    const { Body, From } = req.body;

    // Extract phone number (Twilio sends "whatsapp:+919876543210")
    const phone = From.replace('whatsapp:', '');

    // Find the user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      await sendWhatsAppMessage(
        phone,
        '❌ Your number is not registered on AutoTask. Please sign up at the website first and add your phone number.'
      );
      return res.status(200).send('<Response></Response>');
    }

    const message = Body.trim();

    // Handle "done" replies to mark tasks completed
    if (message.toLowerCase() === 'done') {
      const { date: today } = getDateTimeParts(user.timezone);
      const latestPending = await Task.findOne({
        userId: user._id,
        status: 'pending',
        $or: [{ reminderSent: true }, { lastReminderDate: today }],
      }).sort({ updatedAt: -1 });

      if (latestPending) {
        latestPending.status = 'completed';
        await latestPending.save();
        await sendWhatsAppMessage(
          phone,
          `✅ Task marked as completed!\n\n📌 ${latestPending.task}`
        );
      } else {
        await sendWhatsAppMessage(phone, '🤔 No pending task found to complete.');
      }
      return res.status(200).send('<Response></Response>');
    }

    // Use AI to parse the message into tasks
    const { date: today } = getDateTimeParts(user.timezone);
    const parsed = await parseTaskMessage(message, user.timezone);

    if (!parsed.tasks || parsed.tasks.length === 0) {
      await sendWhatsAppMessage(
        phone,
        "🤔 I couldn't understand that. Try something like:\n\n_Remind me to study OS at 8 PM_"
      );
      return res.status(200).send('<Response></Response>');
    }

    const createdTasks = [];

    for (const t of parsed.tasks) {
      const effectiveDate = t.date || t.recurrence?.startDate || today;
      const newTask = await Task.create({
        userId: user._id,
        task: t.task,
        date: effectiveDate,
        time: t.time,
        repeat: t.repeat || 'none',
        repeatDay: t.repeatDay || null,
        recurrence: t.recurrence,
        exceptions: t.exceptions,
        priority: t.priority || 'medium',
        source: 'whatsapp',
      });
      createdTasks.push(newTask);
    }

    // Build confirmation message
    let reply = `✅ *${createdTasks.length > 1 ? 'Tasks' : 'Task'} created!*\n\n`;
    createdTasks.forEach((t, i) => {
      const priorityEmoji =
        t.priority === 'high' ? '⚠️' : t.priority === 'medium' ? '🔔' : '📋';
      reply += `${i + 1}. ${priorityEmoji} *${t.task}*\n`;
      reply += `   📅 ${t.date} ⏰ ${t.time}\n`;
      const recurrenceLabel = getRecurrenceLabel(t);
      if (recurrenceLabel) reply += `   🔁 ${recurrenceLabel}\n`;
      reply += '\n';
    });
    reply += `_You'll be reminded automatically!_`;

    await sendWhatsAppMessage(phone, reply);

    res.status(200).send('<Response></Response>');
  } catch (error) {
    console.error('WhatsApp webhook error:', error.message);
    res.status(200).send('<Response></Response>');
  }
};
