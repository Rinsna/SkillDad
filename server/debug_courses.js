const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/courseModel');
const User = require('./models/userModel');

async function debug() {
    await mongoose.connect(process.env.MONGO_URI);
    const courses = await Course.find({}).populate('instructor');
    console.log('--- All Courses ---');
    for (const c of courses) {
        console.log(`Title: ${c.title}`);
        console.log(`Instructor: ${c.instructor ? c.instructor.email : 'None'} (ID: ${c.instructor ? c.instructor._id : 'N/A'})`);
        console.log(`Instructor Role: ${c.instructor ? c.instructor.role : 'N/A'}`);
        console.log('---');
    }
    const sara = await User.findOne({ email: 'sara.wilson@university.com' });
    if (sara) {
        console.log(`Sara Wilson ID: ${sara._id}`);
    } else {
        console.log('Sara Wilson NOT FOUND');
    }
    process.exit(0);
}
debug();
