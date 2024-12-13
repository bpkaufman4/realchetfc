const { Model, DataTypes } = require('sequelize');

class Position extends Model {};

const sequelize = require('../config/connection');

Position.init(
    {
        positionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        abbreviation: {
            type: DataTypes.STRING,
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
        modelName: 'position',
        paranoid: false
    }
);

module.exports = Position;