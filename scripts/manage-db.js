const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', '.mongodb_data');
const mongodPath = "C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe";

// Ensure db directory exists
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

function isMongoRunning() {
    try {
        // Check if port 27017 is in use
        const output = execSync('netstat -ano | findstr :27017').toString();
        return output.includes('LISTENING');
    } catch (e) {
        return false;
    }
}

async function startMongo() {
    if (isMongoRunning()) {
        console.log('MongoDB is already running.');
        return;
    }

    console.log('Starting MongoDB...');

    // Check if mongod exists at the expected path
    if (!fs.existsSync(mongodPath)) {
        console.error(`Error: MongoDB executable not found at ${mongodPath}`);
        console.log('Please install MongoDB or update the path in scripts/manage-db.js');
        process.exit(1);
    }

    const mongoProcess = spawn(mongodPath, ['--dbpath', dbPath], {
        detached: true,
        stdio: 'ignore'
    });

    mongoProcess.unref();

    // Wait a bit to ensure it starts
    let attempts = 0;
    while (attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (isMongoRunning()) {
            console.log('MongoDB started successfully.');
            return;
        }
        attempts++;
    }

    console.error('Failed to start MongoDB within 10 seconds.');
    process.exit(1);
}

startMongo();
