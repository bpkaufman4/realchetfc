const { BoxScore, Match, Player, Position } = require('../models');

async function seedBoxScores() {
    // Get matches, players, and positions
    const matches = await Match.findAll();
    const players = await Player.findAll({ include: Position });
    
    const boxScoresSeed = [];
    
    // For each completed match (those with scores), create box scores for a subset of players
    const completedMatches = matches.filter(match => match.ourScore !== null);
    
    completedMatches.forEach((match, matchIndex) => {
        // Randomly select 11-18 players who "played" in this match
        const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
        const playersInMatch = shuffledPlayers.slice(0, Math.floor(Math.random() * 8) + 11); // 11-18 players
        
        let goalsToDistribute = match.ourScore || 0;
        let assistsToDistribute = Math.max(0, goalsToDistribute - Math.floor(Math.random() * 2)); // Usually fewer assists than goals
        
        playersInMatch.forEach((player, playerIndex) => {
            let goals = 0;
            let assists = 0;
            let mvp = false;
            
            // Distribute goals more likely to forwards
            if (goalsToDistribute > 0) {
                const isForward = player.position?.abbreviation === 'FWD';
                const isMidfielder = player.position?.abbreviation === 'MID';
                
                const goalChance = isForward ? 0.4 : isMidfielder ? 0.2 : 0.1;
                
                if (Math.random() < goalChance && goalsToDistribute > 0) {
                    goals = Math.random() < 0.8 ? 1 : 2; // Usually 1 goal, sometimes 2
                    goals = Math.min(goals, goalsToDistribute);
                    goalsToDistribute -= goals;
                }
            }
            
            // Distribute assists more likely to midfielders and forwards
            if (assistsToDistribute > 0 && goals === 0) { // Players with goals less likely to also have assists
                const isForward = player.position?.abbreviation === 'FWD';
                const isMidfielder = player.position?.abbreviation === 'MID';
                
                const assistChance = isMidfielder ? 0.3 : isForward ? 0.2 : 0.1;
                
                if (Math.random() < assistChance && assistsToDistribute > 0) {
                    assists = 1;
                    assistsToDistribute -= assists;
                }
            }
            
            // Determine MVP (only one per match, prefer players with goals/assists)
            if (playerIndex === 0 && (goals > 0 || assists > 0)) {
                mvp = Math.random() < 0.6; // 60% chance if they have stats
            } else if (goals >= 2) {
                mvp = Math.random() < 0.8; // High chance for multi-goal scorers
            }
            
            // Make sure only one MVP per match
            if (mvp && boxScoresSeed.some(bs => bs.matchId === match.matchId && bs.mvp)) {
                mvp = false;
            }
            
            const notes = [];
            if (goals > 1) notes.push(`${goals} goals`);
            if (assists > 0) notes.push(`${assists} assist${assists > 1 ? 's' : ''}`);
            if (mvp) notes.push('Man of the Match');
            if (Math.random() < 0.1) notes.push('Yellow card');
            if (Math.random() < 0.02) notes.push('Red card');
            
            boxScoresSeed.push({
                playerId: player.playerId,
                matchId: match.matchId,
                goals: goals,
                assists: assists,
                mvp: mvp,
                notes: notes.length > 0 ? notes.join(', ') : null
            });
        });
        
        // If no MVP was assigned, randomly assign one
        const matchBoxScores = boxScoresSeed.filter(bs => bs.matchId === match.matchId);
        if (!matchBoxScores.some(bs => bs.mvp)) {
            const randomPlayer = matchBoxScores[Math.floor(Math.random() * matchBoxScores.length)];
            randomPlayer.mvp = true;
            if (randomPlayer.notes) {
                randomPlayer.notes += ', Man of the Match';
            } else {
                randomPlayer.notes = 'Man of the Match';
            }
        }
    });
    
    return BoxScore.bulkCreate(boxScoresSeed)
        .then(dbData => {
            console.log('Box scores seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding box scores:', err);
            throw err;
        });
}

module.exports = seedBoxScores;