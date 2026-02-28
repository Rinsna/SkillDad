const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

async function reset() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ email: 'admin@skilldad.com' });
        if (admin) {
            console.log('Found admin, resetting password...');
            admin.password = '123456';
            await admin.save();
            console.log('Password reset to 123456');
        } else {
            console.log('Admin not found!');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

reset();
