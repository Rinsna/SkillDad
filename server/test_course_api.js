const axios = require('axios');

async function testApi() {
    try {
        // 1. Login as Sara Wilson
        const loginRes = await axios.post('http://127.0.0.1:3030/api/users/login', {
            email: 'sara.wilson@university.com',
            password: '123456'
        });
        const token = loginRes.data.token;
        console.log('Login successful');

        // 2. Fetch admin courses
        const coursesRes = await axios.get('http://127.0.0.1:3030/api/courses/admin', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Courses fetched:', coursesRes.data.length);
        coursesRes.data.forEach(c => {
            console.log(`- ${c.title} (ID: ${c._id})`);
        });
    } catch (err) {
        console.error('Test failed:', err.response?.data || err.message);
    }
}

testApi();
