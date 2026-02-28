const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
const LiveSession = require('./server/models/liveSessionModel');

async function checkSessions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const sessions = await LiveSession.find({ isDeleted: false }).lean();
        console.log('---BEGIN SESSIONS---');
        console.log(JSON.stringify(sessions, null, 2));
        console.log('---END SESSIONS---');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkSessions();
