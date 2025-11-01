const { College } = require('../models');

function seedColleges() {
    const collegesSeed = [
        {
            name: 'University of Kansas',
            abbreviation: 'KU',
            logoUrl: '/images/jayhawk.png'
        },
        {
            name: 'Kansas State University',
            abbreviation: 'KSU',
            logoUrl: null
        },
        {
            name: 'University of Missouri',
            abbreviation: 'MU',
            logoUrl: null
        },
        {
            name: 'Stanford University',
            abbreviation: 'STAN',
            logoUrl: null
        },
        {
            name: 'University of California, Los Angeles',
            abbreviation: 'UCLA',
            logoUrl: null
        },
        {
            name: 'Duke University',
            abbreviation: 'DUKE',
            logoUrl: null
        },
        {
            name: 'University of North Carolina',
            abbreviation: 'UNC',
            logoUrl: null
        },
        {
            name: 'Georgetown University',
            abbreviation: 'GTOWN',
            logoUrl: null
        },
        {
            name: 'University of Connecticut',
            abbreviation: 'UCONN',
            logoUrl: null
        },
        {
            name: 'Creighton University',
            abbreviation: 'CREIGH',
            logoUrl: null
        }
    ];
    
    return College.bulkCreate(collegesSeed)
        .then(dbData => {
            console.log('Colleges seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding colleges:', err);
            throw err;
        });
}

module.exports = seedColleges;