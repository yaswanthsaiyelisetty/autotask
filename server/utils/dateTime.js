const DEFAULT_TIMEZONE = 'Asia/Kolkata';

function resolveTimeZone(timeZone = DEFAULT_TIMEZONE) {
  try {
    Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

function getDateTimeParts(timeZone = DEFAULT_TIMEZONE, referenceDate = new Date()) {
  const safeTimeZone = resolveTimeZone(timeZone);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: safeTimeZone,
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(referenceDate).reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  return {
    timeZone: safeTimeZone,
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    dayName: parts.weekday,
    dayOfMonth: String(Number(parts.day)),
  };
}

module.exports = {
  DEFAULT_TIMEZONE,
  getDateTimeParts,
  resolveTimeZone,
};