const { Match, Season } = require('../models');

async function seedMatches() {
    // Get seasons to reference their IDs
    const seasons = await Season.findAll();
    const season2024 = seasons.find(s => s.name === '2024 Season');
    const season2025 = seasons.find(s => s.name === '2025 Season');
    
    const matchesSeed = [
        // 2024 Season Matches
        {
            opponent: 'Kansas City Rovers',
            location: 'Home',
            startTime: new Date('2024-04-15T15:00:00'),
            seasonId: season2024?.seasonId,
            ourScore: 2,
            opponentScore: 1
        },
        {
            opponent: 'St. Louis United',
            location: 'Away',
            startTime: new Date('2024-04-22T14:00:00'),
            seasonId: season2024?.seasonId,
            ourScore: 1,
            opponentScore: 3
        },
        {
            opponent: 'Denver FC',
            location: 'Home',
            startTime: new Date('2024-05-06T16:00:00'),
            seasonId: season2024?.seasonId,
            ourScore: 3,
            opponentScore: 0
        },
        {
            opponent: 'Chicago Fire Academy',
            location: 'Away',
            startTime: new Date('2024-05-13T13:00:00'),
            seasonId: season2024?.seasonId,
            ourScore: 1,
            opponentScore: 1
        },
        {
            opponent: 'Oklahoma City Thunder',
            location: 'Home',
            startTime: new Date('2024-05-27T15:30:00'),
            seasonId: season2024?.seasonId,
            ourScore: 4,
            opponentScore: 2
        },
        {
            opponent: 'Memphis City',
            location: 'Away',
            startTime: new Date('2024-06-10T14:30:00'),
            seasonId: season2024?.seasonId,
            ourScore: 0,
            opponentScore: 2
        },
        {
            opponent: 'Austin FC Reserve',
            location: 'Home',
            startTime: new Date('2024-06-24T17:00:00'),
            seasonId: season2024?.seasonId,
            ourScore: 2,
            opponentScore: 2
        },
        {
            opponent: 'Nashville SC Academy',
            location: 'Away',
            startTime: new Date('2024-07-08T15:00:00'),
            seasonId: season2024?.seasonId,
            ourScore: 3,
            opponentScore: 1
        },
        {
            opponent: 'Tulsa Roughnecks',
            location: 'Home',
            startTime: new Date('2024-07-22T16:30:00'),
            seasonId: season2024?.seasonId,
            ourScore: 1,
            opponentScore: 0
        },
        {
            opponent: 'Des Moines Menace',
            location: 'Away',
            startTime: new Date('2024-08-05T14:00:00'),
            seasonId: season2024?.seasonId,
            ourScore: 2,
            opponentScore: 3
        },
        {
            opponent: 'Wichita FC',
            location: 'Home',
            startTime: new Date('2024-08-19T15:00:00'),
            seasonId: season2024?.seasonId,
            ourScore: 5,
            opponentScore: 1
        },
        {
            opponent: 'Springfield Demize',
            location: 'Away',
            startTime: new Date('2024-09-02T13:30:00'),
            seasonId: season2024?.seasonId,
            ourScore: 1,
            opponentScore: 1
        },
        
        // 2025 Season Matches (some completed, some upcoming)
        {
            opponent: 'Kansas City Rovers',
            location: 'Away',
            startTime: new Date('2025-04-20T14:00:00'),
            seasonId: season2025?.seasonId,
            ourScore: 2,
            opponentScore: 0
        },
        {
            opponent: 'St. Louis United',
            location: 'Home',
            startTime: new Date('2025-05-04T16:00:00'),
            seasonId: season2025?.seasonId,
            ourScore: 3,
            opponentScore: 2
        },
        {
            opponent: 'Denver FC',
            location: 'Away',
            startTime: new Date('2025-05-18T15:30:00'),
            seasonId: season2025?.seasonId,
            ourScore: 1,
            opponentScore: 2
        },
        {
            opponent: 'Chicago Fire Academy',
            location: 'Home',
            startTime: new Date('2025-06-01T17:00:00'),
            seasonId: season2025?.seasonId,
            ourScore: 4,
            opponentScore: 1
        },
        {
            opponent: 'Oklahoma City Thunder',
            location: 'Away',
            startTime: new Date('2025-06-15T14:30:00'),
            seasonId: season2025?.seasonId,
            ourScore: 2,
            opponentScore: 2
        },
        {
            opponent: 'Memphis City',
            location: 'Home',
            startTime: new Date('2025-06-29T16:30:00'),
            seasonId: season2025?.seasonId,
            ourScore: 3,
            opponentScore: 0
        },
        {
            opponent: 'Austin FC Reserve',
            location: 'Away',
            startTime: new Date('2025-07-13T15:00:00'),
            seasonId: season2025?.seasonId,
            ourScore: 1,
            opponentScore: 3
        },
        {
            opponent: 'Nashville SC Academy',
            location: 'Home',
            startTime: new Date('2025-07-27T17:30:00'),
            seasonId: season2025?.seasonId,
            ourScore: 2,
            opponentScore: 1
        },
        // Upcoming matches (no scores yet)
        {
            opponent: 'Tulsa Roughnecks',
            location: 'Away',
            startTime: new Date('2025-11-10T14:00:00'),
            seasonId: season2025?.seasonId,
            ourScore: null,
            opponentScore: null
        },
        {
            opponent: 'Des Moines Menace',
            location: 'Home',
            startTime: new Date('2025-11-24T15:00:00'),
            seasonId: season2025?.seasonId,
            ourScore: null,
            opponentScore: null
        }
    ];
    
    return Match.bulkCreate(matchesSeed)
        .then(dbData => {
            console.log('Matches seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding matches:', err);
            throw err;
        });
}

module.exports = seedMatches;