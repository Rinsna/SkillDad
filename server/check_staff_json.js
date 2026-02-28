const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ role: { $ne: 'student' } }).select('email role name').lean();
    console.log('USERS_LIST:', users.length);
    console.log(JSON.stringify(users));
    process.exit(0);
}

check();
