const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ role: { $ne: 'student' } }).select('email role name');
    users.forEach(u => console.log(`${u.role}: ${u.email}`));
    process.exit(0);
}

check();
