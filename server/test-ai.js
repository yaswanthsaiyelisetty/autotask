// Test AI integration
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { parseTaskMessage } = require('./services/aiService');

async function test() {
  console.log(`Testing ${process.env.AI_PROVIDER || 'gemini'} AI...\n`);

  const messages = [
    'Remind me to submit project on March 15 at 10 AM and study OS tomorrow at 8 PM',
    'Remind me every weekday at 9 AM to check sales dashboard',
    'Remind me to review budget on the last Friday of every month at 6 PM',
    'Remind me every 3 days at 7 AM to back up my files, skip weekends',
  ];

  for (const message of messages) {
    console.log('Input:', message);
    console.log('Parsing...\n');
    const result = await parseTaskMessage(message);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('\n----------------------------------------\n');
  }
}

test().catch((e) => console.error('Error:', e.message));
