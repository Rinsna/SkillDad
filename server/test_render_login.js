const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing login for admin@skilldad.com...');
        const res = await axios.post('https://skilldad-server.onrender.com/api/users/login', {
            email: 'admin@skilldad.com',
            password: '123456'
        });
        console.log('Login Success!', res.data._id, res.data.role);
    } catch (err) {
        console.error('Login Failed with status:', err.response?.status);
        console.error('Message:', err.response?.data?.message || err.message);
    }
}

testLogin();
