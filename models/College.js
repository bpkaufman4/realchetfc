const { Model, DataTypes } = require('sequelize');

class College extends Model {};

const sequelize = require('../config/connection');

College.init(
    {
        collegeId: {
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
        },
        logoUrl: DataTypes.STRING
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        freezeTableName: true,
        underscored: false,
        modelName: 'college',
        paranoid: true
    }
);

module.exports = College;