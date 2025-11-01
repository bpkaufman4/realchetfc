const { MatchImage, Match } = require('../models');

async function seedMatchImages() {
    // Get all matches
    const matches = await Match.findAll();
    
    // Available images from the public/images directory
    const availableImages = [
        '/images/indoor-lineup.jpeg',
        '/images/outdoor-lineup.jpg',
        '/images/hi-five.jpg',
        '/images/thumbs-up.jpg',
        '/images/hero-home.png',
        '/images/matt-sideline.jpg',
        '/images/matt-tall.jpg',
        '/images/mo-red-line.jpg',
        '/images/nolan-one.jpg',
        '/images/davis-sad.jpg',
        '/images/ck-gk.jpg'
    ];
    
    const matchImagesSeed = [];
    
    // Add 1-3 images for each completed match (matches with scores)
    const completedMatches = matches.filter(match => match.ourScore !== null);
    
    completedMatches.forEach(match => {
        const numImages = Math.floor(Math.random() * 3) + 1; // 1-3 images per match
        const usedImages = new Set();
        
        for (let i = 0; i < numImages; i++) {
            let imageUrl;
            do {
                imageUrl = availableImages[Math.floor(Math.random() * availableImages.length)];
            } while (usedImages.has(imageUrl) && usedImages.size < availableImages.length);
            
            if (!usedImages.has(imageUrl)) {
                usedImages.add(imageUrl);
                matchImagesSeed.push({
                    matchId: match.matchId,
                    url: imageUrl
                });
            }
        }
    });
    
    // Add some images for a few upcoming matches too (pre-game photos)
    const upcomingMatches = matches.filter(match => match.ourScore === null);
    const someUpcomingMatches = upcomingMatches.slice(0, 2); // Just first 2 upcoming matches
    
    someUpcomingMatches.forEach(match => {
        // Pre-game photos - typically team lineup or training photos
        const preGameImages = [
            '/images/indoor-lineup.jpeg',
            '/images/outdoor-lineup.jpg'
        ];
        
        const imageUrl = preGameImages[Math.floor(Math.random() * preGameImages.length)];
        matchImagesSeed.push({
            matchId: match.matchId,
            url: imageUrl
        });
    });
    
    return MatchImage.bulkCreate(matchImagesSeed)
        .then(dbData => {
            console.log('Match images seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding match images:', err);
            throw err;
        });
}

module.exports = seedMatchImages;