const { FantasyEntryPlayer, FantasyEntry, Player, Position } = require('../models');

async function seedFantasyEntryPlayers() {
    // Get fantasy entries and players
    const fantasyEntries = await FantasyEntry.findAll();
    const players = await Player.findAll({ include: Position });
    
    const fantasyEntryPlayersSeed = [];
    
    // Create fantasy teams for each entry
    fantasyEntries.forEach(entry => {
        // Create a fantasy team with 11 players: 1 GK, 4 DEF, 4 MID, 2 FWD
        const goalkeepers = players.filter(p => p.position?.abbreviation === 'GK');
        const defenders = players.filter(p => p.position?.abbreviation === 'DEF');
        const midfielders = players.filter(p => p.position?.abbreviation === 'MID');
        const forwards = players.filter(p => p.position?.abbreviation === 'FWD');
        
        // Shuffle arrays to get random selections
        const shuffledGK = [...goalkeepers].sort(() => 0.5 - Math.random());
        const shuffledDEF = [...defenders].sort(() => 0.5 - Math.random());
        const shuffledMID = [...midfielders].sort(() => 0.5 - Math.random());
        const shuffledFWD = [...forwards].sort(() => 0.5 - Math.random());
        
        // Select players for the fantasy team
        const selectedPlayers = [
            ...shuffledDEF.slice(0, 2),    // 2 Defenders
            ...shuffledMID.slice(0, 2),    // 2 Midfielders
            ...shuffledFWD.slice(0, 2)     // 2 Forwards
        ];
        
        // Create fantasy entry player records
        selectedPlayers.forEach(player => {
            fantasyEntryPlayersSeed.push({
                fantasyEntryId: entry.fantasyEntryId,
                playerId: player.playerId
            });
        });
    });
    
    return FantasyEntryPlayer.bulkCreate(fantasyEntryPlayersSeed)
        .then(dbData => {
            console.log('Fantasy entry players seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding fantasy entry players:', err);
            throw err;
        });
}

module.exports = seedFantasyEntryPlayers;