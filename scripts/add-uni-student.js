const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

async function createEnrolledStudent() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Models
        const User = require('../server/models/userModel');
        const Enrollment = require('../server/models/enrollmentModel');
        // For Course, we need to define/require it
        // Check if courseModel exists
        const Course = mongoose.models.Course || require('../server/models/courseModel');

        const uniEmail = 'gmail+Uni@gmail.com';
        const uniPassword = 'password123';

        // 1. Find or create University Account
        let university = await User.findOne({ email: uniEmail });
        if (!university) {
            university = await User.create({
                name: 'Skill Dad University',
                email: uniEmail,
                password: uniPassword,
                role: 'university',
                profile: {
                    universityName: 'Skill Dad University',
                    location: 'Bangalore, India',
                    phone: '9876543210'
                },
                isVerified: true
            });
            console.log('University account created:', university.email);
        } else {
            console.log('University account found:', university.email);
        }

        // 2. Find a Course
        const course = await Course.findOne();
        if (!course) {
            console.error('No courses found in the database. Please add a course first.');
            process.exit(1);
        }
        console.log('Using course:', course.title);

        // 3. Create a Student
        const studentEmail = `student_${Date.now()}@example.com`;
        const student = await User.create({
            name: 'Sample Student',
            email: studentEmail,
            password: 'password123',
            role: 'student',
            universityId: university._id, // Link to the University
            profile: {
                studentId: 'SDU-' + Math.floor(1000 + Math.random() * 9000),
                phone: '1234567890'
            },
            isVerified: true
        });
        console.log('Student account created:', student.email);

        // 4. Enroll Student
        const enrollment = await Enrollment.create({
            student: student._id,
            course: course._id,
            status: 'active'
        });
        console.log('Enrollment record created for student in', course.title);

        console.log('\nSummary:');
        console.log('- University:', university.email);
        console.log('- Student:', student.email);
        console.log('- Course:', course.title);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createEnrolledStudent();
