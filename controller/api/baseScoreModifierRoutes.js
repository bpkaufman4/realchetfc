const sequelize = require('../../config/connection');
const { Player, BaseScoreModifier, Match } = require('../../models');
const { Op } = require('sequelize');

const router = require('express').Router();

// Create a new base score modifier
router.post('/create', (req, res) => {
    if(!req.session.admin) {
        res.json({'status': 'error', 'message': 'must be an admin'});
        return;
    }
    const request = req.body;
    if(!request.matchId || !request.playerId || request.modifier === undefined) {
        res.json({'status': 'error', 'message': 'incomplete request - matchId, playerId, and modifier are required', request});
        return;
    }
    
    BaseScoreModifier.create(request)
    .then(dbData => {
        res.json({status: 'success', reply: dbData});
    })
    .catch(err => {
        res.json({status: 'fail', reply: err});
    });
});

// Get all base score modifiers for a specific match
router.get('/getForMatch/:matchId', (req, res) => {
    BaseScoreModifier.findAll({
        where: {
            matchId: req.params.matchId
        },
        include: [{
            model: Player,
            attributes: ['playerId', 'firstName', 'lastName']
        }],
        order: [
            [Player, 'firstName', 'ASC']
        ]
    })
    .then(dbData => {
        const modifiers = dbData.map(modifier => modifier.get({plain: true}));
        res.json(modifiers);
    })
    .catch(err => {
        console.log(err);
        res.json({status: 'error', reply: err});
    });
});

// Get all base score modifiers for a specific player
router.get('/getForPlayer/:playerId', (req, res) => {
    BaseScoreModifier.findAll({
        where: {
            playerId: req.params.playerId
        },
        include: [{
            model: Match,
            attributes: ['matchId', 'opponent', 'startTime', 'seasonId']
        }],
        order: [
            [Match, 'startTime', 'ASC']
        ]
    })
    .then(dbData => {
        const modifiers = dbData.map(modifier => modifier.get({plain: true}));
        res.json(modifiers);
    })
    .catch(err => {
        console.log(err);
        res.json({status: 'error', reply: err});
    });
});

// Get all base score modifiers for a player within a specific season
router.get('/getForPlayerSeason/:playerId/:seasonId', (req, res) => {
    BaseScoreModifier.findAll({
        where: {
            playerId: req.params.playerId
        },
        include: [{
            model: Match,
            where: {
                seasonId: req.params.seasonId
            },
            attributes: ['matchId', 'opponent', 'startTime', 'seasonId']
        }],
        order: [
            [Match, 'startTime', 'ASC']
        ]
    })
    .then(dbData => {
        const modifiers = dbData.map(modifier => modifier.get({plain: true}));
        res.json(modifiers);
    })
    .catch(err => {
        console.log(err);
        res.json({status: 'error', reply: err});
    });
});

// Update a base score modifier
router.put('/update/:baseScoreModifierId', (req, res) => {
    if(!req.session.admin) {
        res.json({'status': 'error', 'message': 'must be an admin'});
        return;
    }
    
    const request = req.body;
    if(request.modifier === undefined) {
        res.json({'status': 'error', 'message': 'modifier value is required'});
        return;
    }
    
    BaseScoreModifier.update(
        { modifier: request.modifier },
        { 
            where: { baseScoreModifierId: req.params.baseScoreModifierId }
        }
    )
    .then(dbData => {
        if(dbData[0] === 0) {
            res.json({status: 'error', message: 'Base score modifier not found'});
        } else {
            res.json({status: 'success', reply: `Updated ${dbData[0]} modifier(s)`});
        }
    })
    .catch(err => {
        res.json({status: 'error', reply: err});
    });
});

// Delete a base score modifier
router.delete('/delete/:baseScoreModifierId', (req, res) => {
    if(!req.session.admin) {
        res.json({'status': 'error', 'message': 'must be an admin'});
        return;
    }
    
    BaseScoreModifier.destroy({
        where: { baseScoreModifierId: req.params.baseScoreModifierId }
    })
    .then(reply => {
        if(reply === 0) {
            res.json({status: 'error', message: 'Base score modifier not found'});
        } else {
            res.json({status: 'success', reply: `Deleted ${reply} modifier(s)`});
        }
    })
    .catch(err => {
        res.json({status: 'error', reply: err});
    });
});

// Upsert (create or update) base score modifier for a player in a match
router.post('/upsert', (req, res) => {
    if(!req.session.admin) {
        res.json({'status': 'error', 'message': 'must be an admin'});
        return;
    }
    
    const request = req.body;
    if(!request.matchId || !request.playerId || request.modifier === undefined) {
        res.json({'status': 'error', 'message': 'incomplete request - matchId, playerId, and modifier are required', request});
        return;
    }
    
    BaseScoreModifier.upsert(request)
    .then(dbData => {
        res.json({status: 'success', reply: dbData});
    })
    .catch(err => {
        res.json({status: 'fail', reply: err});
    });
});

module.exports = router;