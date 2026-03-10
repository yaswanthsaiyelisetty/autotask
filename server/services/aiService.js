const OpenAI = require('openai');

// NVIDIA AI (OpenAI-compatible endpoint)
const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const AI_MODEL = 'qwen/qwen2.5-coder-32b-instruct';

/**
 * Parse a natural language message into structured task data.
 * Returns: { tasks: [{ task, date, time, priority }] }
 */
async function parseTaskMessage(message) {
  const today = new Date().toISOString().split('T')[0];

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.6,
    top_p: 0.95,
    max_tokens: 4096,
    stream: false,
    messages: [
      {
        role: 'system',
        content: `You are a task extraction assistant. Today's date is ${today}.
Extract tasks from the user's message and return valid JSON only. No explanation, no thinking, just JSON.

Rules:
- Return an array of task objects.
- Each object must have: task (string), date (YYYY-MM-DD or null), time (HH:mm 24-hour), priority ("low"|"medium"|"high").
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
        content: message,
      },
    ],
  });

  let content = completion.choices[0].message.content.trim();
  // Strip thinking tags if present (Qwen model may include <think>...</think>)
  content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  // Strip markdown code fences if present
  const jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
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
