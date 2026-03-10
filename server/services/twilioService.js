const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const WHATSAPP_FROM = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

/**
 * Send a WhatsApp message to a phone number.
 * @param {string} to - Phone number with country code (e.g. "+919876543210")
 * @param {string} body - Message body
 */
/**
 * Normalize phone number to include country code.
 * If it's 10 digits (Indian number), prepend +91.
 */
function normalizePhone(phone) {
  let p = phone.replace(/[\s\-()]/g, '');
  if (p.startsWith('+')) return p;
  if (p.length === 10) return `+91${p}`;   // Indian number
  if (p.length === 12 && p.startsWith('91')) return `+${p}`;
  return `+${p}`;
}

async function sendWhatsAppMessage(to, body) {
  const normalizedTo = normalizePhone(to);
  try {
    const message = await client.messages.create({
      from: WHATSAPP_FROM,
      to: `whatsapp:${normalizedTo}`,
      body,
    });
    console.log(`📱 WhatsApp sent to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`❌ WhatsApp send error: ${error.message}`);
    throw error;
  }
}

/**
 * Build a formatted reminder message.
 */
function buildReminderMessage(task) {
  const priorityEmoji =
    task.priority === 'high' ? '⚠️' : task.priority === 'medium' ? '🔔' : '📋';

  let msg = `${priorityEmoji} *AutoTask Reminder*\n\n`;
  msg += `📌 *Task:* ${task.task}\n`;
  if (task.date) msg += `📅 *Date:* ${task.date}\n`;
  msg += `⏰ *Time:* ${task.time}\n`;
  msg += `🔷 *Priority:* ${task.priority.toUpperCase()}\n`;
  msg += `\n_Reply "done" to mark as completed._`;

  return msg;
}

/**
 * Build a daily schedule message.
 */
function buildDailyScheduleMessage(tasks, aiSummary) {
  let msg = `🌞 *Good Morning! Here's your AutoTask schedule:*\n\n`;

  if (aiSummary) {
    msg += `${aiSummary}\n\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━\n`;
  tasks.forEach((t, i) => {
    const priorityEmoji =
      t.priority === 'high' ? '⚠️' : t.priority === 'medium' ? '🔔' : '📋';
    msg += `${i + 1}. ${priorityEmoji} ${t.task} — ${t.time}\n`;
  });
  msg += `━━━━━━━━━━━━━━━━━━\n`;
  msg += `\n_Have a productive day!_ 💪`;

  return msg;
}

module.exports = {
  sendWhatsAppMessage,
  buildReminderMessage,
  buildDailyScheduleMessage,
};
