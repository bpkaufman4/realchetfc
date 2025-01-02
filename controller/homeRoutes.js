const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Position, Player, Match, BoxScore, College } = require('../models');
const sequelize = require('../config/connection');
const { error } = require('console');
router.get('/', (req, res) => {
    Player.findAll({
        attributes: {
            include: [
                [sequelize.literal(`(SELECT COUNT(*) FROM boxScore WHERE boxScore.playerId = player.playerId)`), 'games'],
                [sequelize.literal(`ifnull((SELECT SUM(totalGoals.goals) from boxScore as totalGoals where totalGoals.playerId = player.playerId), 0)`), 'goals'],
                [sequelize.literal(`ifnull((SELECT SUM(totalAssists.assists) from boxScore as totalAssists where totalAssists.playerId = player.playerId), 0)`), 'assists']
            ]
        },
        include: [College, Position]
    })
    .then(dbData => {
        const templateData = {players: dbData.map(player => player.get({plain: true}))};
        console.log(templateData);
        res.render('home', templateData);
    })
});

router.get('/playerAdd', (req, res) => {
    res.render('playerAdd');
});

router.post('/uploadFile', async (req, res) => {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, info) {
        //Path where image will be uploaded
        let fileName = uuidv4() + path.extname(info.filename);
        const relativePath = 'tempImages/' + fileName;
        const url = process.env.BASEPATH + relativePath;
        fstream = fs.createWriteStream('public/' + relativePath);
        file.pipe(fstream);
        fstream.on('close', function () {    
            res.json({status: 'success', fileName, url, relativePath});
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
})
router.get('/admin', (req, res) => {
    if(!req.session.admin) {
        res.redirect('login');
        return;
    }
    res.render('admin', {layout: 'admin'});
});

router.get('/admin-players', (req, res) => {
    if(!req.session.admin) {
        res.redirect('login');
        return;
    }

    const colleges = College.findAll()
    .then(dbData => {
        let dbDataClean = dbData.map(position => position.get({plain: true}));
        return dbDataClean;
    });

    const positions = Position.findAll()
    .then(dbData => {
        let dbDataClean = dbData.map(position => position.get({plain: true}));
        return dbDataClean;
    });
    
    const players = Player.findAll({include: [Position, College]})
    .then(dbData => {
        let dbDataClean = dbData.map(player => player.get({plain: true}));
        return dbDataClean;
    })

    Promise.all([positions, players, colleges])
    .then(data => {
        res.render('admin-players', {layout: 'admin', data: {positions: data[0], players: data[1], colleges: data[2]}});
    })
});

router.get('/admin-matches', (req, res) => {
    if(!req.session.admin) {
        res.redirect('login');
        return;
    }

    Match.findAll()
    .then(dbData => {
        let dbDataClean = dbData.map(match => match.get({plain: true}));
        return dbDataClean;
    })
    .then(matches => {
        res.render('admin-matches', {layout: 'admin', matches});
    })

});

router.get('/admin-match/:id', (req, res) => {
    if(!req.session.admin) {
        res.redirect('login');
        return;
    }

    const match = Match.findOne({where: {matchId: req.params.id}, include: {model: BoxScore, include: Player}})
    .then(dbData => {
        if(!dbData) {
            res.redirect('admin-matches');
            return;
        }
        const dbDataClean = dbData.get({plain: true});
        return dbDataClean;
    });

    const boxScore = BoxScore.findAll({where: {matchId: req.params.id}, include: {model: Player}})
    .then(dbData => {
        const dbDataClean = dbData.map(boxScore => boxScore.get({plain: true}));
        return dbDataClean;
    })

    Promise.all([match, boxScore])
    .then(reply => {
        res.render('admin-match', {layout: 'admin', match: reply[0], boxScore: reply[1]});
    })
});

router.get('/settings', (req, res) => {
    if(!req.session.admin) {
        res.redirect('login');
        return;
    }
    
    const collegeData = College.findAll();
    const positionData = Position.findAll();

    Promise.all([collegeData, positionData]).then(data => {
        const colleges = data[0].map(college => college.get({plain: true}));
        const positions = data[1].map(position => position.get({plain: true}));
        res.render('settings', {layout: 'admin', colleges, positions});
    })
})

router.get('/player/:id', (req, res) => {
    Player.findOne({
        where: {playerId: req.params.id},
        include: [Position, College],
        attributes: {
            include: [
                [sequelize.literal(`(SELECT COUNT(*) FROM boxScore WHERE boxScore.playerId = player.playerId)`), 'games'],
                [sequelize.literal(`ifnull((SELECT SUM(totalGoals.goals) from boxScore as totalGoals where totalGoals.playerId = player.playerId), 0)`), 'goals'],
                [sequelize.literal(`ifnull((SELECT SUM(totalAssists.assists) from boxScore as totalAssists where totalAssists.playerId = player.playerId), 0)`), 'assists']
            ]
        }
    })
    .then(dbData => {
        const dbDataClean = dbData.get({plain: true});
        return dbDataClean;
    })
    .then(player => {
        console.log(player);
        res.render('player', {player});
    })
    .catch(err => {
        console.error(err);
        res.redirect('/');
    })
})

module.exports = router;