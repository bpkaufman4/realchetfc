const { Model, DataTypes } = require('sequelize');

class BoxScore extends Model {};

const sequelize = require('../config/connection');
const Player = require('./Player');
const Match = require('./Match');

BoxScore.init(
    {
        boxScoreId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        playerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Player,
                key: 'playerId'
            }
        },
        matchId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Match,
                key: 'matchId'
            }
        },
        goals: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        assists: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        notes: DataTypes.STRING
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        freezeTableName: true,
        underscored: false,
        modelName: 'boxScore',
        paranoid: false,
        indexes: [
            {
                unique: true,
                fields: ['playerId', 'matchId']
            }
        ]
    }
);

module.exports = BoxScore;