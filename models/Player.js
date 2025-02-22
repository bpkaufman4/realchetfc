const { Model, DataTypes } = require('sequelize');
const College = require('./College');

class Player extends Model {};

const sequelize = require('../config/connection');
const Position = require('./Position');

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
        bio: DataTypes.STRING(5000),
        image: DataTypes.STRING,
        imageNoBackground: DataTypes.STRING,
        number: DataTypes.STRING,
        positionId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: Position,
                key: 'positionId'
            }
        },
        birthday: DataTypes.DATEONLY,
        homeTown: DataTypes.STRING,
        heightFeet: DataTypes.INTEGER,
        heightInches: DataTypes.INTEGER,
        collegeId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: College,
                key: 'collegeId'
            }
        },
        countryCode: DataTypes.STRING,
        goalsModifier: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        assistsModifier: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        gamesModifier: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        freezeTableName: true,
        underscored: false,
        modelName: 'player',
        paranoid: false
    }
);

module.exports = Player;