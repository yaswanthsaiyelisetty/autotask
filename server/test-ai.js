// Test NVIDIA AI integration
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { parseTaskMessage } = require('./services/aiService');

async function test() {
  console.log('Testing NVIDIA Qwen AI...\n');

  const message = 'Remind me to submit project on March 15 at 10 AM and study OS tomorrow at 8 PM';
  console.log('Input:', message);
  console.log('Parsing...\n');

  const result = await parseTaskMessage(message);
  console.log('Result:', JSON.stringify(result, null, 2));
}

test().catch((e) => console.error('Error:', e.message));
