const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const {
  sendWhatsAppMessage,
  buildReminderMessage,
  buildDailyScheduleMessage,
} = require('./twilioService');
const { generateDailySchedule } = require('./aiService');
const { getDateTimeParts } = require('../utils/dateTime');

/**
 * Build the current date/time context in a user's timezone.
 */
function getNow(timeZone) {
  return getDateTimeParts(timeZone);
}

/**
 * Find all tasks that need a reminder right now.
 */
async function findDueTasks() {
  const users = await User.find({ phone: { $ne: '' } }, '_id timezone');
  const dueTasks = [];

  for (const user of users) {
    const { date, time, dayName, dayOfMonth } = getNow(user.timezone);

    const userTasks = await Task.find({
      userId: user._id,
      status: 'pending',
      time,
      $or: [
        {
          repeat: 'none',
          reminderSent: false,
          date,
        },
        {
          repeat: 'daily',
          $or: [{ lastReminderDate: { $ne: date } }, { lastReminderDate: null }],
        },
        {
          repeat: 'weekly',
          repeatDay: dayName,
          $or: [{ lastReminderDate: { $ne: date } }, { lastReminderDate: null }],
        },
        {
          repeat: 'monthly',
          repeatDay: dayOfMonth,
          $or: [{ lastReminderDate: { $ne: date } }, { lastReminderDate: null }],
        },
      ],
    });

    dueTasks.push(...userTasks);
  }

  return dueTasks;
}

/**
 * Send reminders for all due tasks.
 */
async function processReminders() {
  try {
    const dueTasks = await findDueTasks();

    for (const task of dueTasks) {
      const user = await User.findById(task.userId);
      if (!user || !user.phone) continue;

      const { date } = getNow(user.timezone);

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
