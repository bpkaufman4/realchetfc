const router = require('express').Router();
const { FantasyEntry, FantasyEntryPlayer } = require('../../models');

// Create a new fantasy entry
router.post('/', async (req, res) => {
    try {
        const { teamName, firstName, lastName, seasonId, selectedPlayers, email } = req.body;

        // Validate required fields
        if (!teamName || !firstName || !lastName || !seasonId || !selectedPlayers || selectedPlayers.length === 0) {
            return res.status(400).json({ error: 'All fields are required and at least one player must be selected' });
        }

        // Create the fantasy entry
        const fantasyEntry = await FantasyEntry.create({
            teamName,
            firstName,
            lastName,
            seasonId
        });

        // Create fantasy entry players
        const fantasyEntryPlayers = selectedPlayers.map(playerId => ({
            fantasyEntryId: fantasyEntry.fantasyEntryId,
            playerId
        }));

        await FantasyEntryPlayer.bulkCreate(fantasyEntryPlayers);

        res.json({ success: true, fantasyEntryId: fantasyEntry.fantasyEntryId });
    } catch (err) {
        console.error('Fantasy entry creation error:', err);
        res.status(500).json({ error: 'Failed to create fantasy entry' });
    }
});

module.exports = router;