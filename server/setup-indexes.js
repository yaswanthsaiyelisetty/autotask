// Create required indexes for Azure Cosmos DB
require('dotenv').config();
const mongoose = require('mongoose');

async function createIndexes() {
  console.log('Creating Cosmos DB indexes...');
  await mongoose.connect(process.env.MONGO_URI, { retryWrites: false });

  const db = mongoose.connection.db;

  // Tasks collection indexes
  const tasks = db.collection('tasks');
  try {
    await tasks.createIndex({ userId: 1, createdAt: -1 });
    console.log('✅ Index: userId + createdAt');
  } catch (e) {
    console.log('⚠️  userId+createdAt:', e.message);
  }

  try {
    await tasks.createIndex({ userId: 1, time: 1 });
    console.log('✅ Index: userId + time');
  } catch (e) {
    console.log('⚠️  userId+time:', e.message);
  }

  try {
    await tasks.createIndex({ status: 1, time: 1, date: 1 });
    console.log('✅ Index: status + time + date');
  } catch (e) {
    console.log('⚠️  status+time+date:', e.message);
  }

  try {
    await tasks.createIndex({ userId: 1, status: 1 });
    console.log('✅ Index: userId + status');
  } catch (e) {
    console.log('⚠️  userId+status:', e.message);
  }

  try {
    await tasks.createIndex({ userId: 1, date: 1 });
    console.log('✅ Index: userId + date');
  } catch (e) {
    console.log('⚠️  userId+date:', e.message);
  }

  // Users collection indexes
  const users = db.collection('users');
  try {
    await users.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Index: email (unique)');
  } catch (e) {
    console.log('⚠️  email:', e.message);
  }

  try {
    await users.createIndex({ phone: 1 });
    console.log('✅ Index: phone');
  } catch (e) {
    console.log('⚠️  phone:', e.message);
  }

  console.log('\nDone! Verifying sort query...');

  const Task = require('./models/Task');
  try {
    const tasks2 = await Task.find({}).sort({ createdAt: -1 });
    console.log('✅ Sort query works now! Tasks:', tasks2.length);
  } catch (e) {
    console.log('❌ Sort still fails:', e.message);
  }

  await mongoose.disconnect();
}

createIndexes().catch((e) => console.error('Fatal:', e.message));
