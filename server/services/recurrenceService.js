const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKDAY_SET = new Set(WEEKDAY_NAMES);
const ADVANCED_RECURRENCE_TYPES = new Set([
  'none',
  'weekday',
  'interval_days',
  'monthly_nth_weekday',
]);

const DEFAULT_RECURRENCE = Object.freeze({
  type: 'none',
  interval: null,
  weekOfMonth: null,
  weekday: null,
  startDate: null,
  untilDate: null,
});

const DEFAULT_EXCEPTIONS = Object.freeze({
  pauseUntil: null,
  skipWeekends: false,
  skipHolidays: false,
  holidayDates: [],
});

function isIsoDate(value) {
  if (typeof value !== 'string' || !ISO_DATE_REGEX.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function normalizeIsoDate(value) {
  return isIsoDate(value) ? value : null;
}

function normalizeWeekday(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1).toLowerCase()}`;
  return WEEKDAY_SET.has(normalized) ? normalized : null;
}

function normalizeHolidayDates(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  const uniqueDates = new Set();
  for (const value of values) {
    const normalizedDate = normalizeIsoDate(value);
    if (normalizedDate) {
      uniqueDates.add(normalizedDate);
    }
  }

  return Array.from(uniqueDates).sort();
}

function normalizeRecurrenceInput(input, fallbackDate) {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_RECURRENCE };
  }

  const type = ADVANCED_RECURRENCE_TYPES.has(input.type) ? input.type : 'none';

  let interval = null;
  let weekOfMonth = null;
  let weekday = null;

  if (type === 'interval_days') {
    const parsedInterval = Number.parseInt(input.interval, 10);
    interval = Number.isInteger(parsedInterval) && parsedInterval > 0 ? parsedInterval : 1;
  }

  if (type === 'monthly_nth_weekday') {
    const parsedWeek = Number.parseInt(input.weekOfMonth, 10);
    weekOfMonth = parsedWeek === -1 || (parsedWeek >= 1 && parsedWeek <= 5) ? parsedWeek : null;
    weekday = normalizeWeekday(input.weekday);

    if (weekOfMonth === null || !weekday) {
      return { ...DEFAULT_RECURRENCE };
    }
  }

  const startDate =
    type === 'interval_days'
      ? normalizeIsoDate(input.startDate) || normalizeIsoDate(fallbackDate)
      : normalizeIsoDate(input.startDate);

  return {
    type,
    interval,
    weekOfMonth,
    weekday,
    startDate: startDate || null,
    untilDate: normalizeIsoDate(input.untilDate),
  };
}

function normalizeExceptionsInput(input) {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_EXCEPTIONS };
  }

  return {
    pauseUntil: normalizeIsoDate(input.pauseUntil),
    skipWeekends: Boolean(input.skipWeekends),
    skipHolidays: Boolean(input.skipHolidays),
    holidayDates: normalizeHolidayDates(input.holidayDates),
  };
}

function parseIsoDate(value) {
  const normalized = normalizeIsoDate(value);
  if (!normalized) return null;

  const [year, month, day] = normalized.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function getDaysBetween(startDate, endDate) {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);

  if (!start || !end) {
    return null;
  }

  return Math.floor((end.getTime() - start.getTime()) / 86400000);
}

function isWeekend(dayName) {
  return dayName === 'Saturday' || dayName === 'Sunday';
}

function matchesMonthlyNthWeekday(date, weekOfMonth, weekday) {
  const parsedDate = parseIsoDate(date);
  if (!parsedDate) return false;

  const currentWeekday = parsedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: 'UTC',
  });

  if (currentWeekday !== weekday) {
    return false;
  }

  const dayOfMonth = parsedDate.getUTCDate();
  const daysInMonth = new Date(
    Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth() + 1, 0)
  ).getUTCDate();

  if (weekOfMonth === -1) {
    return dayOfMonth + 7 > daysInMonth;
  }

  return Math.ceil(dayOfMonth / 7) === weekOfMonth;
}

function hasDatePassed(dateA, dateB) {
  return typeof dateA === 'string' && typeof dateB === 'string' && dateA > dateB;
}

function hasDateReachedOrPassed(currentDate, targetDate) {
  return typeof currentDate === 'string' && typeof targetDate === 'string' && currentDate >= targetDate;
}

function passesExceptions(task, context) {
  const exceptions = normalizeExceptionsInput(task.exceptions);

  if (exceptions.pauseUntil && !hasDateReachedOrPassed(context.date, exceptions.pauseUntil)) {
    return false;
  }

  if (exceptions.skipWeekends && isWeekend(context.dayName)) {
    return false;
  }

  if (exceptions.skipHolidays && exceptions.holidayDates.includes(context.date)) {
    return false;
  }

  return true;
}

function hasAdvancedRecurrence(task) {
  return normalizeRecurrenceInput(task?.recurrence, task?.date).type !== 'none';
}

function matchesAdvancedRecurrence(task, context, respectLastReminder) {
  const recurrence = normalizeRecurrenceInput(task.recurrence, task.date);

  if (recurrence.type === 'none') {
    return false;
  }

  if (respectLastReminder && task.lastReminderDate === context.date) {
    return false;
  }

  if (recurrence.untilDate && hasDatePassed(context.date, recurrence.untilDate)) {
    return false;
  }

  if (recurrence.startDate && hasDatePassed(recurrence.startDate, context.date)) {
    return false;
  }

  if (recurrence.type === 'weekday') {
    return !isWeekend(context.dayName);
  }

  if (recurrence.type === 'interval_days') {
    const startDate = recurrence.startDate || task.date;
    const dayDiff = getDaysBetween(startDate, context.date);
    return dayDiff !== null && dayDiff >= 0 && dayDiff % recurrence.interval === 0;
  }

  if (recurrence.type === 'monthly_nth_weekday') {
    return matchesMonthlyNthWeekday(context.date, recurrence.weekOfMonth, recurrence.weekday);
  }

  return false;
}

function matchesLegacyRecurrence(task, context, respectLastReminder) {
  if (task.repeat === 'none') {
    return false;
  }

  if (respectLastReminder && task.lastReminderDate === context.date) {
    return false;
  }

  if (task.repeat === 'daily') {
    return true;
  }

  if (task.repeat === 'weekly') {
    return task.repeatDay === context.dayName;
  }

  if (task.repeat === 'monthly') {
    return task.repeatDay === context.dayOfMonth;
  }

  return false;
}

function isRecurringTask(task) {
  return hasAdvancedRecurrence(task) || (task.repeat && task.repeat !== 'none');
}

function isTaskPlannedForDate(task, context) {
  if (!task || task.status !== 'pending') {
    return false;
  }

  if (!passesExceptions(task, context)) {
    return false;
  }

  if (hasAdvancedRecurrence(task)) {
    return matchesAdvancedRecurrence(task, context, false);
  }

  if (matchesLegacyRecurrence(task, context, false)) {
    return true;
  }

  return task.date === context.date;
}

function isTaskDueNow(task, context) {
  if (!task || task.status !== 'pending' || task.time !== context.time) {
    return false;
  }

  if (!passesExceptions(task, context)) {
    return false;
  }

  if (hasAdvancedRecurrence(task)) {
    return matchesAdvancedRecurrence(task, context, true);
  }

  if (matchesLegacyRecurrence(task, context, true)) {
    return true;
  }

  return task.repeat === 'none' && task.date === context.date && !task.reminderSent;
}

function getWeekOfMonthLabel(weekOfMonth) {
  if (weekOfMonth === 1) return 'First';
  if (weekOfMonth === 2) return 'Second';
  if (weekOfMonth === 3) return 'Third';
  if (weekOfMonth === 4) return 'Fourth';
  if (weekOfMonth === 5) return 'Fifth';
  if (weekOfMonth === -1) return 'Last';
  return null;
}

function getRecurrenceLabel(task) {
  const recurrence = normalizeRecurrenceInput(task.recurrence, task.date);
  const exceptions = normalizeExceptionsInput(task.exceptions);

  let baseLabel = null;

  if (recurrence.type === 'weekday') {
    baseLabel = 'Every weekday';
  } else if (recurrence.type === 'interval_days') {
    baseLabel = `Every ${recurrence.interval} day${recurrence.interval === 1 ? '' : 's'}`;
  } else if (recurrence.type === 'monthly_nth_weekday') {
    const weekLabel = getWeekOfMonthLabel(recurrence.weekOfMonth);
    if (weekLabel && recurrence.weekday) {
      baseLabel = `${weekLabel} ${recurrence.weekday} of every month`;
    }
  } else if (task.repeat === 'daily') {
    baseLabel = 'Daily';
  } else if (task.repeat === 'weekly' && task.repeatDay) {
    baseLabel = `Weekly on ${task.repeatDay}`;
  } else if (task.repeat === 'monthly' && task.repeatDay) {
    baseLabel = `Monthly on day ${task.repeatDay}`;
  }

  if (!baseLabel) {
    return null;
  }

  const tags = [];
  if (exceptions.skipWeekends) tags.push('skip weekends');
  if (exceptions.skipHolidays) tags.push('skip holidays');
  if (exceptions.pauseUntil) tags.push(`paused until ${exceptions.pauseUntil}`);

  if (tags.length === 0) {
    return baseLabel;
  }

  return `${baseLabel} (${tags.join(', ')})`;
}

module.exports = {
  WEEKDAY_NAMES,
  isIsoDate,
  normalizeRecurrenceInput,
  normalizeExceptionsInput,
  isRecurringTask,
  isTaskPlannedForDate,
  isTaskDueNow,
  getRecurrenceLabel,
};
