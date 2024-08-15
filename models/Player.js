const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class Player extends Model {};


Player.init(
    {
        playerId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bio: DataTypes.STRING,
        image: DataTypes.STRING,
        number: DataTypes.INTEGER,
        position: DataTypes.STRING,
        birthday: DataTypes.DATE
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        freezeTableName: true,
        underscored: false,
        modelName: 'player',
        paranoid: true
    }
);

module.exports = Player;