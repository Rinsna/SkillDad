const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ role: 'university' }).select('email name').lean();
    for (const u of users) {
        console.log(`UNI: ${u.email} (${u.name})`);
    }
    process.exit(0);
}

check();
