const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');
const Course = require('./models/courseModel');
const Enrollment = require('./models/enrollmentModel');

async function setup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Setup University/Instructor
        const uniEmail = 'sara.wilson@university.com';
        let sara = await User.findOne({ email: uniEmail });
        if (!sara) {
            sara = await User.create({
                name: 'Dr. Sara Wilson',
                email: uniEmail,
                password: '123456',
                role: 'university',
                isVerified: true,
                profile: {
                    universityName: 'Sara Wilson University',
                    phone: '1234567890'
                }
            });
            console.log('Created University: Dr. Sara Wilson');
        } else {
            console.log('University exists:', sara.name);
        }

        // 2. Setup Course for this University
        let course = await Course.findOne({ instructor: sara._id });
        if (!course) {
            course = await Course.create({
                title: 'Introduction to Advanced Research',
                description: 'A flagship course for Dr. Sara Wilson University.',
                category: 'Education',
                price: 0,
                instructor: sara._id,
                instructorName: sara.name,
                universityName: sara.profile.universityName,
                isPublished: true
            });
            console.log('Created Course:', course.title);
        } else {
            console.log('Course exists:', course.title);
        }

        // 3. Setup Student
        const studentEmail = 'rinsna.c@student.com';
        let rinsna = await User.findOne({ email: studentEmail });
        if (!rinsna) {
            rinsna = await User.create({
                name: 'Rinsna C',
                email: studentEmail,
                password: '123456',
                role: 'student',
                isVerified: true,
                universityId: sara._id,
                profile: {
                    phone: '9876543210',
                    studentId: 'RSN-2026-001'
                }
            });
            console.log('Created Student: Rinsna C');
        } else {
            rinsna.universityId = sara._id;
            await rinsna.save();
            console.log('Student exists, updated university association.');
        }

        // 4. Enroll Student in Course
        let enrollment = await Enrollment.findOne({ student: rinsna._id, course: course._id });
        if (!enrollment) {
            enrollment = await Enrollment.create({
                student: rinsna._id,
                course: course._id,
                status: 'completed', // Giving them full access
                enrolledAt: new Date()
            });
            console.log('Enrolled Rinsna C in course.');
        } else {
            console.log('Enrollment already exists.');
        }

        console.log('\n--- SETUP COMPLETE ---');
        console.log('University Login:', uniEmail, '/ 123456');
        console.log('Student Login:', studentEmail, '/ 123456');
        console.log('Course ID:', course._id);

        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

setup();
