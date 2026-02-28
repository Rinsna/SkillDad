const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ email: /@/ }).select('email role').lean();
    for (const u of users) {
        console.log(`STAFF: ${u.role} | ${u.email}`);
    }
    process.exit(0);
}

check();
