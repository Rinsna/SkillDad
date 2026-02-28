const axios = require('axios');

async function testRender() {
    try {
        console.log('Testing Render URL...');
        // 1. Login
        const loginRes = await axios.post('https://skilldad-server.onrender.com/api/users/login', {
            email: 'sara.wilson@university.com',
            password: '123456'
        });
        const token = loginRes.data.token;
        console.log('Login successful on Render');

        // 2. Fetch courses
        const coursesRes = await axios.get('https://skilldad-server.onrender.com/api/courses/admin', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Courses on Render:', coursesRes.data.length);
        coursesRes.data.forEach(c => {
            console.log(`- ${c.title} (ID: ${c._id})`);
        });
    } catch (err) {
        console.error('Render test failed:', err.response?.data || err.message);
    }
}

testRender();
