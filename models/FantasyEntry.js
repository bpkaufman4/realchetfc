const { Model, DataTypes } = require('sequelize');

class FantasyEntry extends Model { };

const sequelize = require('../config/connection');

FantasyEntry.init(
  {
    fantasyEntryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    seasonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'season',
        key: 'seasonId'
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teamName: {
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
    modelName: 'fantasyEntry',
    paranoid: false,
    indexes: [
      { unique: true, fields: ['firstName', 'lastName', 'seasonId'], name: 'fantasy_entry_name_season' }
    ]
  }
);

module.exports = FantasyEntry;