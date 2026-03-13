const OpenAI = require('openai');
const { DEFAULT_TIMEZONE, getDateTimeParts, resolveTimeZone } = require('../utils/dateTime');

const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
const AI_MODEL =
  process.env.AI_MODEL ||
  (AI_PROVIDER === 'gemini' ? 'gemini-2.5-flash' : 'qwen/qwen2.5-coder-32b-instruct');

const clientConfig =
  AI_PROVIDER === 'gemini'
    ? {
        apiKey: process.env.GEMINI_API_KEY,
        baseURL:
          process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai/',
      }
    : {
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
      };

// AI provider client (Gemini via OpenAI-compatible endpoint by default)
const client = new OpenAI({
  ...clientConfig,
});

const NON_TASK_PATTERNS = [
  /^(hi|hii|hiii|hello|hlo|hey)\b[\s!.?]*$/i,
  /^(ok|okay|kk|thanks|thank you|thx|yes|no|yep|nope)\b[\s!.?]*$/i,
  /^(today|todays|to\s*day)\s+(date|day)\s+(is|=)\s+\d{1,2}\b/i,
  /^(date|day)\s+(is|=)\s+\d{1,2}\b/i,
  /^(it'?s|it is)\s+\d{1,2}\s+(today|now)\b/i,
];

const IGNORED_TASK_TOKENS = new Set([
  'a',
  'about',
  'am',
  'an',
  'at',
  'date',
  'day',
  'daily',
  'every',
  'for',
  'in',
  'is',
  'me',
  'month',
  'morning',
  'mrng',
  'my',
  'night',
  'of',
  'on',
  'pm',
  'please',
  'remind',
  'reminder',
  'schedule',
  'task',
  'the',
  'this',
  'to',
  'today',
  'todays',
  'tomorrow',
  'tomrw',
  'tmrw',
  'week',
  'you',
]);

function isClearlyNonTaskMessage(message) {
  return NON_TASK_PATTERNS.some((pattern) => pattern.test(message));
}

function hasMeaningfulTaskContent(taskName) {
  const tokens = taskName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  return tokens.some(
    (token) => !IGNORED_TASK_TOKENS.has(token) && !/^\d+$/.test(token) && token.length > 1
  );
}

function normalizeParsedTask(task, fallbackDate) {
  if (!task || typeof task.task !== 'string') {
    return null;
  }

  const taskName = task.task.replace(/\s+/g, ' ').trim();
  if (!taskName || !hasMeaningfulTaskContent(taskName)) {
    return null;
  }

  const normalizedTime =
    typeof task.time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(task.time)
      ? task.time
      : '09:00';

  const normalizedDate =
    typeof task.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(task.date)
      ? task.date
      : fallbackDate;

  const normalizedPriority = ['low', 'medium', 'high'].includes(task.priority)
    ? task.priority
    : 'medium';

  const normalizedRepeat = ['none', 'daily', 'weekly', 'monthly'].includes(task.repeat)
    ? task.repeat
    : 'none';

  return {
    task: taskName,
    date: normalizedDate,
    time: normalizedTime,
    priority: normalizedPriority,
    repeat: normalizedRepeat,
    repeatDay: normalizedRepeat === 'none' ? null : task.repeatDay || null,
  };
}

/**
 * Parse a natural language message into structured task data.
 * Returns: { tasks: [{ task, date, time, priority }] }
 */
async function parseTaskMessage(message, timeZone = DEFAULT_TIMEZONE) {
  const trimmedMessage = message.trim();
  if (!trimmedMessage || isClearlyNonTaskMessage(trimmedMessage)) {
    return { tasks: [] };
  }

  const safeTimeZone = resolveTimeZone(timeZone);
  const { date: today, time: currentTime, dayName } = getDateTimeParts(safeTimeZone);

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.6,
    top_p: 0.95,
    max_tokens: 4096,
    stream: false,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a task extraction assistant. The user's timezone is ${safeTimeZone}. Today's local date is ${today}, the local time is ${currentTime}, and the local weekday is ${dayName}.
Extract tasks from the user's message and return valid JSON only. No explanation, no thinking, just JSON.

Rules:
- Return an array of task objects.
- Each object must have: task (string), date (YYYY-MM-DD or null), time (HH:mm 24-hour), priority ("low"|"medium"|"high").
      - If the message is not clearly asking to create or update a task/reminder, return { "tasks": [] }.
      - Greetings, acknowledgements, date corrections, and statements about what today's date is are not tasks.
      - The task field must contain only the actionable activity, not date/time chatter or correction text.
- If the user says "tomorrow", calculate the actual date.
- If the user says "every day", set repeat to "daily". For "every Monday" set repeat to "weekly" and repeatDay to "Monday". For "every month on 1st" set repeat to "monthly" and repeatDay to "1".
- If no repeat is mentioned, set repeat to "none" and repeatDay to null.
- Detect urgency words (submit, deadline, urgent, important, exam) → high priority.
- If no time is specified, default to "09:00".
- If no date and not recurring, default date to today (${today}).

Return ONLY this JSON format, nothing else:
{ "tasks": [ { "task": "...", "date": "...", "time": "...", "priority": "...", "repeat": "...", "repeatDay": ... } ] }`,
      },
      {
        role: 'user',
        content: trimmedMessage,
      },
    ],
  });

  let content = completion.choices[0].message.content.trim();
  // Strip thinking tags if present (Qwen model may include <think>...</think>)
  content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  // Strip markdown code fences if present
  const jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(jsonStr);

  return {
    tasks: Array.isArray(parsed.tasks)
      ? parsed.tasks
          .map((task) => normalizeParsedTask(task, today))
          .filter(Boolean)
      : [],
  };
}

/**
 * Generate a daily schedule summary for a list of tasks.
 */
async function generateDailySchedule(tasks) {
  const taskList = tasks
    .map((t) => `- ${t.task} at ${t.time} (${t.priority} priority)`)
    .join('\n');

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 1024,
    stream: false,
    messages: [
      {
        role: 'system',
        content:
          'You are a friendly productivity assistant. Create a brief, motivating daily schedule summary from the tasks below. Use emojis. Keep it under 500 characters. No thinking, just the summary.',
      },
      {
        role: 'user',
        content: `Here are my tasks for today:\n${taskList}`,
      },
    ],
  });

  let content = completion.choices[0].message.content.trim();
  // Strip thinking tags if present
  content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  return content;
}

module.exports = { parseTaskMessage, generateDailySchedule };
