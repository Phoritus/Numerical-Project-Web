require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const dbName = mongoose.connection.name;
    await mongoose.connection.dropDatabase();
    console.log(`🗑️ Dropped database: ${dbName}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error dropping database:', err.message || err);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
})();
