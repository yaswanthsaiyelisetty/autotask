// Quick database connection test
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
const isAzure = process.env.AZURE_COSMOS === 'true';

console.log('');
console.log('═══════════════════════════════════');
console.log('  AutoTask – Database Connection Test');
console.log('═══════════════════════════════════');
console.log('');
console.log(`Database: ${isAzure ? 'Azure Cosmos DB' : 'MongoDB Atlas'}`);
console.log(`URI host: ${MONGO_URI?.split('@')[1]?.split('/')[0] || 'NOT SET'}`);
console.log('');
console.log('Connecting...');

async function test() {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      retryWrites: false,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ Connected successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log('');

    // Try creating a test document
    const testCollection = conn.connection.db.collection('_connection_test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    await testCollection.deleteOne({ test: true });
    console.log('✅ Read/Write test passed!');
    console.log('');
    console.log('Your database is ready.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(`❌ Connection FAILED`);
    console.log(`   Error: ${error.message}`);
    console.log('');

    if (error.message.includes('authentication') || error.message.includes('auth')) {
      console.log('💡 Fix: Check your password in MONGO_URI in server/.env');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('💡 Fix: The database hostname is wrong or does not exist.');
      console.log('   Have you created the Cosmos DB account in Azure Portal?');
    } else if (error.message.includes('timed out') || error.message.includes('ETIMEDOUT')) {
      console.log('💡 Fix: Database exists but is not reachable.');
      console.log('   Check firewall rules in Azure Portal → Cosmos DB → Networking');
    }

    process.exit(1);
  }
}

test();
