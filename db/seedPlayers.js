const { Player, Position, College } = require('../models');

async function seedPlayers() {
    // First get the positions and colleges to reference their IDs
    const positions = await Position.findAll();
    const colleges = await College.findAll();
    
    const positionMap = {
        'Forward': positions.find(p => p.abbreviation === 'FWD')?.positionId,
        'Midfielder': positions.find(p => p.abbreviation === 'MID')?.positionId,
        'Defender': positions.find(p => p.abbreviation === 'DEF')?.positionId,
        'Goalkeeper': positions.find(p => p.abbreviation === 'GK')?.positionId
    };
    
    const getRandomCollege = () => colleges[Math.floor(Math.random() * colleges.length)]?.collegeId;
    
    const playersSeed = [
        // Forwards
        {
            firstName: 'Marcus',
            lastName: 'Johnson',
            bio: 'Dynamic forward with excellent pace and finishing ability.',
            number: '9',
            positionId: positionMap['Forward'],
            birthday: '1998-03-15',
            homeTown: 'Kansas City, MO',
            heightFeet: 6,
            heightInches: 1,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Carlos',
            lastName: 'Rodriguez',
            bio: 'Clinical finisher with great movement in the box.',
            number: '10',
            positionId: positionMap['Forward'],
            birthday: '1999-07-22',
            homeTown: 'Los Angeles, CA',
            heightFeet: 5,
            heightInches: 10,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'James',
            lastName: 'Wilson',
            bio: 'Versatile forward who can play anywhere across the front line.',
            number: '11',
            positionId: positionMap['Forward'],
            birthday: '2000-01-10',
            homeTown: 'Denver, CO',
            heightFeet: 5,
            heightInches: 11,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Diego',
            lastName: 'Santos',
            bio: 'Skillful winger with exceptional dribbling and crossing ability.',
            number: '7',
            positionId: positionMap['Forward'],
            birthday: '1997-11-05',
            homeTown: 'Miami, FL',
            heightFeet: 5,
            heightInches: 9,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Michael',
            lastName: 'Thompson',
            bio: 'Target man with great aerial ability and hold-up play.',
            number: '21',
            positionId: positionMap['Forward'],
            birthday: '1998-08-18',
            homeTown: 'Chicago, IL',
            heightFeet: 6,
            heightInches: 3,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Luis',
            lastName: 'Garcia',
            bio: 'Pacey winger who loves to take on defenders.',
            number: '17',
            positionId: positionMap['Forward'],
            birthday: '1999-12-03',
            homeTown: 'Phoenix, AZ',
            heightFeet: 5,
            heightInches: 8,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Alex',
            lastName: 'Morgan',
            bio: 'Creative forward with excellent vision and passing.',
            number: '22',
            positionId: positionMap['Forward'],
            birthday: '2000-04-25',
            homeTown: 'Seattle, WA',
            heightFeet: 5,
            heightInches: 10,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        // Midfielders
        {
            firstName: 'Tyler',
            lastName: 'Davis',
            bio: 'Box-to-box midfielder with great work rate and passing range.',
            number: '8',
            positionId: positionMap['Midfielder'],
            birthday: '1998-05-12',
            homeTown: 'Austin, TX',
            heightFeet: 5,
            heightInches: 11,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Ryan',
            lastName: 'Mitchell',
            bio: 'Defensive midfielder who excels at breaking up play.',
            number: '6',
            positionId: positionMap['Midfielder'],
            birthday: '1997-09-30',
            homeTown: 'Portland, OR',
            heightFeet: 6,
            heightInches: 0,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Jordan',
            lastName: 'Lee',
            bio: 'Creative attacking midfielder with excellent technical skills.',
            number: '14',
            positionId: positionMap['Midfielder'],
            birthday: '1999-02-17',
            homeTown: 'Atlanta, GA',
            heightFeet: 5,
            heightInches: 9,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Kevin',
            lastName: 'Brown',
            bio: 'Central midfielder with great vision and leadership qualities.',
            number: '4',
            positionId: positionMap['Midfielder'],
            birthday: '1996-06-08',
            homeTown: 'Boston, MA',
            heightFeet: 6,
            heightInches: 1,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Sebastian',
            lastName: 'Mueller',
            bio: 'Energetic midfielder with excellent stamina and work ethic.',
            number: '18',
            positionId: positionMap['Midfielder'],
            birthday: '1998-10-14',
            homeTown: 'Salt Lake City, UT',
            heightFeet: 5,
            heightInches: 10,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Nathan',
            lastName: 'Clark',
            bio: 'Versatile midfielder who can play multiple positions.',
            number: '15',
            positionId: positionMap['Midfielder'],
            birthday: '1999-08-27',
            homeTown: 'Nashville, TN',
            heightFeet: 5,
            heightInches: 11,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Andre',
            lastName: 'Williams',
            bio: 'Dynamic attacking midfielder with pace and creativity.',
            number: '19',
            positionId: positionMap['Midfielder'],
            birthday: '2000-03-11',
            homeTown: 'New Orleans, LA',
            heightFeet: 5,
            heightInches: 8,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Connor',
            lastName: 'O\'Brien',
            bio: 'Hard-working central midfielder with great passing accuracy.',
            number: '25',
            positionId: positionMap['Midfielder'],
            birthday: '1997-12-09',
            homeTown: 'Minneapolis, MN',
            heightFeet: 6,
            heightInches: 0,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Mateo',
            lastName: 'Vargas',
            bio: 'Technical midfielder with excellent ball control.',
            number: '23',
            positionId: positionMap['Midfielder'],
            birthday: '1999-05-16',
            homeTown: 'San Antonio, TX',
            heightFeet: 5,
            heightInches: 7,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        // Defenders
        {
            firstName: 'David',
            lastName: 'Anderson',
            bio: 'Solid center-back with great aerial ability and leadership.',
            number: '5',
            positionId: positionMap['Defender'],
            birthday: '1996-04-20',
            homeTown: 'Philadelphia, PA',
            heightFeet: 6,
            heightInches: 3,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Jake',
            lastName: 'Harrison',
            bio: 'Pacey full-back who loves to get forward and support attacks.',
            number: '3',
            positionId: positionMap['Defender'],
            birthday: '1998-07-14',
            homeTown: 'San Diego, CA',
            heightFeet: 5,
            heightInches: 10,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Samuel',
            lastName: 'Torres',
            bio: 'Reliable center-back with excellent positioning and tackling.',
            number: '13',
            positionId: positionMap['Defender'],
            birthday: '1997-01-28',
            homeTown: 'Houston, TX',
            heightFeet: 6,
            heightInches: 2,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Brandon',
            lastName: 'Scott',
            bio: 'Attacking full-back with great crossing ability.',
            number: '2',
            positionId: positionMap['Defender'],
            birthday: '1999-09-07',
            homeTown: 'Tampa, FL',
            heightFeet: 5,
            heightInches: 11,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Eric',
            lastName: 'Martinez',
            bio: 'Strong center-back who is dominant in the air.',
            number: '16',
            positionId: positionMap['Defender'],
            birthday: '1996-11-12',
            homeTown: 'Las Vegas, NV',
            heightFeet: 6,
            heightInches: 4,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Chris',
            lastName: 'Walker',
            bio: 'Versatile defender who can play anywhere across the back line.',
            number: '20',
            positionId: positionMap['Defender'],
            birthday: '1998-02-24',
            homeTown: 'Charlotte, NC',
            heightFeet: 6,
            heightInches: 0,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Caleb',
            lastName: 'Phillips',
            bio: 'Speedy left-back with excellent recovery pace.',
            number: '27',
            positionId: positionMap['Defender'],
            birthday: '2000-06-19',
            homeTown: 'Raleigh, NC',
            heightFeet: 5,
            heightInches: 9,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Mason',
            lastName: 'Green',
            bio: 'Solid defender with great game reading ability.',
            number: '26',
            positionId: positionMap['Defender'],
            birthday: '1997-08-05',
            homeTown: 'Columbus, OH',
            heightFeet: 6,
            heightInches: 1,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Isaiah',
            lastName: 'Cooper',
            bio: 'Young defender with great potential and athleticism.',
            number: '28',
            positionId: positionMap['Defender'],
            birthday: '2001-01-15',
            homeTown: 'Milwaukee, WI',
            heightFeet: 6,
            heightInches: 2,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        // Goalkeepers
        {
            firstName: 'Matthew',
            lastName: 'Roberts',
            bio: 'Experienced goalkeeper with excellent shot-stopping ability.',
            number: '1',
            positionId: positionMap['Goalkeeper'],
            birthday: '1995-03-08',
            homeTown: 'Richmond, VA',
            heightFeet: 6,
            heightInches: 4,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Noah',
            lastName: 'Kim',
            bio: 'Agile goalkeeper with great reflexes and distribution.',
            number: '12',
            positionId: positionMap['Goalkeeper'],
            birthday: '1998-10-21',
            homeTown: 'Portland, OR',
            heightFeet: 6,
            heightInches: 2,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        },
        {
            firstName: 'Gabriel',
            lastName: 'Silva',
            bio: 'Young goalkeeper with excellent potential and composure.',
            number: '30',
            positionId: positionMap['Goalkeeper'],
            birthday: '2000-12-04',
            homeTown: 'Orlando, FL',
            heightFeet: 6,
            heightInches: 3,
            collegeId: getRandomCollege(),
            countryCode: 'US'
        }
    ];
    
    return Player.bulkCreate(playersSeed)
        .then(dbData => {
            console.log('Players seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding players:', err);
            throw err;
        });
}

module.exports = seedPlayers;