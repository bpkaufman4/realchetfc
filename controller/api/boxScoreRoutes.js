const sequelize = require('../../config/connection');
const { Player, BoxScore, Match } = require('../../models');

const router = require('express').Router();

router.post('/create', (req, res) => {
    if(!req.session.admin) {
        res.json({'status': 'error', 'message': 'must be an admin'})
        return;
    }
    const request = req.body;
    if(!request.matchId || !request.playerId) {
        res.json({'status': 'error', 'message': 'incomplete request', request});
        return;
    }
    BoxScore.create(request)
    .then(dbData => {
        res.json({status: 'success', reply: dbData});
    })
    .catch(err => {
        res.json({status: 'fail', reply: err});
    })
})

router.get('/unplayedPlayers/:matchId', (req, res) => {
    Player.findAll({
        include: {
            model: BoxScore,
            required: false,
            where: {
                matchId: req.params.matchId
            },
            order: ['firstName', 'ASC']
        },
        where: sequelize.literal('boxScores.boxScoreId is null')
    })
    .then(dbData => {
        const players = dbData.map(player => player.get({plain: true}));
        res.json(players);
    })
    .catch(err => {
        console.log(err);
    })
})

router.get('/getForMatch/:matchId', (req, res) => {
    BoxScore.findAll({
        where: {
            matchId: req.params.matchId
        },
        include: Player,
        order: [
            [Player, 'firstName', 'ASC']
        ]
    })
    .then(dbData => {
        const boxScores = dbData.map(boxScore => boxScore.get({plain: true}));
        res.json(boxScores);
    })
    .catch(err => {
        console.log(err);
    })
});

router.delete('/delete/:boxScoreId', (req, res) => {
    if(!req.session.admin) {
        res.json({'status': 'error', 'message': 'must be an admin'})
        return;
    }
    BoxScore.destroy({where: {boxScoreId: req.params.boxScoreId}})
    .then(reply => {
        res.json({status: 'success', reply})
    })
    .catch(err => {
        res.json({status: 'error', reply: err});
    })
});

router.post('/setForMatch', (req, res) => {
    if(!req.session.admin) {
        res.json({'status': 'error', 'message': 'must be an admin'})
        return;
    }
    const request = req.body;

    const boxScores = new Promise((resolve, reject) => {
        const reply = [];
        request.boxScores.forEach(bs => {
            bs.matchId = request.matchId;
            const upsert = BoxScore.upsert(bs)
            .then(dbData => {
                return {status: 'success', reply: dbData}
            })
            .catch(err => {
                return {status: 'error', reply: err}
            })
    
            if(upsert.status === 'error') {
                res.json(upsert);
                return;
            } else {
                reply.push(upsert.reply);
            }
        });
        resolve(reply)
    })

    const matchRequest = {ourScore: request.ourScore, opponentScore: request.opponentScore};
    const updateMatch = Match.update(matchRequest, {where: {matchId: request.matchId}});

    Promise.resolve([boxScores, updateMatch])
    .then(reply => {
        res.json({status: 'success', reply});
    });
});

module.exports = router;