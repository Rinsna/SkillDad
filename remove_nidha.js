require('dotenv').config();
const { connectPostgres, query } = require('./server/config/postgres');

async function removeUser() {
    try {
        await connectPostgres();
        
        const searchResult = await query("SELECT id, name, email FROM users WHERE name ILIKE '%nidha%' OR email ILIKE '%nidha%'");
        console.log('Search Results:', searchResult.rows);

        if (searchResult.rows.length === 0) {
            console.log('No user found with name "nidha"');
            return;
        }

        for (const user of searchResult.rows) {
            console.log(`Deleting user: ${user.name} (${user.email})`);
            
            // Delete related records first to avoid foreign key constraints
            await query('DELETE FROM enrollments WHERE student_id = $1', [user.id]);
            await query('DELETE FROM transactions WHERE student_id = $1', [user.id]);
            await query('DELETE FROM course_reviews WHERE student_id = $1', [user.id]);
            await query('DELETE FROM user_progress WHERE user_id = $1', [user.id]);
            
            // Finally delete the user
            await query('DELETE FROM users WHERE id = $1', [user.id]);
            console.log(`User ${user.id} deleted successfully.`);
        }
    } catch (error) {
        console.error('Error removing user:', error);
    } finally {
        process.exit();
    }
}

removeUser();
