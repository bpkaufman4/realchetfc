const { PlayerSeason, Player, Season } = require('../models');

async function seedPlayerSeasons() {
    // Get all players and seasons
    const players = await Player.findAll();
    const seasons = await Season.findAll();
    
    const playerSeasonsSeed = [];
    
    // Create relationships between players and seasons
    seasons.forEach(season => {
        // Most players play in both seasons, but some might be new or have left
        let playersInSeason;
        
        if (season.name === '2024 Season') {
            // In 2024, let's say 25 out of 30 players were active
            playersInSeason = players.slice(0, 25);
        } else if (season.name === '2025 Season') {
            // In 2025, let's say 5 players left and we have all 30 players active
            // (including the original 25 plus 5 new ones)
            playersInSeason = players; // All 30 players
        } else if (season.name === '2026 Season') {
            // For the upcoming 2026 season, we can have all current players registered
            playersInSeason = players; // All 30 players
        } else {
            // Default case for any other seasons
            playersInSeason = players;
        }
        
        playersInSeason.forEach(player => {
            playerSeasonsSeed.push({
                playerId: player.playerId,
                seasonId: season.seasonId
            });
        });
    });
    
    return PlayerSeason.bulkCreate(playerSeasonsSeed)
        .then(dbData => {
            console.log('Player seasons seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding player seasons:', err);
            throw err;
        });
}

module.exports = seedPlayerSeasons;