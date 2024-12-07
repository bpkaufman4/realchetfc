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
    ]
    
    Position.bulkCreate(positionsSeed)
    .then(dbData => {
        console.log(dbData);
    });
}

module.exports = seedPositions;