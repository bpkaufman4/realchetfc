const User = require('./User');
const Player = require('./Player');
const College = require('./College');
const Position = require('./Position');
const Match = require('./Match');

Player.belongsTo(College, {foreignKey: 'collegeId'});
Player.belongsTo(Position, {foreignKey: 'positionId'});
College.hasMany(Player, {foreignKey: 'collegeId'});
Position.hasMany(Player, {foreignKey: 'positionId'});

module.exports = { User, College, Position, Player, Match };