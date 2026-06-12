require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gradmemory.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists:');
      console.log(`  Email: ${adminEmail}`);
      console.log('  Password: [redacted]');
      await mongoose.disconnect();
      return;
    }

    await User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('Default admin created successfully!');
    console.log(`  Email: ${adminEmail}`);
    console.log('  Password: [redacted]');
    console.log('  Role: admin');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
