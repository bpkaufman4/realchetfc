const { Model, DataTypes } = require('sequelize');

class Eden extends Model {};

const sequelize = require('../config/connection');

Eden.init(
    {
        edenId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        response: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        executionId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'processing'
        }
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        freezeTableName: true,
        underscored: false,
        modelName: 'eden',
        paranoid: false
    }
);

module.exports = Eden;