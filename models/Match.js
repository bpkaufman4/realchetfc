const { Model, DataTypes } = require('sequelize');

class Match extends Model {};

const sequelize = require('../config/connection');

Match.init(
    {
        matchId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        opponent: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        seasonId: {
            type: DataTypes.UUID,
            references: {
                model: 'season',
                key: 'seasonId'
            }
        },
        ourScore: DataTypes.INTEGER,
        opponentScore: DataTypes.INTEGER
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        freezeTableName: true,
        underscored: false,
        modelName: 'match',
        paranoid: false
    }
);

module.exports = Match;