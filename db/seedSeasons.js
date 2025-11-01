const { Season } = require('../models');

function seedSeasons() {
    const seasonsSeed = [
        {
            name: '2024 Season',
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-10-31')
        },
        {
            name: '2025 Season',
            startDate: new Date('2025-03-01'),
            endDate: new Date('2025-10-31')
        },
        {
            name: '2026 Season',
            startDate: new Date('2026-03-01'),
            endDate: new Date('2026-10-31')
        }
    ];
    
    return Season.bulkCreate(seasonsSeed)
        .then(dbData => {
            console.log('Seasons seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding seasons:', err);
            throw err;
        });
}

module.exports = seedSeasons;