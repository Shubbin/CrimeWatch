;
// adminCreate.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {User }from '../models/user.model.js'; // Make sure to include the .js extension for ESM

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ||'mongodb://localhost:27017/crimeWatchDatabase';

const adminEmail = 'makindeolasubomi2@gmail.com';
const adminPassword = 'Welcome123.';
const adminRole = 'admin'; // Or whatever you use to mark admin users

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists:', adminEmail);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
  name: 'Admin',            // required field from your schema
  email: adminEmail,
  password: hashedPassword,
  role: adminRole,
  isVerified: true,
});

    await adminUser.save();
    console.log('Admin user created successfully:', adminEmail);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
