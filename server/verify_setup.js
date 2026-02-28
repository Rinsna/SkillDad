const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');
const Course = require('./models/courseModel');
const Enrollment = require('./models/enrollmentModel');

async function verify() {
    await mongoose.connect(process.env.MONGO_URI);
    const sara = await User.findOne({ name: /Sara Wilson/ });
    const rinsna = await User.findOne({ name: /Rinsna C/ });
    const course = await Course.findOne({ instructor: sara?._id });
    const enrollment = await Enrollment.findOne({ student: rinsna?._id, course: course?._id });

    console.log('--- VERIFICATION ---');
    console.log('University:', sara?.name, '| ID:', sara?._id);
    console.log('Student:', rinsna?.name, '| UniID:', rinsna?.universityId);
    console.log('Course:', course?.title);
    console.log('Enrollment Status:', enrollment ? 'ENROLLED' : 'NOT FOUND');
    process.exit(0);
}
verify();
