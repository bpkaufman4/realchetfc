const { Position } = require('../models');

function seedPositions() {
    const positionsSeed = [
        {
            name: 'Forward',
            abbreviation: 'FWD'
        },
        {
            name: 'Midfielder',
            abbreviation: 'MID'
        },
        {
            name: 'Defender',
            abbreviation: 'DEF'
        },
        {
            name: 'Goalkeeper',
            abbreviation: 'GK'
        }
    ];
    
    return Position.bulkCreate(positionsSeed)
        .then(dbData => {
            console.log('Positions seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding positions:', err);
            throw err;
        });
}

module.exports = seedPositions;