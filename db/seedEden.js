const { Eden } = require('../models');

async function seedEden() {
    const edenSeed = [
        {
            response: 'Generated player profile image with transparent background',
            executionId: 'exec_001_player_image',
            model: 'image-generation-v1',
            status: 'completed'
        },
        {
            response: 'Created team formation visualization',
            executionId: 'exec_002_formation',
            model: 'visualization-v2',
            status: 'completed'
        },
        {
            response: 'Generated match highlights video',
            executionId: 'exec_003_highlights',
            model: 'video-generation-v1',
            status: 'completed'
        },
        {
            response: 'Processing team statistics analysis',
            executionId: 'exec_004_stats',
            model: 'analytics-v1',
            status: 'processing'
        },
        {
            response: 'Created player comparison infographic',
            executionId: 'exec_005_comparison',
            model: 'infographic-v1',
            status: 'completed'
        },
        {
            response: null,
            executionId: 'exec_006_season_preview',
            model: 'content-generation-v1',
            status: 'processing'
        },
        {
            response: 'Generated social media content for match day',
            executionId: 'exec_007_social',
            model: 'content-generation-v1',
            status: 'completed'
        },
        {
            response: 'Error: Invalid player data provided',
            executionId: 'exec_008_player_card',
            model: 'card-generation-v1',
            status: 'failed'
        },
        {
            response: 'Created team roster poster',
            executionId: 'exec_009_roster',
            model: 'design-v2',
            status: 'completed'
        },
        {
            response: null,
            executionId: 'exec_010_match_prediction',
            model: 'prediction-v1',
            status: 'processing'
        }
    ];
    
    return Eden.bulkCreate(edenSeed)
        .then(dbData => {
            console.log('Eden data seeded successfully');
            return dbData;
        })
        .catch(err => {
            console.error('Error seeding Eden data:', err);
            throw err;
        });
}

module.exports = seedEden;