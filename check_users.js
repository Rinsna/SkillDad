const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./server/models/userModel');

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const users = await User.find({});
        console.log('Users in DB:', users.map(u => ({ email: u.email, role: u.role, hasPassword: !!u.password })));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
