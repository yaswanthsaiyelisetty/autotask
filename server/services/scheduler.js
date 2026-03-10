const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const {
  sendWhatsAppMessage,
  buildReminderMessage,
  buildDailyScheduleMessage,
} = require('./twilioService');
const { generateDailySchedule } = require('./aiService');

/**
 * Get today's date string and current time (HH:mm).
 */
function getNow() {
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }); // Monday, Tuesday...
  const dayOfMonth = String(now.getDate()); // 1-31
  return { date, time, dayName, dayOfMonth };
}

/**
 * Find all tasks that need a reminder right now.
 */
async function findDueTasks() {
  const { date, time, dayName, dayOfMonth } = getNow();

  // One-time tasks for today
  const oneTimeTasks = await Task.find({
    status: 'pending',
    reminderSent: false,
    repeat: 'none',
    date,
    time,
  });

  // Daily recurring tasks
  const dailyTasks = await Task.find({
    status: 'pending',
    repeat: 'daily',
    time,
    $or: [{ lastReminderDate: { $ne: date } }, { lastReminderDate: null }],
  });

  // Weekly recurring tasks
  const weeklyTasks = await Task.find({
    status: 'pending',
    repeat: 'weekly',
    repeatDay: dayName,
    time,
    $or: [{ lastReminderDate: { $ne: date } }, { lastReminderDate: null }],
  });

  // Monthly recurring tasks
  const monthlyTasks = await Task.find({
    status: 'pending',
    repeat: 'monthly',
    repeatDay: dayOfMonth,
    time,
    $or: [{ lastReminderDate: { $ne: date } }, { lastReminderDate: null }],
  });

  return [...oneTimeTasks, ...dailyTasks, ...weeklyTasks, ...monthlyTasks];
}

/**
 * Send reminders for all due tasks.
 */
async function processReminders() {
  try {
    const dueTasks = await findDueTasks();
    const { date } = getNow();

    for (const task of dueTasks) {
      const user = await User.findById(task.userId);
      if (!user || !user.phone) continue;

      const message = buildReminderMessage(task);

      try {
        await sendWhatsAppMessage(user.phone, message);

        if (task.repeat === 'none') {
          task.reminderSent = true;
        }
        task.lastReminderDate = date;
        await task.save();

        console.log(`✅ Reminder sent for task: ${task.task}`);
      } catch (err) {
        console.error(`❌ Failed to send reminder for task ${task._id}: ${err.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Scheduler error:', error.message);
  }
}

/**
 * Send daily schedule to all users at 7 AM.
 */
async function sendDailySchedules() {
  try {
    const { date } = getNow();

    const users = await User.find({ phone: { $ne: '' } });

    for (const user of users) {
      const todayTasks = await Task.find({
        userId: user._id,
        status: 'pending',
        $or: [{ date }, { repeat: { $ne: 'none' } }],
      }).sort({ time: 1 });

      if (todayTasks.length === 0) continue;

      let aiSummary = '';
      try {
        aiSummary = await generateDailySchedule(todayTasks);
      } catch (err) {
        console.error('AI summary failed:', err.message);
      }

      const message = buildDailyScheduleMessage(todayTasks, aiSummary);

      try {
        await sendWhatsAppMessage(user.phone, message);
        console.log(`📅 Daily schedule sent to ${user.name}`);
      } catch (err) {
        console.error(`❌ Daily schedule failed for ${user.name}: ${err.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Daily schedule error:', error.message);
  }
}

/**
 * Start cron jobs.
 */
function startScheduler() {
  // Check for due reminders every minute
  cron.schedule('* * * * *', () => {
    console.log('⏰ Checking for due reminders...');
    processReminders();
  });

  // Send daily schedule at 7:00 AM
  cron.schedule('0 7 * * *', () => {
    console.log('📅 Sending daily schedules...');
    sendDailySchedules();
  });

  console.log('✅ Scheduler started');
}

module.exports = { startScheduler };
