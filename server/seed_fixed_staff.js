const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

async function fix() {
    await mongoose.connect(process.env.MONGO_URI);

    // Update/Create Admin
    let admin = await User.findOne({ email: 'admin@skilldad.com' });
    if (!admin) {
        admin = new User({
            name: 'SkillDad Admin',
            email: 'admin@skilldad.com',
            password: '123456',
            role: 'admin',
            isVerified: true
        });
        await admin.save();
        console.log('Created Admin');
    } else {
        admin.password = '123456';
        await admin.save();
        console.log('Updated Admin');
    }

    // Update/Create University
    let university = await User.findOne({ email: 'university@skilldad.com' });
    if (!university) {
        university = new User({
            name: 'SkillDad University',
            email: 'university@skilldad.com',
            password: '123456',
            role: 'university',
            isVerified: true,
            profile: {
                universityName: 'SkillDad Global'
            }
        });
        await university.save();
        console.log('Created University@skilldad.com');
    } else {
        university.password = '123456';
        await university.save();
        console.log('Updated University');
    }

    process.exit(0);
}

fix();
