const User = require('./User');
const Player = require('./Player');
const College = require('./College');
const Position = require('./Position');
const Match = require('./Match');
const BoxScore = require('./BoxScore');
const Eden = require('./Eden');
const MatchImage = require('./MatchImage');

Player.belongsTo(College, {foreignKey: 'collegeId'});
Player.belongsTo(Position, {foreignKey: 'positionId'});
College.hasMany(Player, {foreignKey: 'collegeId'});
Position.hasMany(Player, {foreignKey: 'positionId'});
BoxScore.belongsTo(Player, {foreignKey: 'playerId'});
Player.hasMany(BoxScore, {foreignKey: 'playerId'});
BoxScore.belongsTo(Match, {foreignKey: 'matchId'});
Match.hasMany(BoxScore, {foreignKey: 'matchId'});
MatchImage.belongsTo(Match, {foreignKey: 'matchId'});
Match.hasMany(MatchImage, {foreignKey: 'matchId'});

module.exports = { User, College, Position, Player, Match, BoxScore, Eden, MatchImage };