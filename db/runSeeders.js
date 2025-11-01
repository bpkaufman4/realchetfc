const sequelize = require('../config/connection');
const { seedDatabase, clearAllData } = require('./seeders');

async function runSeeders() {
    try {
        // First, clear all existing data
        console.log('Clearing all existing data...');
        await clearAllData();
        
        // Sync the database (this will create tables if they don't exist)
        await sequelize.sync({ force: true }); // Use force: true to drop and recreate tables
        console.log('Database synced successfully');
        
        // Run all seeders
        await seedDatabase();
        
        console.log('All seeders completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error running seeders:', error);
        process.exit(1);
    }
}

// Run the seeders if this file is executed directly
if (require.main === module) {
    runSeeders();
}

module.exports = runSeeders;