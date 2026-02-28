const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');
const Course = require('./models/courseModel');
const Enrollment = require('./models/enrollmentModel');

async function runFix() {
    await mongoose.connect(process.env.MONGO_URI);

    // 1. Sara Wilson
    let sara = await User.findOne({ email: 'sara.wilson@university.com' });
    if (!sara) {
        sara = await User.create({
            name: 'Dr. Sara Wilson',
            email: 'sara.wilson@university.com',
            password: '123456',
            role: 'university',
            isVerified: true,
            profile: { universityName: 'Sara Wilson University' }
        });
    }

    // 2. Course
    let course = await Course.findOne({ instructor: sara._id });
    if (!course) {
        course = await Course.create({
            title: 'Medical Research Fundamentals',
            description: 'A flagship course for Dr. Sara Wilson University.',
            category: 'Medicine',
            price: 0,
            instructor: sara._id,
            instructorName: sara.name,
            universityName: sara.profile.universityName,
            isPublished: true,
            modules: []
        });
        console.log('Created Course');
    }

    // 3. Rinsna C
    let rinsna = await User.findOne({ email: 'rinsna.c@student.com' });
    if (!rinsna) {
        rinsna = await User.create({
            name: 'Rinsna C',
            email: 'rinsna.c@student.com',
            password: '123456',
            role: 'student',
            universityId: sara._id,
            isVerified: true,
            profile: { phone: '1234567890' }
        });
        console.log('Created Rinsna');
    } else {
        rinsna.universityId = sara._id;
        await rinsna.save();
    }

    // 4. Enroll
    let enrollment = await Enrollment.findOne({ student: rinsna._id, course: course._id });
    if (!enrollment) {
        await Enrollment.create({
            student: rinsna._id,
            course: course._id,
            status: 'completed',
            enrolledAt: new Date()
        });
        console.log('Enrollment Success');
    } else {
        console.log('Already Enrolled');
    }

    console.log('University:', sara.email);
    console.log('Student:', rinsna.email);
    console.log('Course:', course.title);
    process.exit(0);
}

runFix();
