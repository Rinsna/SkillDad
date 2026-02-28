const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ role: { $ne: 'student' } }).select('email role name').lean();
    console.log('START_LIST');
    for (const u of users) {
        console.log(`STAFF: ${u.role} | ${u.email}`);
    }
    console.log('END_LIST');
    process.exit(0);
}

check();
