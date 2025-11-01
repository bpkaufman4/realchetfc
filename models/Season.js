const { Model, DataTypes } = require('sequelize');

class Season extends Model { };

const sequelize = require('../config/connection');

Season.init(
  {
    seasonId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    name: DataTypes.STRING
  },
  {
    sequelize,
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
    freezeTableName: true,
    underscored: false,
    modelName: 'season',
    paranoid: false
  }
);

module.exports = Season;