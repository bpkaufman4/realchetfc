const Sequelize = require('sequelize');

require('dotenv').config();

let sequelize;

// Connection pool configuration
const poolConfig = {
    max: 5,          // Maximum connections in pool
    min: 0,          // Minimum connections in pool
    acquire: 30000,  // Maximum time (ms) to get connection before throwing error
    idle: 10000,     // Maximum time (ms) connection can be idle before being released
    evict: 1000,     // Check for idle connections every 1 second
};

// Query counter for monitoring
let queryCount = 0;
let queryStartTime = Date.now();

// Custom logging function to track query usage
const customLogger = (query, timing) => {
    queryCount++;
    
    // Reset counter every hour to match JawsDB limit period
    const currentTime = Date.now();
    if (currentTime - queryStartTime > 3600000) { // 1 hour in milliseconds
        console.log(`🔄 Query counter reset. Previous hour: ${queryCount} queries`);
        queryCount = 1;
        queryStartTime = currentTime;
    }
    
    // Log query count every 50 queries and warn if approaching limit
    if (queryCount % 50 === 0) {
        console.log(`📊 Query Count: ${queryCount}/3600 (${((queryCount/3600)*100).toFixed(1)}%)`);
        
        if (queryCount > 2700) { // 75% of limit
            console.warn(`⚠️  WARNING: Approaching query limit! ${queryCount}/3600 queries used`);
        }
    }
    
    // Only log actual queries in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${queryCount}] ${query.slice(0, 100)}${query.length > 100 ? '...' : ''}`);
    }
};

// Optimized connection options
const connectionOptions = {
    dialect: 'mysql',
    pool: poolConfig,
    logging: customLogger, // Use our custom logger instead of console.log
    dialectOptions: {
        multipleStatements: true,
        // Additional MySQL optimizations
        supportBigNumbers: true,
        bigNumberStrings: true,
        decimalNumbers: true
    },
    // Prevent memory leaks
    define: {
        timestamps: true,
        freezeTableName: true
    }
};

if(process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL, connectionOptions);
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        ...connectionOptions
    });
}

module.exports = sequelize;