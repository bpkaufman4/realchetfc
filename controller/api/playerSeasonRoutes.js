const router = require('express').Router();
const { PlayerSeason, Player, Season } = require('../../models');

// POST /api/player-season - Add a player to a season
router.post('/', async (req, res) => {
    // Check if user is admin
    if (!req.session.admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { playerId, seasonId } = req.body;

        if (!playerId || !seasonId) {
            return res.status(400).json({ message: 'playerId and seasonId are required' });
        }

        // Check if player exists
        const player = await Player.findByPk(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Check if season exists
        const season = await Season.findByPk(seasonId);
        if (!season) {
            return res.status(404).json({ message: 'Season not found' });
        }

        // Check if player is already in this season
        const existingEntry = await PlayerSeason.findOne({
            where: { playerId, seasonId }
        });

        if (existingEntry) {
            return res.status(409).json({ message: 'Player is already in this season' });
        }

        // Create the player-season relationship
        const playerSeason = await PlayerSeason.create({
            playerId,
            seasonId
        });

        res.status(201).json({
            message: 'Player added to season successfully',
            playerSeason: playerSeason.get({ plain: true })
        });

    } catch (error) {
        console.error('Error adding player to season:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/player-season - Remove a player from a season
router.delete('/', async (req, res) => {
    // Check if user is admin
    if (!req.session.admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { playerId, seasonId } = req.body;

        if (!playerId || !seasonId) {
            return res.status(400).json({ message: 'playerId and seasonId are required' });
        }

        // Find and delete the player-season relationship
        const playerSeason = await PlayerSeason.findOne({
            where: { playerId, seasonId }
        });

        if (!playerSeason) {
            return res.status(404).json({ message: 'Player is not in this season' });
        }

        await playerSeason.destroy();

        res.json({
            message: 'Player removed from season successfully'
        });

    } catch (error) {
        console.error('Error removing player from season:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/player-season/:seasonId - Get all players in a specific season
router.get('/:seasonId', async (req, res) => {
    try {
        const { seasonId } = req.params;

        const playersInSeason = await PlayerSeason.findAll({
            where: { seasonId },
            include: [
                {
                    model: Player,
                    include: ['Position', 'College']
                }
            ]
        });

        const players = playersInSeason.map(ps => ps.player.get({ plain: true }));

        res.json(players);

    } catch (error) {
        console.error('Error fetching players in season:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;