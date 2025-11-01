const { Model, DataTypes } = require('sequelize');

class FantasyEntryPlayer extends Model { };

const sequelize = require('../config/connection');

FantasyEntryPlayer.init(
  {
    fantasyEntryPlayerId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    fantasyEntryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'fantasyEntry',
        key: 'fantasyEntryId'
      }
    },
    playerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'player',
        key: 'playerId'
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
    modelName: 'fantasyEntryPlayer',
    paranoid: false,
    indexes: [
      { unique: true, fields: ['fantasyEntryId', 'playerId'] }
    ]
  }
);

module.exports = FantasyEntryPlayer;