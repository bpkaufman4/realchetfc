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

        // Get all matches for this season that have already occurred
        const matches = await Match.findAll({
            where: { 
                seasonId: season.seasonId,
                startTime: {
                    [Op.lte]: currentDate  // Only include matches that have already started
                }
            },
            order: [['startTime', 'DESC']]  // Most recent first
        });

        // OPTIMIZATION: Get all fantasy entries AND all box scores in a single query each
        const [fantasyEntries, allBoxScores] = await Promise.all([
            // Get all fantasy entries for this season with their players
            FantasyEntry.findAll({
                where: { seasonId: season.seasonId },
                include: [
                    {
                        model: FantasyEntryPlayer,
                        include: [Player]
                    }
                ]
            }),
            // Get ALL box scores for ALL matches in this season at once
            BoxScore.findAll({
                where: {
                    matchId: {
                        [Op.in]: matches.map(m => m.matchId)
                    }
                },
                include: [Player] // Include player data for reference
            })
        ]);

        // OPTIMIZATION: Create lookup maps for O(1) access instead of nested loops
        const boxScoreMap = new Map();
        allBoxScores.forEach(boxScore => {
            const key = `${boxScore.playerId}-${boxScore.matchId}`;
            boxScoreMap.set(key, boxScore);
        });
        
        // Calculate total points for each fantasy entry
        const fantasyRankings = [];
        
        for (const entry of fantasyEntries) {
            const entryData = entry.get({ plain: true });
            
            let totalPoints = 0;
            const gameBreakdowns = [];
            
            // Create a map to track each player's total points
            const playerTotals = {};
            entryData.fantasyEntryPlayers.forEach(fep => {
                playerTotals[fep.player.playerId] = 0;
            });
            
            // Calculate points for each match
            for (const match of matches) {
                const playerScores = [];
                
                // Calculate points for each player in this fantasy entry for this match
                for (const fep of entryData.fantasyEntryPlayers) {
                    const player = fep.player;
                    
                    // OPTIMIZATION: Use Map lookup instead of database query (O(1) vs O(n))
                    const key = `${player.playerId}-${match.matchId}`;
                    const boxScore = boxScoreMap.get(key);
                    
                    let matchPoints = 0;
                    let goals = 0;
                    let assists = 0;
                    let mvp = false;
                    
                    if (boxScore) {
                        // Player appeared in the match
                        goals = boxScore.goals || 0;
                        assists = boxScore.assists || 0;
                        mvp = boxScore.mvp || false;
                        
                        matchPoints += 1; // Appearance = 1 point
                        matchPoints += goals * 3; // Goals = 3 points each
                        matchPoints += assists * 2; // Assists = 2 points each
                        matchPoints += mvp ? 5 : 0; // MVP = 5 points
                        matchPoints += player.baseScore || 0; // Base score per game
                    }
                    
                    playerScores.push({
                        playerId: player.playerId,
                        playerName: `${player.firstName} ${player.lastName}`,
                        points: matchPoints,
                        appeared: !!boxScore,
                        goals: goals,
                        assists: assists,
                        mvp: mvp,
                        baseScore: player.baseScore || 0
                    });
                }
                
                // Sort players by points for this match (lowest first)
                playerScores.sort((a, b) => a.points - b.points);
                
                // Find players who appeared and didn't appear in this match
                const playersWhoAppeared = playerScores.filter(p => p.appeared);
                const playersWhoDidntAppear = playerScores.filter(p => !p.appeared);
                
                // Determine which player to omit based on who played
                let matchTotal = 0;
                let omittedPlayer = null;
                
                if (playersWhoDidntAppear.length > 0) {
                    // If one or more players didn't play, omit one of them (first one)
                    omittedPlayer = playersWhoDidntAppear[0];
                } else if (playersWhoAppeared.length > 0) {
                    // If all players played, omit the lowest scoring player who appeared
                    omittedPlayer = playersWhoAppeared[0];
                }
                
                if (omittedPlayer) {
                    // Sum points for all players except the omitted one and add to player totals
                    playerScores.forEach(player => {
                        if (player.playerId !== omittedPlayer.playerId) {
                            matchTotal += player.points;
                            playerTotals[player.playerId] += player.points;
                        }
                    });
                }
                
                
                gameBreakdowns.push({
                    matchId: match.matchId,
                    opponent: match.opponent,
                    date: match.startTime,
                    playerScores,
                    omittedPlayer,
                    matchTotal
                });
                
                totalPoints += matchTotal;
            }
            
            // Add total points to each player in the entry data
            entryData.fantasyEntryPlayers.forEach(fep => {
                fep.player.totalPoints = playerTotals[fep.player.playerId] || 0;
            });
            
            fantasyRankings.push({
                ...entryData,
                totalPoints,
                gameBreakdowns,
                lastGameBreakdown: gameBreakdowns.length > 0 ? gameBreakdowns[0] : null  // First game is now most recent
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
        console.error('=== FANTASY ROUTE ERROR ===');
        console.error('Error details:', err);
        console.error('Stack trace:', err.stack);
        res.redirect('/');
    }
});

module.exports = router;