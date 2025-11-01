const { Model, DataTypes } = require('sequelize');

class PlayerSeason extends Model { };

const sequelize = require('../config/connection');

PlayerSeason.init(
  {
    playerSeasonId: {
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
    seasonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'season',
        key: 'seasonId'
      }
    }
  },
  {
    sequelize,
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
    freezeTableName: true,
    underscored: false,
    modelName: 'playerSeason',
    paranoid: false
  }
);

module.exports = PlayerSeason;