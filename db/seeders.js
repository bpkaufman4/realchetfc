const seedPositions = require('./seedPositions');
const seedColleges = require('./seedColleges');
const seedSeasons = require('./seedSeasons');
const seedPlayers = require('./seedPlayers');
const seedMatches = require('./seedMatches');
const seedPlayerSeasons = require('./seedPlayerSeasons');
const seedBoxScores = require('./seedBoxScores');
const seedMatchImages = require('./seedMatchImages');
const seedEden = require('./seedEden');
const seedFantasyEntries = require('./seedFantasyEntries');
const seedFantasyEntryPlayers = require('./seedFantasyEntryPlayers');

// Import sequelize connection and models to clear data
const sequelize = require('../config/connection');
const { 
    Position, 
    College, 
    Season, 
    Player, 
    Match, 
    PlayerSeason, 
    BoxScore, 
    MatchImage, 
    Eden,
    FantasyEntry,
    FantasyEntryPlayer
} = require('../models');

async function clearAllData() {
    try {
        console.log('Clearing all existing data...');
        
        // Disable foreign key checks temporarily
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Clear data using DELETE instead of TRUNCATE to avoid FK constraint issues
        // Clear in dependency order (child tables first)
        await FantasyEntryPlayer.destroy({ where: {}, force: true });
        console.log('FantasyEntryPlayer data cleared');
        
        await FantasyEntry.destroy({ where: {}, force: true });
        console.log('FantasyEntry data cleared');
        
        await BoxScore.destroy({ where: {}, force: true });
        console.log('BoxScore data cleared');
        
        await MatchImage.destroy({ where: {}, force: true });
        console.log('MatchImage data cleared');
        
        await PlayerSeason.destroy({ where: {}, force: true });
        console.log('PlayerSeason data cleared');
        
        await Match.destroy({ where: {}, force: true });
        console.log('Match data cleared');
        
        await Player.destroy({ where: {}, force: true });
        console.log('Player data cleared');
        
        await Season.destroy({ where: {}, force: true });
        console.log('Season data cleared');
        
        await College.destroy({ where: {}, force: true });
        console.log('College data cleared');
        
        await Position.destroy({ where: {}, force: true });
        console.log('Position data cleared');
        
        await Eden.destroy({ where: {}, force: true });
        console.log('Eden data cleared');
        
        // Re-enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('All existing data cleared successfully!');
    } catch (error) {
        // Make sure to re-enable foreign key checks even if there's an error
        try {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        } catch (fkError) {
            console.error('Error re-enabling foreign key checks:', fkError);
        }
        console.error('Error clearing data:', error);
        throw error;
    }
}

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');
        
        // Seed positions first (required for players)
        console.log('Seeding positions...');
        await seedPositions();
        
        // Seed colleges (required for players)
        console.log('Seeding colleges...');
        await seedColleges();
        
        // Seed seasons (required for matches, player seasons, and fantasy entries)
        console.log('Seeding seasons...');
        await seedSeasons();
        
        // Seed players (depends on positions and colleges)
        console.log('Seeding players...');
        await seedPlayers();
        
        // Seed matches (depends on seasons)
        console.log('Seeding matches...');
        await seedMatches();
        
        // Seed player seasons (depends on players and seasons)
        console.log('Seeding player seasons...');
        await seedPlayerSeasons();
        
        // Seed box scores (depends on players and matches)
        console.log('Seeding box scores...');
        await seedBoxScores();
        
        // Seed match images (depends on matches)
        console.log('Seeding match images...');
        await seedMatchImages();
        
        // Seed fantasy entries (depends on seasons)
        console.log('Seeding fantasy entries...');
        await seedFantasyEntries();
        
        // Seed fantasy entry players (depends on fantasy entries and players)
        console.log('Seeding fantasy entry players...');
        await seedFantasyEntryPlayers();
        
        // Seed Eden data (independent)
        console.log('Seeding Eden data...');
        await seedEden();
        
        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error during database seeding:', error);
        throw error;
    }
}

module.exports = { 
    seedPositions, 
    seedColleges, 
    seedSeasons, 
    seedPlayers,
    seedMatches,
    seedPlayerSeasons,
    seedBoxScores,
    seedMatchImages,
    seedFantasyEntries,
    seedFantasyEntryPlayers,
    seedEden,
    clearAllData,
    seedDatabase 
};