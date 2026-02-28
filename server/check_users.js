const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

async function checkUsers() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI ? 'URI found' : 'URI MISSING');
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}).select('email role name');
        console.log('--- USER LIST ---');
        users.forEach(u => console.log(`${u.role}: ${u.email} (${u.name})`));
        console.log('-----------------');

        const admin = await User.findOne({ email: 'admin@skilldad.com' });
        if (admin) {
            console.log('Admin user exists.');
        } else {
            console.log('Admin user DOES NOT exist.');
        }

        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkUsers();
