const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');
const Course = require('./models/courseModel');
const Enrollment = require('./models/enrollmentModel');

async function debug() {
    await mongoose.connect(process.env.MONGO_URI);
    const rinsna = await User.findOne({ email: 'rinsna.c@student.com' });
    const enrollments = await Enrollment.find({ student: rinsna._id });
    console.log('Rinsna ID:', rinsna._id);
    console.log('Enrollments found:', enrollments.length);
    for (const e of enrollments) {
        const c = await Course.findById(e.course);
        console.log(`- Enrolled in: ${c ? c.title : 'Deleted Course'} (ID: ${e.course})`);
    }
    process.exit(0);
}
debug();
