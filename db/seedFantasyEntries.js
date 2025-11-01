const { FantasyEntry, Season } = require('../models');

async function seedFantasyEntries() {
    // Get seasons to reference their IDs
    const seasons = await Season.findAll();
    const season2024 = seasons.find(s => s.name === '2024 Season');
    const season2025 = seasons.find(s => s.name === '2025 Season');
    
    const fantasyEntriesSeed = [
        // 2024 Season Fantasy Entries
        {
            seasonId: season2024?.seasonId,
            email: 'john.smith@email.com',
            firstName: 'John',
            lastName: 'Smith',
            teamName: 'KC Warriors'
        },
        {
            seasonId: season2024?.seasonId,
            email: 'sarah.johnson@email.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
            teamName: 'Goal Diggers'
        },
        {
            seasonId: season2024?.seasonId,
            email: 'mike.davis@email.com',
            firstName: 'Mike',
            lastName: 'Davis',
            teamName: 'Soccer Stars'
        },
        {
            seasonId: season2024?.seasonId,
            email: 'emily.wilson@email.com',
            firstName: 'Emily',
            lastName: 'Wilson',
            teamName: 'The Kickers'
        },
        {
            seasonId: season2024?.seasonId,
            email: 'david.brown@email.com',
            firstName: 'David',
            lastName: 'Brown',
            teamName: 'FC Thunder'
        },
        {
            seasonId: season2024?.seasonId,
            email: 'lisa.garcia@email.com',
            firstName: 'Lisa',
            lastName: 'Garcia',
            teamName: 'Dream Team FC'
        },
        {
            seasonId: season2024?.seasonId,
            email: 'chris.martinez@email.com',
            firstName: 'Chris',
            lastName: 'Martinez',
            teamName: 'Pitch Perfect'
        },
        {
            seasonId: season2024?.seasonId,
            email: 'amanda.taylor@email.com',
            firstName: 'Amanda',
            lastName: 'Taylor',
            teamName: 'Net Busters'
        },
        
        // 2025 Season Fantasy Entries (some returning users, some new)
        {
            seasonId: season2025?.seasonId,
            email: 'john.smith@email.com',
            firstName: 'John',
            lastName: 'Smith',
            teamName: 'KC Warriors United'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'sarah.johnson@email.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
            teamName: 'Goal Diggers 2.0'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'mike.davis@email.com',
            firstName: 'Mike',
            lastName: 'Davis',
            teamName: 'Soccer Legends'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'jessica.lee@email.com',
            firstName: 'Jessica',
            lastName: 'Lee',
            teamName: 'Rising Phoenix'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'ryan.anderson@email.com',
            firstName: 'Ryan',
            lastName: 'Anderson',
            teamName: 'Elite Eleven'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'megan.white@email.com',
            firstName: 'Megan',
            lastName: 'White',
            teamName: 'Victory Vipers'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'alex.thompson@email.com',
            firstName: 'Alex',
            lastName: 'Thompson',
            teamName: 'Champions Club'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'natalie.moore@email.com',
            firstName: 'Natalie',
            lastName: 'Moore',
            teamName: 'Mighty Strikers'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'brandon.clark@email.com',
            firstName: 'Brandon',
            lastName: 'Clark',
            teamName: 'Field Generals'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'rachel.rodriguez@email.com',
            firstName: 'Rachel',
            lastName: 'Rodriguez',
            teamName: 'Golden Boots'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'kevin.lewis@email.com',
            firstName: 'Kevin',
            lastName: 'Lewis',
            teamName: 'Tactical Titans'
        },
        {
            seasonId: season2025?.seasonId,
            email: 'stephanie.walker@email.com',
            firstName: 'Stephanie',
            lastName: 'Walker',
            teamName: 'Power Players'
        }
    ];
    
    return FantasyEntry.bulkCreate(fantasyEntriesSeed)
        .then(dbData => {
            console.log('Fantasy entries seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding fantasy entries:', err);
            throw err;
        });
}

module.exports = seedFantasyEntries;