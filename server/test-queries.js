// Test Cosmos DB query compatibility
require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGO_URI, { retryWrites: false });
  const Task = require('./models/Task');
  const today = new Date().toISOString().split('T')[0];
  console.log('Today:', today);

  // Test 1: countDocuments
  try {
    const count = await Task.find({ status: 'pending' }).countDocuments();
    console.log('✅ countDocuments works:', count);
  } catch (e) {
    console.log('❌ countDocuments failed:', e.message);
  }

  // Test 2: $or query
  try {
    const tasks = await Task.find({
      status: 'pending',
      $or: [
        { date: today, repeat: 'none' },
        { repeat: 'daily' },
      ],
    });
    console.log('✅ $or query works, results:', tasks.length);
  } catch (e) {
    console.log('❌ $or query failed:', e.message);
  }

  // Test 3: sort
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    console.log('✅ sort works, results:', tasks.length);
  } catch (e) {
    console.log('❌ sort failed:', e.message);
  }

  await mongoose.disconnect();
}

test().catch((e) => console.error('Fatal:', e.message));
