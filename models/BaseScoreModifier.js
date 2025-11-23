const { Model, DataTypes } = require('sequelize');

class BaseScoreModifier extends Model {};

const sequelize = require('../config/connection');

BaseScoreModifier.init(
    {
        baseScoreModifierId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        playerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'player',
                key: 'playerId'
            }
        },
        matchId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'match',
                key: 'matchId'
            }
        },
        modifier: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        freezeTableName: true,
        underscored: false,
        modelName: 'baseScoreModifier',
        paranoid: false
    }
);

module.exports = BaseScoreModifier;