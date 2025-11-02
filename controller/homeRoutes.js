const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Position, Player, Match, BoxScore, College, MatchImage, Season, PlayerSeason, FantasyEntry, FantasyEntryPlayer } = require('../models');
const sequelize = require('../config/connection');
const { Op } = require('sequelize');
const { error } = require('console');
const { BlockList } = require('net');
router.get('/', (req, res) => {
    Player.findAll({
        attributes: {
            include: [
                [sequelize.literal(`((SELECT COUNT(*) FROM boxScore WHERE boxScore.playerId = player.playerId) + player.gamesModifier)`), 'games'],
                [sequelize.literal(`(ifnull((SELECT SUM(totalGoals.goals) from boxScore as totalGoals where totalGoals.playerId = player.playerId), 0) + player.goalsModifier)`), 'goals'],
                [sequelize.literal(`(ifnull((SELECT SUM(totalAssists.assists) from boxScore as totalAssists where totalAssists.playerId = player.playerId), 0) + player.assistsModifier)`), 'assists']
            ]
        },
        include: [College, Position],
        order: [['created', 'ASC']]
    })
        .then(dbData => {
            const templateData = { players: dbData.map(player => player.get({ plain: true })) };
            // console.log(templateData);
            res.render('home', templateData);
        })
        .catch(err => {
            console.log(err);
            res.render('404');
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
        try {
            if (!fs.existsSync('public/tempImages')) {
                fs.mkdirSync('public/tempImages');
            }
        } catch (err) {
            console.error(err);
        }
        fstream = fs.createWriteStream('public/' + relativePath);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.json({ status: 'success', fileName, url, relativePath });
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
})
router.get('/admin', (req, res) => {
    if (!req.session.admin) {
        res.redirect('login');
        return;
    }
    res.render('admin', { layout: 'admin' });
});

router.get('/admin-players', (req, res) => {
    if (!req.session.admin) {
        res.redirect('login');
        return;
    }

    const colleges = College.findAll()
        .then(dbData => {
            let dbDataClean = dbData.map(position => position.get({ plain: true }));
            return dbDataClean;
        });

    const positions = Position.findAll()
        .then(dbData => {
            let dbDataClean = dbData.map(position => position.get({ plain: true }));
            return dbDataClean;
        });

    const players = Player.findAll({ include: [Position, College] })
        .then(dbData => {
            let dbDataClean = dbData.map(player => player.get({ plain: true }));
            return dbDataClean;
        })

    Promise.all([positions, players, colleges])
        .then(data => {
            res.render('admin-players', { layout: 'admin', data: { positions: data[0], players: data[1], colleges: data[2] } });
        })
});

router.get('/admin-matches', (req, res) => {
    if (!req.session.admin) {
        res.redirect('login');
        return;
    }

    Match.findAll()
        .then(dbData => {
            let dbDataClean = dbData.map(match => match.get({ plain: true }));
            return dbDataClean;
        })
        .then(matches => {
            res.render('admin-matches', { layout: 'admin', matches });
        })

});

router.get('/admin-match/:id', (req, res) => {
    if (!req.session.admin) {
        res.redirect('login');
        return;
    }

    const match = Match.findOne({ where: { matchId: req.params.id }, include: { model: BoxScore, include: Player } })
        .then(dbData => {
            if (!dbData) {
                res.redirect('admin-matches');
                return;
            }
            const dbDataClean = dbData.get({ plain: true });
            return dbDataClean;
        });

    const boxScore = BoxScore.findAll({ where: { matchId: req.params.id }, include: { model: Player } })
        .then(dbData => {
            const dbDataClean = dbData.map(boxScore => boxScore.get({ plain: true }));
            return dbDataClean;
        })

    Promise.all([match, boxScore])
        .then(reply => {
            res.render('admin-match', { layout: 'admin', match: reply[0], boxScore: reply[1] });
        })
});

router.get('/settings', (req, res) => {
    if (!req.session.admin) {
        res.redirect('login');
        return;
    }

    const collegeData = College.findAll();
    const positionData = Position.findAll();
    const seasonData = Season.findAll();

    Promise.all([collegeData, positionData, seasonData]).then(([collegeData, positionData, seasonData]) => {
        const colleges = collegeData.map(college => college.get({ plain: true }));
        const positions = positionData.map(position => position.get({ plain: true }));
        const seasons = seasonData.map(season => season.get({ plain: true }));
        res.render('settings', { layout: 'admin', colleges, positions, seasons });
    })
})

router.get('/player/:id', (req, res) => {
    Player.findOne({
        where: { playerId: req.params.id },
        include: [Position, College],
        attributes: {
            include: [
                [sequelize.literal(`((SELECT COUNT(*) FROM boxScore WHERE boxScore.playerId = player.playerId) + player.gamesModifier)`), 'games'],
                [sequelize.literal(`(ifnull((SELECT SUM(totalGoals.goals) from boxScore as totalGoals where totalGoals.playerId = player.playerId), 0) + player.goalsModifier)`), 'goals'],
                [sequelize.literal(`(ifnull((SELECT SUM(totalAssists.assists) from boxScore as totalAssists where totalAssists.playerId = player.playerId), 0) + player.assistsModifier)`), 'assists']
            ]
        }
    })
        .then(dbData => {
            const dbDataClean = dbData.get({ plain: true });
            return dbDataClean;
        })
        .then(player => {
            // console.log(player);
            res.render('player', { player });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        })
});

router.get('/roster', (req, res) => {
    Player.findAll({
        order: [[sequelize.literal(`(player.number * 1)`), 'ASC']],
        include: [Position, College]
    })
        .then(dbData => {
            const dbDataClean = dbData.map(player => player.get({ plain: true }));
            return dbDataClean;
        })
        .then(players => {
            res.render('roster', { players });
        })
        .catch(err => {
            res.render('404');
        })
});

router.get('/schedule', (req, res) => {
    Match.findAll({
        order: [['startTime', 'DESC']]
    })
        .then(dbData => {
            const dbDataClean = dbData.map(match => match.get({ plain: true }));
            return dbDataClean;
        })
        .then(matches => {
            console.log(matches);
            res.render('schedule', { matches });
        })
        .catch(err => {
            console.log(err);
            res.render('404');
        })
});

router.get('/match/:id', (req, res) => {
    Match.findOne({
        where: { matchId: req.params.id },
        include: [
            {
                model: BoxScore,
                include: Player,
            },
            MatchImage
        ],
        order: [
            [
                BoxScore,
                Player,
                'number',
                sequelize.literal(' * 1'),
                'ASC'
            ]
        ]
    })
        .then(dbData => {
            return dbData.get({ plain: true });
        })
        .then(match => {
            console.log(match);
            res.render('match', { match });
        })
        .catch(err => {
            console.log(err);
            res.render('404');
        })
})

router.get('/season-roster/:seasonId', async (req, res) => {
    if (!req.session.admin) {
        res.redirect('login');
        return;
    }

    const seasonId = req.params.seasonId;
    
    try {
        // Get the season info
        const season = await Season.findByPk(seasonId);
        if (!season) {
            return res.redirect('/settings');
        }

        // Get all players with their basic info
        const allPlayers = await Player.findAll({
            include: [Position, College],
            order: [['lastName', 'ASC'], ['firstName', 'ASC']]
        });

        // Get players currently in this season
        const seasonRoster = await PlayerSeason.findAll({
            where: { seasonId },
            include: [Player]
        });

        // Create a map of players in the season for quick lookup
        const playersInSeason = new Set(seasonRoster.map(ps => ps.playerId));

        // Mark each player as in season or not
        const playersWithStatus = allPlayers.map(player => {
            const playerData = player.get({ plain: true });
            playerData.inSeason = playersInSeason.has(player.playerId);
            return playerData;
        });

        res.render('season-roster', { 
            layout: 'admin',
            season: season.get({ plain: true }),
            players: playersWithStatus 
        });
    } catch (err) {
        console.error('Season roster route error:', err);
        res.redirect('/settings');
    }
})

router.get('/fantasy', async (req, res) => {
    try {
        const currentDate = new Date();

        // Find the current or upcoming season
        let season = await Season.findOne({
            where: {
                startDate: {
                    [Op.lte]: currentDate
                },
                endDate: {
                    [Op.gte]: currentDate
                }
            },
            order: [['startDate', 'DESC']]
        });
        
        // If no current season, get the next upcoming season
        if (!season) {
            season = await Season.findOne({
                where: {
                    startDate: {
                        [Op.gt]: currentDate
                    }
                },
                order: [['startDate', 'ASC']]
            });
        }
        
        if (!season) {
            return res.redirect('/');
        }

        // Get all fantasy entries for this season with their players
        const fantasyEntries = await FantasyEntry.findAll({
            where: { seasonId: season.seasonId },
            include: [
                {
                    model: FantasyEntryPlayer,
                    include: [Player]
                }
            ]
        });
        
        // Calculate total points for each fantasy entry and sort by points
        const fantasyRankings = [];
        
        for (const entry of fantasyEntries) {
            const entryData = entry.get({ plain: true });
            let totalPoints = 0;
            
            // Calculate points for each player in this fantasy entry
            for (const fep of entryData.fantasyEntryPlayers) {
                const playerBoxScores = await BoxScore.findAll({
                    include: [
                        {
                            model: Match,
                            where: { seasonId: season.seasonId },
                            attributes: []
                        }
                    ],
                    where: { playerId: fep.player.playerId },
                    attributes: ['goals', 'assists']
                });
                
                const playerPoints = playerBoxScores.reduce((sum, boxScore) => {
                    return sum + (boxScore.goals || 0) + (boxScore.assists || 0);
                }, 0);
                
                fep.player.totalPoints = playerPoints;
                totalPoints += playerPoints;
            }
            
            fantasyRankings.push({
                ...entryData,
                totalPoints
            });
        }
        
        // Sort by total points in descending order
        fantasyRankings.sort((a, b) => b.totalPoints - a.totalPoints);        
        // Add rank to each entry
        fantasyRankings.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        const isOngoingSeason = currentDate >= season.startDate && currentDate <= season.endDate;
        const isUpcomingSeason = currentDate < season.startDate;

        // Get all available players for the season if it's upcoming
        let availablePlayers = [];
        if (isUpcomingSeason) {
            const playerSeasons = await PlayerSeason.findAll({
                where: { seasonId: season.seasonId },
                include: [
                    {
                        model: Player,
                        include: [Position, College]
                    }
                ]
            });
            availablePlayers = playerSeasons.map(ps => ps.player);
        }

        res.render('fantasy', {
            season: season.get({ plain: true }),
            fantasyRankings,
            isOngoingSeason,
            isUpcomingSeason,
            availablePlayers
        });

    } catch (err) {
        console.error('Fantasy route error:', err);
        res.redirect('/');
    }
});

module.exports = router;