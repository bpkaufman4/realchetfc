const { Model, DataTypes } = require('sequelize');

class MatchImage extends Model {};

const sequelize = require('../config/connection');

MatchImage.init(
    {
        matchImageId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        matchId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'match',
                key: 'matchId'
            }
        },
        url: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        freezeTableName: true,
        underscored: false,
        modelName: 'matchimage',
        paranoid: false
    }
);

module.exports = MatchImage;