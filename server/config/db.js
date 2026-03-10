const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Works with both MongoDB Atlas and Azure Cosmos DB (MongoDB API)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Azure Cosmos DB compatibility options
      retryWrites: false, // Cosmos DB does not support retryable writes
      ...(process.env.AZURE_COSMOS === 'true' && {
        tlsAllowInvalidCertificates: false,
        directConnection: false,
      }),
    });
    console.log(`✅ Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
