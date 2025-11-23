const fs = require('fs');
const { BaseScoreModifier, Match } = require('./models');
const { Op } = require('sequelize');

/**
 * Get all base score modifiers for a season, organized by player and match
 * @param {string} seasonId - The season's UUID
 * @returns {Promise<Object>} Map of playerId -> array of modifiers sorted by match date
 */
async function getSeasonBaseScoreModifiers(seasonId) {
    try {
        // Get all modifiers for matches in this season
        const modifiers = await BaseScoreModifier.findAll({
            include: [{
                model: Match,
                where: { seasonId: seasonId },
                attributes: ['matchId', 'startTime']
            }],
            order: [[Match, 'startTime', 'ASC']]
        });

        // Organize modifiers by player
        const modifiersByPlayer = {};
        modifiers.forEach(modifier => {
            const playerId = modifier.playerId;
            if (!modifiersByPlayer[playerId]) {
                modifiersByPlayer[playerId] = [];
            }
            modifiersByPlayer[playerId].push({
                matchId: modifier.matchId,
                modifier: modifier.modifier,
                startTime: modifier.match.startTime
            });
        });

        return modifiersByPlayer;
    } catch (error) {
        console.error('Error fetching season base score modifiers:', error);
        return {};
    }
}

/**
 * Calculate a player's effective base score for a specific match using pre-fetched modifiers
 * @param {string} playerId - The player's UUID
 * @param {string} matchId - The current match's UUID  
 * @param {Date} matchStartTime - The current match's start time
 * @param {number} originalBaseScore - The player's original base score
 * @param {Object} seasonModifiers - Pre-fetched modifiers organized by player
 * @returns {number} The effective base score after applying modifiers
 */
function calculateCumulativeBaseScoreFromCache(playerId, matchId, matchStartTime, originalBaseScore, seasonModifiers) {
    try {
        const playerModifiers = seasonModifiers[playerId] || [];
        
        // Apply modifiers cumulatively for matches up to and including the current match
        let effectiveBaseScore = originalBaseScore;
        for (const modifierData of playerModifiers) {
            // Apply modifier if it's for the current match or an earlier match in the season
            if (new Date(modifierData.startTime) <= new Date(matchStartTime)) {
                effectiveBaseScore += modifierData.modifier;
            }
        }

        return Math.max(0, effectiveBaseScore); // Ensure base score doesn't go negative
    } catch (error) {
        console.error('Error calculating cumulative base score from cache:', error);
        return originalBaseScore; // Fallback to original score on error
    }
}

/**
 * Calculate a player's effective base score for a specific match by applying
 * all cumulative modifiers from the season up to that match
 * @param {string} playerId - The player's UUID
 * @param {string} matchId - The current match's UUID  
 * @param {string} seasonId - The season's UUID
 * @param {number} originalBaseScore - The player's original base score
 * @returns {Promise<number>} The effective base score after applying modifiers
 */
async function calculateCumulativeBaseScore(playerId, matchId, seasonId, originalBaseScore) {
    try {
        // Get the current match date
        const currentMatch = await Match.findByPk(matchId, {
            attributes: ['startTime']
        });
        
        if (!currentMatch) {
            return originalBaseScore;
        }

        // Get all matches in the season up to and including the current match
        const seasonMatches = await Match.findAll({
            where: {
                seasonId: seasonId,
                startTime: {
                    [Op.lte]: currentMatch.startTime
                }
            },
            order: [['startTime', 'ASC']]
        });

        const matchIds = seasonMatches.map(match => match.matchId);

        // Get all modifiers for this player in these matches
        const modifiers = await BaseScoreModifier.findAll({
            where: {
                playerId: playerId,
                matchId: {
                    [Op.in]: matchIds
                }
            },
            include: [{
                model: Match,
                attributes: ['startTime']
            }],
            order: [[Match, 'startTime', 'ASC']]
        });

        // Apply modifiers cumulatively
        let effectiveBaseScore = originalBaseScore;
        for (const modifier of modifiers) {
            effectiveBaseScore += modifier.modifier;
        }

        return Math.max(0, effectiveBaseScore); // Ensure base score doesn't go negative
    } catch (error) {
        console.error('Error calculating cumulative base score:', error);
        return originalBaseScore; // Fallback to original score on error
    }
}

function persistTemporaryFile(fileName, targetDirectory = 'images') {
    try {
        if (!fs.existsSync('public/'+targetDirectory)) {
            fs.mkdirSync('public/'+targetDirectory);
        }
    } catch (err) {
        console.error(err);
    }
    return new Promise((resolve, reject) => {
        fs.copyFile('./public/tempImages/' + fileName, './public/' + targetDirectory + '/' + fileName, (err) => {
            if(err) {
                resolve({status: 'fail', message: 'error copying temporary file', err});
            } else {
                resolve({status: 'success', relativePath: targetDirectory + '/' + fileName});
            }
        });
    })
}

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

module.exports = { persistTemporaryFile, getFlagEmoji, calculateCumulativeBaseScore, getSeasonBaseScoreModifiers, calculateCumulativeBaseScoreFromCache };